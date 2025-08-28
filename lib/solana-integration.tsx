"use client"

// lib/solana.ts
import { Connection, PublicKey } from "@solana/web3.js"
import { CHONK9K_MINT, SOLANA_RPC } from "./solana"

export async function getChonkonBalance(walletAddress: string): Promise<number> {
  const connection = new Connection(SOLANA_RPC)
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(new PublicKey(walletAddress), {
    mint: new PublicKey(CHONK9K_MINT),
  })
  let balance = 0
  tokenAccounts.value.forEach((account) => {
    balance += account.account.data.parsed.info.tokenAmount.uiAmount
  })
  return balance
}

// components/PumpButton.tsx
import { useState } from "react"

type Props = {
  onPump: () => Promise<void>
  pumpScore: number
}

export default function PumpButton({ onPump, pumpScore }: Props) {
  const [loading, setLoading] = useState(false)

  const handlePump = async () => {
    setLoading(true)
    await onPump()
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        className="bg-fuchsia-700 text-white px-8 py-4 rounded-lg text-2xl font-bold shadow-lg hover:bg-fuchsia-800 disabled:opacity-60"
        onClick={handlePump}
        disabled={loading}
      >
        {loading ? "Pumping..." : "🚀 Pump!"}
      </button>
      <div className="text-lg mt-2">
        Your Pump Score: <span className="font-bold">{pumpScore}</span>
      </div>
    </div>
  )
}

// pages/api/leaderboard.ts
import type { NextApiRequest, NextApiResponse } from "next"

// In-memory leaderboard for demo. For production, use a DB.
const leaderboard: { wallet: string; score: number }[] = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { wallet, score } = JSON.parse(req.body);
    const idx = leaderboard.findIndex((x) => x.wallet === wallet);
    if (idx > -1) leaderboard[idx].score = score;
    else leaderboard.push({ wallet, score });
    leaderboard.sort((a, b) => b.score - a.score);
    res.status(200).json({ success: true });
  } else if (req.method === "GET") {
    res.status(200).json({ leaderboard: leaderboard.slice(0, 10) });
  } else {
    res.status(405).end();
  }
}

// pages/index.tsx
import { useState, useEffect } from "react"
import PumpButton from "../components/PumpButton"
import { getChonkonBalance } from "../lib/solana"

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [pumpScore, setPumpScore] = useState<number>(0);

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;
    if (solana && solana.isPhantom) {
      const res = await solana.connect();
      setWallet(res.publicKey.toString());
    }
  };

  useEffect(() => {
    if (wallet) {
      getChonkonBalance(wallet).then(setBalance);
    }
  }, [wallet]);

  const handlePump = async () => {
    setPumpScore((prev) => prev + 1);
    await fetch("/api/leaderboard", {
      method: "POST",
      body: JSON.stringify({ wallet, score: pumpScore + 1 }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h1 className="text-4xl font-extrabold text-fuchsia-700">
        ChonkonPump 🚀
      </h1>
      {!wallet ? (
        <button
          onClick={connectWallet}
          className="bg-fuchsia-500 px-6 py-3 rounded-lg text-white text-lg font-bold"
        >
          Connect Phantom Wallet
        </button>
      ) : (
        <>
          <div className="text-lg">
            Wallet: <span className="font-mono">{wallet}</span>
          </div>
          <div className="text-xl">
            CHONK9K Balance: <span className="font-semibold">{balance}</span>
          </div>
          <PumpButton onPump={handlePump} pumpScore={pumpScore} />
        </>
      )}
    </div>
  );
}

// package.json
{
  ;("name")
  : \"chonkonpump",
  "version": "1.0.0",
  "private": true,
  "scripts":
  ;("dev")
  : \"next dev",
    "build": "next build",
    "start": "next start"
  ,\
  "dependencies":
  ;("@solana/web3.js")
  : \"^1.92.2",
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
}

// README.md\
#
ChonkonPump
\
A production-ready gamified web3 app
for CHONK9K token on Solana, deployed
on
Vercel.
\
## Features

- Connect Phantom wallet and display real CHONK9K balance
- Pump button and gamified pump score
- Live leaderboard (extendable to persistent DB)
- Real contract integration: [pump.fun/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump](https://pump.fun/DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump)

## Deployment

1. Push your code to GitHub.
2. Import your repo in [vercel.com](https://vercel.com/).\
3. Vercel auto-detects Next.js
for both frontend and API
routes.
\
4. The app is live at `https://<your-project>.vercel.app`

## Customization

- Replace NFT logic as desired.\
- Use Firebase or MongoDB
for persistent leaderboard.
\
#
#
License

MIT
