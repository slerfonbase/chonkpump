"use client"

import { useState, useEffect, useCallback } from "react"
import { ChonkLogo } from "@/components/chonk-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Block {
  id: number
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface GameState {
  isPlaying: boolean
  gameOver: boolean
  score: number
  level: number
  tokensEarned: number
  highScore: number
  perfectStacks: number
}

export default function TokenStackerGame() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    gameOver: false,
    score: 0,
    level: 1,
    tokensEarned: 0,
    highScore: 4500,
    perfectStacks: 0,
  })

  const [blocks, setBlocks] = useState<Block[]>([])
  const [currentBlock, setCurrentBlock] = useState<Block | null>(null)
  const [direction, setDirection] = useState(1)
  const [gameSpeed, setGameSpeed] = useState(1000)

  const GAME_WIDTH = 400
  const GAME_HEIGHT = 600
  const BLOCK_HEIGHT = 40
  const INITIAL_WIDTH = 200

  const colors = ["#ff00ff", "#00ffff", "#ffff00", "#ff6600", "#00ff00", "#ff0066"]

  const startGame = () => {
    const baseBlock: Block = {
      id: 0,
      x: GAME_WIDTH / 2 - INITIAL_WIDTH / 2,
      y: GAME_HEIGHT - BLOCK_HEIGHT,
      width: INITIAL_WIDTH,
      height: BLOCK_HEIGHT,
      color: colors[0],
    }

    setBlocks([baseBlock])
    setGameState({
      isPlaying: true,
      gameOver: false,
      score: 0,
      level: 1,
      tokensEarned: 0,
      highScore: gameState.highScore,
      perfectStacks: 0,
    })
    setGameSpeed(1000)
    spawnNewBlock(baseBlock)
  }

  const spawnNewBlock = (lastBlock: Block) => {
    const newBlock: Block = {
      id: lastBlock.id + 1,
      x: 0,
      y: lastBlock.y - BLOCK_HEIGHT,
      width: lastBlock.width,
      height: BLOCK_HEIGHT,
      color: colors[lastBlock.id % colors.length],
    }
    setCurrentBlock(newBlock)
    setDirection(1)
  }

  const moveCurrentBlock = useCallback(() => {
    if (!currentBlock || !gameState.isPlaying) return

    setCurrentBlock((prev) => {
      if (!prev) return null

      let newX = prev.x + direction * 3
      let newDirection = direction

      if (newX <= 0) {
        newX = 0
        newDirection = 1
      } else if (newX + prev.width >= GAME_WIDTH) {
        newX = GAME_WIDTH - prev.width
        newDirection = -1
      }

      setDirection(newDirection)

      return {
        ...prev,
        x: newX,
      }
    })
  }, [currentBlock, direction, gameState.isPlaying])

  // Block movement animation
  useEffect(() => {
    if (!gameState.isPlaying || !currentBlock) return

    const interval = setInterval(moveCurrentBlock, 50)
    return () => clearInterval(interval)
  }, [gameState.isPlaying, currentBlock, moveCurrentBlock])

  const dropBlock = () => {
    if (!currentBlock || !gameState.isPlaying) return

    const lastBlock = blocks[blocks.length - 1]

    // Calculate overlap
    const leftEdge = Math.max(currentBlock.x, lastBlock.x)
    const rightEdge = Math.min(currentBlock.x + currentBlock.width, lastBlock.x + lastBlock.width)
    const overlap = rightEdge - leftEdge

    if (overlap <= 0) {
      // No overlap - game over
      endGame()
      return
    }

    // Create the new block with trimmed width
    const newBlock: Block = {
      ...currentBlock,
      x: leftEdge,
      width: overlap,
    }

    // Check for perfect stack
    const isPerfect = Math.abs(overlap - lastBlock.width) < 5
    const points = isPerfect ? 100 : Math.floor(overlap / 2)
    const tokens = isPerfect ? 20 : Math.floor(points / 5)

    setBlocks((prev) => [...prev, newBlock])
    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      tokensEarned: prev.tokensEarned + tokens,
      level: prev.level + 1,
      perfectStacks: isPerfect ? prev.perfectStacks + 1 : prev.perfectStacks,
    }))

    // Increase speed every 5 levels
    if ((gameState.level + 1) % 5 === 0) {
      setGameSpeed((prev) => Math.max(prev - 100, 300))
    }

    // Check if game should continue
    if (newBlock.width < 20) {
      endGame()
      return
    }

    spawnNewBlock(newBlock)
  }

  const endGame = () => {
    const newHighScore = Math.max(gameState.score, gameState.highScore)
    setGameState((prev) => ({
      ...prev,
      isPlaying: false,
      gameOver: true,
      highScore: newHighScore,
    }))
    setCurrentBlock(null)
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameState.isPlaying) {
        e.preventDefault()
        dropBlock()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState.isPlaying, currentBlock, blocks])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChonkLogo size={50} />
              <div>
                <h1 className="text-2xl font-bold text-accent">Token Stacker</h1>
                <p className="text-sm text-muted-foreground">Stack tokens to maximize rewards!</p>
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!gameState.isPlaying && !gameState.gameOver && (
          <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-accent neon-text">Ready to Stack?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-muted-foreground">
                Time your drops perfectly to build the highest tower and earn maximum CHONK tokens!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="font-bold text-accent">How to Play</div>
                  <div className="text-muted-foreground mt-2">
                    • Press SPACEBAR to drop blocks
                    <br />• Stack blocks on top of each other
                    <br />• Perfect alignment = bonus points
                    <br />• Game ends when blocks get too small
                  </div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="font-bold text-primary">High Score</div>
                  <div className="text-muted-foreground mt-2">
                    Current: {gameState.highScore.toLocaleString()}
                    <br />
                    Beat your record for bonus tokens!
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold px-12 py-6 text-xl"
              >
                Start Stacking!
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Game Area */}
          <div className="flex-1">
            <div
              className="relative mx-auto border-2 border-primary/50 rounded-lg overflow-hidden bg-black"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
            >
              {/* Background grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: Math.floor(GAME_HEIGHT / 40) }).map((_, i) => (
                  <div key={i} className="absolute w-full border-t border-primary/20" style={{ top: i * 40 }} />
                ))}
              </div>

              {/* Render blocks */}
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className="absolute shadow-lg"
                  style={{
                    left: block.x,
                    top: block.y,
                    width: block.width,
                    height: block.height,
                    backgroundColor: block.color,
                    boxShadow: `0 0 10px ${block.color}50`,
                  }}
                />
              ))}

              {/* Current moving block */}
              {currentBlock && gameState.isPlaying && (
                <div
                  className="absolute shadow-lg animate-pulse"
                  style={{
                    left: currentBlock.x,
                    top: currentBlock.y,
                    width: currentBlock.width,
                    height: currentBlock.height,
                    backgroundColor: currentBlock.color,
                    boxShadow: `0 0 15px ${currentBlock.color}`,
                  }}
                />
              )}

              {gameState.isPlaying && (
                <div className="absolute bottom-4 left-4 right-4 text-center text-white/80 text-sm">
                  Press SPACEBAR to drop
                </div>
              )}
            </div>
          </div>

          {/* Game Stats */}
          <div className="w-full lg:w-80 space-y-4">
            {gameState.isPlaying && (
              <>
                <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score:</span>
                      <span className="font-bold text-accent">{gameState.score.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Level:</span>
                      <span className="font-bold text-primary">{gameState.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="font-bold text-secondary">{gameState.tokensEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Perfect Stacks:</span>
                      <span className="font-bold text-destructive">{gameState.perfectStacks}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-sm text-primary">Pro Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-2">
                    <p>• Perfect alignment gives 100 points + 20 tokens</p>
                    <p>• Game speed increases every 5 levels</p>
                    <p>• Blocks get smaller with each miss</p>
                    <p>• Aim for the center for best results</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {gameState.gameOver && (
          <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center mt-8">
            <CardHeader>
              <CardTitle className="text-3xl text-accent neon-text">Tower Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{gameState.score.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Final Score</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{gameState.level}</div>
                  <div className="text-sm text-muted-foreground">Levels Reached</div>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{gameState.tokensEarned}</div>
                  <div className="text-sm text-muted-foreground">CHONK Earned</div>
                </div>
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{gameState.perfectStacks}</div>
                  <div className="text-sm text-muted-foreground">Perfect Stacks</div>
                </div>
              </div>

              {gameState.score === gameState.highScore && gameState.score > 0 && (
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-primary font-bold">🎉 NEW HIGH SCORE! 🎉</div>
                  <div className="text-sm text-muted-foreground mt-1">Bonus: +300 CHONK tokens!</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-accent hover:bg-accent/80 text-accent-foreground font-bold px-8 py-4"
                >
                  Stack Again
                </Button>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 font-bold px-8 py-4 bg-transparent"
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
