'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Leaf,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sprout,
  TreePine,
  Wind,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Decorative floating elements                                              */
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
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Password Strength                                                         */
/* -------------------------------------------------------------------------- */

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains number', met: /[0-9]/.test(password) },
    { label: 'Contains special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const metCount = checks.filter((c) => c.met).length;
  const strength = metCount === 0 ? 0 : metCount <= 2 ? 1 : metCount === 3 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500'];

  if (password.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                strength >= level ? strengthColors[strength] : 'bg-white/10'
              )}
            />
          ))}
        </div>
        <span className={cn(
          'text-xs font-medium',
          strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : strength === 3 ? 'text-emerald-400' : 'text-gray-500'
        )}>
          {strengthLabels[strength]}
        </span>
      </div>

      {/* Checks */}
      <div className="grid grid-cols-2 gap-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <div className={cn(
              'flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors',
              check.met ? 'bg-emerald-500' : 'bg-white/10'
            )}>
              {check.met && <Check className="h-2 w-2 text-white" />}
            </div>
            <span className={cn(
              'text-[10px]',
              check.met ? 'text-emerald-400' : 'text-gray-500'
            )}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* ---- Left panel: Branding ---- */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-forest-900 via-emerald-900 to-forest-950 lg:flex">
        <FloatingElements />

        <div className="relative z-10 max-w-md px-12 text-center">
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
            Join the green revolution
          </motion.p>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 space-y-4 text-left"
          >
            {[
              'Smart plant health monitoring & alerts',
              'ESG impact tracking & reporting',
              'Professional maintenance scheduling',
              'Real-time analytics dashboard',
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-sm text-emerald-200/70">{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ---- Right panel: Register form ---- */}
      <div className="flex w-full items-center justify-center px-6 py-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 shadow-lg shadow-emerald-500/30">
              <Leaf className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">VRIKSHAM</h1>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="mt-1.5 text-sm text-gray-400">
                Start your green infrastructure journey today
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

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

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-12 text-sm text-white placeholder:text-gray-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className={cn(
                      'w-full rounded-xl border bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2',
                      confirmPassword.length > 0 && confirmPassword !== password
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                        : 'border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                    )}
                  />
                </div>
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={cn(
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                    agreedToTerms
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-white/20 bg-transparent'
                  )}
                >
                  {agreedToTerms && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="text-xs text-gray-400">
                  I agree to the{' '}
                  <Link href="/terms" className="text-emerald-400 hover:text-emerald-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300">
                    Privacy Policy
                  </Link>
                </span>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40"
              >
                Create Account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-gray-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* OAuth */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <GoogleIcon />
              Sign up with Google
            </motion.button>

            {/* Login link */}
            <p className="mt-5 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
