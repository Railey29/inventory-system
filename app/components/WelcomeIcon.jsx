import Image from "next/image";

export default function WelcomeIcon() {
  return (
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Main Content */}
      <div className="text-center z-10 w-full flex flex-col items-center justify-center px-16 py-12">
        {/* Logo */}
        <div
          className="mb-8 w-full max-w-md relative rounded-2xl overflow-hidden
                        drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]
                        hover:scale-105 transition-transform duration-300 ease-in-out
                        border-2 border-blue-500/20"
        >
          <Image
            src="/logo2.gif"
            alt="Company Logo"
            width={400}
            height={400}
            className="object-contain w-full h-auto rounded-2xl"
            style={{
              mixBlendMode: "screen", // optional
              filter: "brightness(1.1) contrast(1.2) saturate(1.1)",
            }}
            priority
          />

          {/* Subtle Blue Glow Overlay */}
          <div className="absolute inset-0 rounded-2xl bg-blue-500/10 pointer-events-none"></div>

          {/* Inner Glow / Soft Shadow */}
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_25px_rgba(59,130,246,0.3)] pointer-events-none"></div>
        </div>

        <div className="w-24 h-1 bg-white/30 rounded-full mb-8"></div>

        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white tracking-tight leading-tight">
            Welcome
          </h1>
          <p className="text-white/80 text-xl font-light tracking-wide max-w-md mx-auto">
            Start your journey with us
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-16 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-24 w-32 h-32 bg-white/3 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/3 left-20 w-28 h-28 bg-white/3 rounded-full blur-2xl"></div>
    </div>
  );
}
