import Image from "next/image";
import React from "react";

export default function WelcomeIcon() {
  return (
    <div
      className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 min-h-screen"
      role="region"
      aria-label="Welcome panel"
    >
      {/* Decorative soft grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59,130,246,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "56px 56px",
        }}
      />

      {/* Minimal floating nodes */}
      <div
        aria-hidden="true"
        className="absolute top-28 left-16 w-24 h-24 bg-cyan-400/10 rounded-full blur-3xl motion-safe:animate-pulse motion-reduce:opacity-80"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-36 right-20 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl motion-safe:animate-bounce motion-reduce:opacity-80"
      />

      {/* Center content */}
      <div className="z-10 w-full flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="relative w-full max-w-xs">
          {/* Subtle halo behind logo */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-lg bg-gradient-to-tr from-blue-500/20 to-cyan-400/10 blur-[50px] scale-105 motion-safe:animate-pulse motion-reduce:opacity-90"
          />

          {/* Logo with subtle corner radius */}
          <div className="relative w-full aspect-square">
            <Image
              src="/logo.gif"
              alt="Company logo"
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 320px, 200px"
              priority
              className="relative object-contain opacity-95 pointer-events-none drop-shadow-[0_12px_40px_rgba(59,130,246,0.25)] rounded-[50px]"
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-center text-white/80 text-xl font-medium tracking-wide max-w-md leading-relaxed">
          Track your assets. Manage your workflow. Optimize results.
        </p>
      </div>
    </div>
  );
}
