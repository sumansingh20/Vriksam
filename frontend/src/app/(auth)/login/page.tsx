'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sprout,
  TreePine,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Decorative floating elements for left panel                               */
/* -------------------------------------------------------------------------- */

function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-[15%] top-[20%]"
      >
        <Sprout className="h-8 w-8 text-emerald-400/30" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute right-[20%] top-[35%]"
      >
        <TreePine className="h-10 w-10 text-green-400/20" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute left-[25%] bottom-[25%]"
      >
        <Wind className="h-7 w-7 text-emerald-300/25" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute right-[15%] bottom-[35%]"
      >
        <Leaf className="h-6 w-6 text-green-300/30" />
      </motion.div>

      {/* Gradient orbs */}
      <div className="absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="absolute -right-20 bottom-1/4 h-48 w-48 rounded-full bg-green-500/10 blur-[80px]" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Google icon SVG                                                           */
/* -------------------------------------------------------------------------- */

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* ---- Left panel: Branding ---- */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-forest-900 via-emerald-900 to-forest-950 lg:flex">
        <FloatingElements />

        <div className="relative z-10 max-w-md px-12 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-2xl shadow-emerald-500/30"
          >
            <Leaf className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-gradient-to-r from-emerald-200 via-green-200 to-teal-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent"
          >
            VRIKSHAM
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg text-emerald-200/70"
          >
            Green Infrastructure Management Platform
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 backdrop-blur-sm"
          >
            <p className="text-sm leading-relaxed text-emerald-200/60">
              &ldquo;Vriksham has transformed how we manage our office plants. The ESG
              tracking alone has been invaluable for our sustainability reports.&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                RM
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-emerald-200">Rahul Mehta</p>
                <p className="text-[11px] text-emerald-400/60">CTO, TechCorp Ltd</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ---- Right panel: Login form ---- */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">VRIKSHAM</h1>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-1.5 text-sm text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                    rememberMe
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-white/20 bg-transparent'
                  )}
                >
                  {rememberMe && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-sm text-gray-400">Remember me</span>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
              >
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500">or continue with</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* OAuth */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <GoogleIcon />
              Sign in with Google
            </motion.button>

            {/* Sign up link */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
