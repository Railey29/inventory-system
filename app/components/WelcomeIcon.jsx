import Image from "next/image";

export default function WelcomeIcon() {
  return (
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>

      {/* Main Content */}
      <div className="text-center z-10 w-full flex flex-col items-center justify-center px-16 py-12">
        {/* Logo */}
        <div className="mb-8 w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-300 ease-in-out animate__animated animate__fadeInDown animate__slow">
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={400}
            height={400}
            className="object-contain w-full h-auto"
            priority
          />
        </div>

        <div className="w-24 h-1 bg-white/30 rounded-full mb-8 animate__animated animate__fadeIn animate__delay-1s"></div>

        <div className="space-y-4 animate__animated animate__fadeInUp animate__delay-1s">
          <h1 className="text-6xl font-bold text-white tracking-tight leading-tight">
            Welcome
          </h1>
          <p className="text-white/80 text-xl font-light tracking-wide max-w-md mx-auto">
            Start your journey with us
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-16 w-40 h-40 bg-white/5 rounded-full blur-3xl animate__animated animate__pulse animate__infinite animate__slow"></div>
      <div className="absolute bottom-20 right-16 w-56 h-56 bg-white/5 rounded-full blur-3xl animate__animated animate__pulse animate__infinite animate__slower"></div>
      <div className="absolute top-1/3 right-24 w-32 h-32 bg-white/3 rounded-full blur-2xl animate__animated animate__fadeIn"></div>
      <div className="absolute bottom-1/3 left-20 w-28 h-28 bg-white/3 rounded-full blur-2xl animate__animated animate__fadeIn animate__delay-2s"></div>
    </div>
  );
}
