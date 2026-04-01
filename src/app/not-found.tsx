"use client";

import Link from "next/link";
import { MoveLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#080c12] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center px-6">
        {/* Animated Icon */}
        <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] mb-8 animate-bounce-slow">
          <HelpCircle size={48} className="text-teal-400 opacity-80" />
        </div>

        {/* 404 text */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none tracking-tighter mb-4 animate-in fade-in zoom-in duration-1000">
          404
        </h1>

        <div className="space-y-4 max-w-md mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Oops! Page vanished.
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            The link you followed might be broken, or the page may have been moved.
            Don&apos;t worry, even the best systems lose their way sometimes.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-teal-600 font-semibold text-white transition-all duration-300 hover:bg-teal-500 hover:shadow-2xl hover:shadow-teal-500/40 active:scale-95"
          >
            <MoveLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <Link
            href="/login"
            className="px-8 py-3 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 font-medium transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
          >
            Re-authenticate
          </Link>
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
          50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style> */}
    </div>
  );
}
