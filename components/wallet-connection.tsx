"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface WalletState {
  connected: boolean
  publicKey: string | null
  balance: number
  chonkBalance: number
}

export function WalletConnection() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: 0,
    chonkBalance: 0,
  })
  const [connecting, setConnecting] = useState(false)

  const connectWallet = async () => {
    setConnecting(true)
    try {
      // @ts-ignore - Phantom wallet
      const { solana } = window
      if (solana && solana.isPhantom) {
        const response = await solana.connect()
        setWallet({
          connected: true,
          publicKey: response.publicKey.toString(),
          balance: 0, // Will be fetched from Solana RPC
          chonkBalance: 0, // Will be fetched from token account
        })
      } else {
        alert("Please install Phantom Wallet!")
      }
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      publicKey: null,
      balance: 0,
      chonkBalance: 0,
    })
  }

  return (
    <Card className="cyberpunk-border p-6 bg-card/50 backdrop-blur-sm">
      {!wallet.connected ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold neon-text text-primary">Connect Wallet</h3>
          <p className="text-muted-foreground">Connect your Phantom wallet to start earning CHONKPUMP 9000 tokens!</p>
          <Button
            onClick={connectWallet}
            disabled={connecting}
            className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 py-3"
          >
            {connecting ? "Connecting..." : "Connect Phantom Wallet"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-primary">Wallet Connected</h3>
            <Button variant="outline" size="sm" onClick={disconnectWallet}>
              Disconnect
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-mono text-xs break-all">
              <span className="text-muted-foreground">Address:</span> {wallet.publicKey}
            </p>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SOL Balance:</span>
              <span className="font-bold">{wallet.balance.toFixed(4)} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">CHONKPUMP 9000:</span>
              <span className="font-bold text-primary">{wallet.chonkBalance.toLocaleString()} CHONK</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
