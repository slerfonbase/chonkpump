"use client"

import Image from "next/image"

export function ChonkLogo({ size = 120 }: { size?: number }) {
  return (
    <div className="relative float-animation">
      <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AD88186B-C8A2-4B5C-99FA-E3BAD87B0A91-U1tOfXUZ6t973YtofbGkdZIfBVBuPK.png"
        alt="CHONKPUMP 9000 - Cyberpunk Space Cat"
        width={size}
        height={size}
        className="relative z-10 rounded-full border-2 border-primary/50"
        priority
      />
    </div>
  )
}
