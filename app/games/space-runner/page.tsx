"use client"

import { useState, useEffect, useRef } from "react"
import { ChonkLogo } from "@/components/chonk-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface GameState {
  isPlaying: boolean
  gameOver: boolean
  score: number
  distance: number
  speed: number
  tokensEarned: number
  highScore: number
}

interface GameObject {
  x: number
  y: number
  width: number
  height: number
  type: "obstacle" | "token" | "powerup"
}

export default function SpaceRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    score: 0,
    distance: 0,
    speed: 2,
    tokensEarned: 0,
    highScore: 8900,
  })

  const [player, setPlayer] = useState({
    x: 100,
    y: 200,
    width: 40,
    height: 40,
    velocityY: 0,
    isJumping: false,
  })

  const [objects, setObjects] = useState<GameObject[]>([])
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({})

  // Game constants
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const GROUND_Y = 300

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.code]: true }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.code]: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Jump logic
  useEffect(() => {
    if ((keys["Space"] || keys["ArrowUp"]) && !player.isJumping && gameState.isPlaying) {
      setPlayer((prev) => ({
        ...prev,
        velocityY: JUMP_FORCE,
        isJumping: true,
      }))
    }
  }, [keys, player.isJumping, gameState.isPlaying])

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying) return

    const gameLoop = () => {
      // Update player physics
      setPlayer((prev) => {
        let newY = prev.y + prev.velocityY
        let newVelocityY = prev.velocityY + GRAVITY
        let newIsJumping = prev.isJumping

        if (newY >= GROUND_Y) {
          newY = GROUND_Y
          newVelocityY = 0
          newIsJumping = false
        }

        return {
          ...prev,
          y: newY,
          velocityY: newVelocityY,
          isJumping: newIsJumping,
        }
      })

      // Update game objects
      setObjects((prev) => {
        const updated = prev
          .map((obj) => ({
            ...obj,
            x: obj.x - gameState.speed,
          }))
          .filter((obj) => obj.x > -obj.width)

        // Spawn new objects
        if (Math.random() < 0.02) {
          const type = Math.random() < 0.7 ? "obstacle" : Math.random() < 0.9 ? "token" : "powerup"
          updated.push({
            x: 800,
            y: type === "obstacle" ? GROUND_Y - 30 : GROUND_Y - Math.random() * 100 - 50,
            width: type === "obstacle" ? 30 : 20,
            height: type === "obstacle" ? 30 : 20,
            type,
          })
        }

        return updated
      })

      // Update game state
      setGameState((prev) => ({
        ...prev,
        distance: prev.distance + 1,
        score: prev.score + 1,
        speed: Math.min(prev.speed + 0.001, 8),
      }))

      // Check collisions
      const collision = objects.some((obj) => {
        if (obj.type === "obstacle") {
          return (
            player.x < obj.x + obj.width &&
            player.x + player.width > obj.x &&
            player.y < obj.y + obj.height &&
            player.y + player.height > obj.y
          )
        }
        return false
      })

      if (collision) {
        endGame()
        return
      }

      // Collect tokens
      setObjects((prev) => {
        const collected = prev.filter((obj) => {
          if (obj.type === "token" || obj.type === "powerup") {
            const isCollected =
              player.x < obj.x + obj.width &&
              player.x + player.width > obj.x &&
              player.y < obj.y + obj.height &&
              player.y + player.height > obj.y

            if (isCollected) {
              setGameState((prevState) => ({
                ...prevState,
                score: prevState.score + (obj.type === "token" ? 50 : 100),
                tokensEarned: prevState.tokensEarned + (obj.type === "token" ? 5 : 10),
              }))
              return false
            }
          }
          return true
        })
        return collected
      })

      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.speed, player, objects])

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw cyberpunk background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#1a0033")
    gradient.addColorStop(1, "#000011")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#ff00ff20"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    // Draw ground
    ctx.fillStyle = "#ff00ff40"
    ctx.fillRect(0, GROUND_Y + 40, canvas.width, 10)

    if (gameState.isPlaying) {
      // Draw player (space cat)
      ctx.fillStyle = "#00ffff"
      ctx.fillRect(player.x, player.y, player.width, player.height)

      // Add glow effect
      ctx.shadowColor = "#00ffff"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, player.height - 10)
      ctx.shadowBlur = 0

      // Draw objects
      objects.forEach((obj) => {
        if (obj.type === "obstacle") {
          ctx.fillStyle = "#ff0066"
          ctx.shadowColor = "#ff0066"
          ctx.shadowBlur = 5
        } else if (obj.type === "token") {
          ctx.fillStyle = "#ffff00"
          ctx.shadowColor = "#ffff00"
          ctx.shadowBlur = 8
        } else {
          ctx.fillStyle = "#00ff00"
          ctx.shadowColor = "#00ff00"
          ctx.shadowBlur = 8
        }

        ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
        ctx.shadowBlur = 0
      })
    }
  }, [player, objects, gameState.isPlaying])

  const startGame = () => {
    setGameState({
      isPlaying: true,
      gameOver: false,
      score: 0,
      distance: 0,
      speed: 2,
      tokensEarned: 0,
      highScore: gameState.highScore,
    })
    setPlayer({
      x: 100,
      y: GROUND_Y,
      width: 40,
      height: 40,
      velocityY: 0,
      isJumping: false,
    })
    setObjects([])
  }

  const endGame = () => {
    const newHighScore = Math.max(gameState.score, gameState.highScore)
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      gameOver: true,
      highScore: newHighScore,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChonkLogo size={50} />
              <div>
                <h1 className="text-2xl font-bold text-secondary">Space Runner</h1>
                <p className="text-sm text-muted-foreground">Navigate through the cyberpunk city!</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!gameState.isPlaying && !gameState.gameOver && (
          <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-secondary neon-text">Ready to Run?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-muted-foreground">
                Jump over obstacles and collect tokens in this endless cyberpunk runner!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="font-bold text-secondary">Controls</div>
                  <div className="text-muted-foreground mt-2">
                    • SPACEBAR or UP ARROW to jump
                    <br />• Avoid red obstacles
                    <br />• Collect yellow tokens
                  </div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="font-bold text-accent">High Score</div>
                  <div className="text-muted-foreground mt-2">
                    Current: {gameState.highScore.toLocaleString()}
                    <br />
                    Distance: {Math.floor(gameState.highScore / 10)}m
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold px-12 py-6 text-xl"
              >
                Start Running!
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full border border-border rounded-lg bg-black"
          />

          {gameState.isPlaying && (
            <div className="absolute top-4 left-4 space-y-2">
              <div className="bg-black/80 text-white px-3 py-1 rounded text-sm">
                Score: {gameState.score.toLocaleString()}
              </div>
              <div className="bg-black/80 text-white px-3 py-1 rounded text-sm">
                Distance: {Math.floor(gameState.distance / 10)}m
              </div>
              <div className="bg-black/80 text-white px-3 py-1 rounded text-sm">Tokens: {gameState.tokensEarned}</div>
            </div>
          )}

          {gameState.isPlaying && (
            <div className="absolute bottom-4 right-4 text-white/60 text-sm">Press SPACE to jump</div>
          )}
        </div>

        {gameState.gameOver && (
          <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center mt-8">
            <CardHeader>
              <CardTitle className="text-3xl text-secondary neon-text">Game Over!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary">{gameState.score.toLocaleString()}</div>
                  <div className="text-muted-foreground">Final Score</div>
                </div>
                <div className="p-6 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary">{gameState.tokensEarned}</div>
                  <div className="text-muted-foreground">CHONK Earned</div>
                </div>
                <div className="p-6 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent">{Math.floor(gameState.distance / 10)}m</div>
                  <div className="text-muted-foreground">Distance</div>
                </div>
              </div>

              {gameState.score === gameState.highScore && gameState.score > 0 && (
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-destructive font-bold">🎉 NEW HIGH SCORE! 🎉</div>
                  <div className="text-sm text-muted-foreground mt-1">Bonus: +200 CHONK tokens!</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold px-8 py-4"
                >
                  Run Again
                </Button>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent/10 font-bold px-8 py-4 bg-transparent"
                  >
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
