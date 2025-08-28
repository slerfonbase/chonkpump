"use client"

import { useState, useEffect, useCallback } from "react"
import { ChonkLogo } from "@/components/chonk-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

interface GameState {
  score: number
  tokensEarned: number
  clickPower: number
  multiplier: number
  timeLeft: number
  isPlaying: boolean
  gameOver: boolean
  highScore: number
}

export default function PumpClickerGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    tokensEarned: 0,
    clickPower: 1,
    multiplier: 1,
    timeLeft: 60,
    isPlaying: false,
    gameOver: false,
    highScore: 15600,
  })

  const [clickAnimation, setClickAnimation] = useState(false)
  const [powerUpAvailable, setPowerUpAvailable] = useState(false)

  // Game timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }))
      }, 1000)
    } else if (gameState.timeLeft === 0 && gameState.isPlaying) {
      endGame()
    }
    return () => clearInterval(interval)
  }, [gameState.isPlaying, gameState.timeLeft])

  // Power-up availability
  useEffect(() => {
    if (gameState.score > 0 && gameState.score % 500 === 0) {
      setPowerUpAvailable(true)
    }
  }, [gameState.score])

  const startGame = () => {
    setGameState((prev) => ({
      ...prev,
      score: 0,
      tokensEarned: 0,
      clickPower: 1,
      multiplier: 1,
      timeLeft: 60,
      isPlaying: true,
      gameOver: false,
    }))
    setPowerUpAvailable(false)
  }

  const endGame = () => {
    const finalTokens = Math.floor(gameState.score / 10)
    const newHighScore = Math.max(gameState.score, gameState.highScore)

    setGameState((prev) => ({
      ...prev,
      tokensEarned: finalTokens,
      isPlaying: false,
      gameOver: true,
      highScore: newHighScore,
    }))
  }

  const handlePump = useCallback(() => {
    if (!gameState.isPlaying) return

    setClickAnimation(true)
    setTimeout(() => setClickAnimation(false), 150)

    setGameState((prev) => ({
      ...prev,
      score: prev.score + prev.clickPower * prev.multiplier,
    }))
  }, [gameState.isPlaying, gameState.clickPower, gameState.multiplier])

  const usePowerUp = () => {
    if (!powerUpAvailable) return

    setGameState((prev) => ({
      ...prev,
      multiplier: prev.multiplier * 2,
      timeLeft: prev.timeLeft + 10,
    }))
    setPowerUpAvailable(false)

    // Reset multiplier after 10 seconds
    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        multiplier: 1,
      }))
    }, 10000)
  }

  const buyUpgrade = () => {
    if (gameState.score >= 100) {
      setGameState((prev) => ({
        ...prev,
        score: prev.score - 100,
        clickPower: prev.clickPower + 1,
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChonkLogo size={50} />
              <div>
                <h1 className="text-2xl font-bold text-primary">Pump Clicker</h1>
                <p className="text-sm text-muted-foreground">Click to pump and earn CHONK!</p>
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
          <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-primary neon-text">Ready to Pump?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg text-muted-foreground">
                Click the pump button as fast as you can to earn points and CHONK tokens!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="font-bold text-primary">Game Rules</div>
                  <div className="text-muted-foreground mt-2">
                    • 60 seconds to pump
                    <br />• Each click earns points
                    <br />• 10 points = 1 CHONK token
                  </div>
                </div>
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="font-bold text-secondary">Power-ups</div>
                  <div className="text-muted-foreground mt-2">
                    • 2x multiplier every 500 points
                    <br />• +10 seconds bonus time
                    <br />• Upgrade click power
                  </div>
                </div>
                <div className="p-4 bg-accent/10 rounded-lg">
                  <div className="font-bold text-accent">High Score</div>
                  <div className="text-muted-foreground mt-2">
                    Current: {gameState.highScore.toLocaleString()}
                    <br />
                    Beat your record!
                  </div>
                </div>
              </div>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-12 py-6 text-xl"
              >
                Start Pumping!
              </Button>
            </CardContent>
          </Card>
        )}

        {gameState.isPlaying && (
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-primary">{gameState.score.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-secondary">{gameState.timeLeft}s</div>
                  <div className="text-sm text-muted-foreground">Time Left</div>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-accent">{gameState.clickPower}</div>
                  <div className="text-sm text-muted-foreground">Click Power</div>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold text-destructive">{gameState.multiplier}x</div>
                  <div className="text-sm text-muted-foreground">Multiplier</div>
                </CardContent>
              </Card>
            </div>

            {/* Time Progress */}
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-4">
                <Progress value={(gameState.timeLeft / 60) * 100} className="h-3" />
              </CardContent>
            </Card>

            {/* Main Pump Button */}
            <div className="text-center">
              <button
                onClick={handlePump}
                className={`
                  relative w-64 h-64 rounded-full bg-gradient-to-br from-primary to-primary/60 
                  hover:from-primary/80 hover:to-primary/40 transition-all duration-150
                  border-4 border-primary/50 shadow-2xl
                  ${clickAnimation ? "scale-95 shadow-primary/50" : "scale-100"}
                  neon-text text-6xl font-bold text-primary-foreground
                  active:scale-90
                `}
              >
                🚀
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              </button>
              <p className="text-lg text-muted-foreground mt-4">Click to Pump!</p>
            </div>

            {/* Power-ups and Upgrades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-secondary">Power-up Available!</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={usePowerUp}
                    disabled={!powerUpAvailable}
                    className="w-full bg-secondary hover:bg-secondary/80"
                  >
                    {powerUpAvailable ? "2x Multiplier + 10s" : "Earn 500 points to unlock"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-accent">Upgrade Click Power</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={buyUpgrade}
                    disabled={gameState.score < 100}
                    className="w-full bg-accent hover:bg-accent/80"
                  >
                    {gameState.score >= 100 ? "Buy for 100 points" : "Need 100 points"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {gameState.gameOver && (
          <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
            <CardHeader>
              <CardTitle className="text-3xl text-primary neon-text">Game Over!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary">{gameState.score.toLocaleString()}</div>
                  <div className="text-muted-foreground">Final Score</div>
                </div>
                <div className="p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary">{gameState.tokensEarned}</div>
                  <div className="text-muted-foreground">CHONK Earned</div>
                </div>
                <div className="p-6 bg-accent/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent">{gameState.highScore.toLocaleString()}</div>
                  <div className="text-muted-foreground">High Score</div>
                </div>
              </div>

              {gameState.score === gameState.highScore && gameState.score > 0 && (
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <div className="text-destructive font-bold">🎉 NEW HIGH SCORE! 🎉</div>
                  <div className="text-sm text-muted-foreground mt-1">Bonus: +100 CHONK tokens!</div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={startGame}
                  size="lg"
                  className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 py-4"
                >
                  Play Again
                </Button>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary/10 font-bold px-8 py-4 bg-transparent"
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
