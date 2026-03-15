'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Leaf,
  Mail,
  ArrowLeft,
  ArrowRight,
  Sprout,
  TreePine,
  Wind,
  CheckCircle,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Decorative floating elements for left panel                               */
/* -------------------------------------------------------------------------- */

function FloatingElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitted(true);
  };

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
              Don&apos;t worry, it happens to the best of us. We will help you get
              back into your account in no time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ---- Right panel: Reset form ---- */}
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
            {isSubmitted ? (
              /* ---- Success State ---- */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Check your email</h2>
                <p className="mt-3 text-sm text-gray-400">
                  We have sent a password reset link to
                </p>
                <p className="mt-1 text-sm font-medium text-emerald-400">{email}</p>
                <p className="mt-4 text-sm text-gray-500">
                  Click the link in the email to reset your password. If you do not see the
                  email, check your spam folder.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign in
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ---- Reset Form ---- */
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white">Forgot password?</h2>
                  <p className="mt-1.5 text-sm text-gray-400">
                    No worries. Enter your email and we will send you a reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="you@company.com"
                        className={`w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 ${
                          error
                            ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                            : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                        }`}
                      />
                    </div>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-400"
                      >
                        {error}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
                  >
                    Reset Password
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </motion.button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-emerald-400"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign in
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
