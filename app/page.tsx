import { ChonkLogo } from "@/components/chonk-logo"
import { WalletConnection } from "@/components/wallet-connection"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <ChonkLogo size={150} />
          </div>
          <h1 className="text-6xl font-bold mb-6 neon-text text-primary">CHONKONPUMP</h1>
          <p className="text-2xl mb-4 text-secondary font-bold">CHONK HARD, PUMP HARDER!</p>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate cyberpunk gaming platform where you earn CHONKPUMP 9000 tokens by playing engaging mini-games.
            Join the revolution and pump your way to the moon!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 py-4 text-lg"
              >
                Start Gaming
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10 font-bold px-8 py-4 text-lg bg-transparent"
            >
              View Tokenomics
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">$0.00937</div>
                <div className="text-sm text-muted-foreground">LIVE PRICE</div>
              </CardContent>
            </Card>
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-secondary mb-2">1.2M</div>
                <div className="text-sm text-muted-foreground">MARKET CAP</div>
              </CardContent>
            </Card>
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-accent mb-2">5,847</div>
                <div className="text-sm text-muted-foreground">ACTIVE PLAYERS</div>
              </CardContent>
            </Card>
            <Card className="cyberpunk-border bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-destructive mb-2">892K</div>
                <div className="text-sm text-muted-foreground">TOKENS EARNED</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Wallet Connection */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <WalletConnection />
        </div>
      </section>

      {/* Games Preview */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 neon-text text-primary">EARN CHONK TOKENS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="game-card-hover bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-primary">Pump Clicker</CardTitle>
                <CardDescription>Click to pump and earn tokens!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🚀</div>
                  <Link href="/dashboard">
                    <Button className="bg-primary hover:bg-primary/80">Play Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card-hover bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-secondary">Space Runner</CardTitle>
                <CardDescription>Navigate through the cyberpunk city!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏃‍♂️</div>
                  <Button className="bg-secondary hover:bg-secondary/80 font-bold px-8 py-4 text-lg bg-transparent">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="game-card-hover bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-accent">Token Stacker</CardTitle>
                <CardDescription>Stack tokens to maximize rewards!</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📚</div>
                  <Button className="bg-accent hover:bg-accent/80 font-bold px-8 py-4 text-lg bg-transparent">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <ChonkLogo size={80} />
          </div>
          <p className="text-muted-foreground mb-4">CHONKONPUMP - The future of gaming meets DeFi</p>
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="sm">
              Twitter
            </Button>
            <Button variant="ghost" size="sm">
              Discord
            </Button>
            <Button variant="ghost" size="sm">
              Telegram
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
