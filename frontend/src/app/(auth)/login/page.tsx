'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      {/* ------------------------------------------------------------------ */}
      {/*  Left panel — Branding                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gray-50 p-12 lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            VRIKSHAM
          </span>
        </div>

        {/* Hero content */}
        <div className="max-w-lg">
          <h1 className="text-[40px] font-semibold leading-[1.1] tracking-tight text-gray-900">
            Green infrastructure,
            <br />
            managed intelligently.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-500">
            Monitor plant health, automate maintenance workflows, and generate
            ESG-ready sustainability reports — all from a single platform.
          </p>
        </div>

        {/* Testimonial */}
        <div className="max-w-md">
          <div className="border-l-2 border-gray-200 pl-5">
            <p className="text-sm leading-relaxed text-gray-500">
              &ldquo;Vriksham transformed how we manage our office greenery.
              The ESG tracking alone saved us 40+ hours per quarter on
              sustainability reports.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600">
                RM
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Rahul Mehta</p>
                <p className="text-xs text-gray-400">CTO, TechCorp Ltd</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Right panel — Login form                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex w-full flex-col lg:w-1/2">
        {/* Mobile logo */}
        <div className="flex items-center gap-2.5 p-6 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">
            VRIKSHAM
          </span>
        </div>

        {/* Desktop top-right logo */}
        <div className="hidden justify-end p-8 lg:flex">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <Leaf className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-6 pb-12 sm:px-12">
          <div className="w-full max-w-[400px]">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-[18px] w-[18px]" />
                    ) : (
                      <Eye className="h-[18px] w-[18px]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                      rememberMe
                        ? 'border-gray-900 bg-gray-900'
                        : 'border-gray-300 bg-white'
                    )}
                  >
                    {rememberMe && (
                      <svg
                        className="h-3 w-3 text-white"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">Or continue with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* OAuth */}
            <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <GoogleIcon />
              Sign in with Google
            </button>

            {/* Demo hint */}
            <div className="mt-8 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-center text-xs text-gray-400">
                Demo: <span className="font-medium text-gray-500">user@vriksham.org</span>{' '}
                / <span className="font-medium text-gray-500">User@123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
