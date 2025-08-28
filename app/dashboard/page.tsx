"use client"

import { useState } from "react"
import Link from "next/link"
import { ChonkLogo } from "@/components/chonk-logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UserStats {
  totalTokensEarned: number
  gamesPlayed: number
  currentStreak: number
  rank: number
  level: number
  xp: number
  xpToNextLevel: number
}

interface GameStats {
  id: string
  name: string
  icon: string
  tokensEarned: number
  highScore: number
  timesPlayed: number
  difficulty: "Easy" | "Medium" | "Hard"
  status: "available" | "locked" | "coming-soon"
}

export default function DashboardPage() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalTokensEarned: 15420,
    gamesPlayed: 127,
    currentStreak: 8,
    rank: 42,
    level: 12,
    xp: 2840,
    xpToNextLevel: 3500,
  })

  const [gameStats, setGameStats] = useState<GameStats[]>([
    {
      id: "pump-clicker",
      name: "Pump Clicker",
      icon: "🚀",
      tokensEarned: 8420,
      highScore: 15600,
      timesPlayed: 89,
      difficulty: "Easy",
      status: "available",
    },
    {
      id: "space-runner",
      name: "Space Runner",
      icon: "🏃‍♂️",
      tokensEarned: 4200,
      highScore: 8900,
      timesPlayed: 23,
      difficulty: "Medium",
      status: "available",
    },
    {
      id: "token-stacker",
      name: "Token Stacker",
      icon: "📚",
      tokensEarned: 2800,
      highScore: 4500,
      timesPlayed: 15,
      difficulty: "Hard",
      status: "available",
    },
    {
      id: "neon-maze",
      name: "Neon Maze",
      icon: "🌀",
      tokensEarned: 0,
      highScore: 0,
      timesPlayed: 0,
      difficulty: "Medium",
      status: "coming-soon",
    },
    {
      id: "crypto-battle",
      name: "Crypto Battle",
      icon: "⚔️",
      tokensEarned: 0,
      highScore: 0,
      timesPlayed: 0,
      difficulty: "Hard",
      status: "locked",
    },
  ])

  const xpProgress = (userStats.xp / userStats.xpToNextLevel) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ChonkLogo size={60} />
              <div>
                <h1 className="text-2xl font-bold text-primary">Gaming Hub</h1>
                <p className="text-sm text-muted-foreground">Level {userStats.level} Chonker</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-primary text-primary">
                Rank #{userStats.rank}
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* User Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Tokens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{userStats.totalTokensEarned.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">CHONK earned</p>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Games Played</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{userStats.gamesPlayed}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total sessions</p>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{userStats.currentStreak}</div>
                  <p className="text-xs text-muted-foreground mt-1">Days active</p>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-primary">Global Rank</CardTitle>
                    <Badge variant="secondary">Level {userStats.level}</Badge>
                  </div>
                  <CardDescription>
                    {userStats.xp.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()} XP
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={xpProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {(userStats.xpToNextLevel - userStats.xp).toLocaleString()} XP to next level
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-primary">Level Progress</CardTitle>
                  <Badge variant="secondary">Level {userStats.level}</Badge>
                </div>
                <CardDescription>
                  {userStats.xp.toLocaleString()} / {userStats.xpToNextLevel.toLocaleString()} XP
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={xpProgress} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {(userStats.xpToNextLevel - userStats.xp).toLocaleString()} XP to next level
                </p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🚀</div>
                      <div>
                        <p className="font-medium">Pump Clicker</p>
                        <p className="text-sm text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">+420 CHONK</p>
                      <p className="text-sm text-muted-foreground">High Score!</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏃‍♂️</div>
                      <div>
                        <p className="font-medium">Space Runner</p>
                        <p className="text-sm text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary">+280 CHONK</p>
                      <p className="text-sm text-muted-foreground">Level completed</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📚</div>
                      <div>
                        <p className="font-medium">Token Stacker</p>
                        <p className="text-sm text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">+150 CHONK</p>
                      <p className="text-sm text-muted-foreground">Perfect stack</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="games" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gameStats.map((game) => (
                <Card key={game.id} className="game-card-hover bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{game.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{game.name}</CardTitle>
                          <Badge
                            variant={
                              game.difficulty === "Easy"
                                ? "secondary"
                                : game.difficulty === "Medium"
                                  ? "default"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {game.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Badge
                        variant={game.status === "available" ? "default" : "outline"}
                        className={game.status === "available" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {game.status === "available" ? "Play" : game.status === "locked" ? "Locked" : "Soon"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tokens Earned</p>
                        <p className="font-bold text-primary">{game.tokensEarned.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">High Score</p>
                        <p className="font-bold">{game.highScore.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Times Played</p>
                        <p className="font-bold">{game.timesPlayed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-bold capitalize">{game.status.replace("-", " ")}</p>
                      </div>
                    </div>
                    {game.status === "available" ? (
                      <Link href={`/games/${game.id}`} className="block">
                        <Button className="w-full">Play Now</Button>
                      </Link>
                    ) : (
                      <Button className="w-full bg-transparent" disabled variant="outline">
                        {game.status === "locked" ? "Unlock at Level 15" : "Coming Soon"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-8">
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Global Leaderboard</CardTitle>
                <CardDescription>Top CHONK earners this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { rank: 1, name: "CryptoChonker", tokens: 45200, badge: "👑" },
                    { rank: 2, name: "PumpMaster9000", tokens: 38900, badge: "🥈" },
                    { rank: 3, name: "NeonRunner", tokens: 32100, badge: "🥉" },
                    { rank: 4, name: "TokenStacker", tokens: 28400, badge: "" },
                    { rank: 5, name: "SpaceExplorer", tokens: 24800, badge: "" },
                  ].map((player) => (
                    <div
                      key={player.rank}
                      className="flex items-center justify-between py-3 border-b border-border/50 last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 text-center font-bold">{player.badge || `#${player.rank}`}</div>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-sm text-muted-foreground">Level {12 + player.rank}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{player.tokens.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">CHONK</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-primary">Daily Rewards</CardTitle>
                  <CardDescription>Claim your daily CHONK bonus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-6">
                    <div className="text-4xl mb-4">🎁</div>
                    <div className="text-2xl font-bold text-primary mb-2">500 CHONK</div>
                    <p className="text-sm text-muted-foreground mb-4">Daily login bonus</p>
                    <Button className="bg-primary hover:bg-primary/80">Claim Reward</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-secondary">Achievement Rewards</CardTitle>
                  <CardDescription>Unlock special bonuses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">🏆</div>
                      <div>
                        <p className="font-medium text-sm">First Win</p>
                        <p className="text-xs text-muted-foreground">Complete any game</p>
                      </div>
                    </div>
                    <Badge variant="secondary">Claimed</Badge>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">🔥</div>
                      <div>
                        <p className="font-medium text-sm">Hot Streak</p>
                        <p className="text-xs text-muted-foreground">7 day login streak</p>
                      </div>
                    </div>
                    <Badge variant="default">1000 CHONK</Badge>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">💎</div>
                      <div>
                        <p className="font-medium text-sm">Diamond Hands</p>
                        <p className="text-xs text-muted-foreground">Hold 10K+ CHONK</p>
                      </div>
                    </div>
                    <Badge variant="default">2500 CHONK</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
