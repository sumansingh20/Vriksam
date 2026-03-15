'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
  };

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
            It happens to
            <br />
            the best of us.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-500">
            No worries — we will send you a secure link to reset your password
            and get you back to managing your green infrastructure in no time.
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400">
          Need help?{' '}
          <span className="text-gray-500">support@vriksham.org</span>
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Right panel — Reset form                                          */}
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
            {isSubmitted ? (
              /* ------ Success state ------ */
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Check your inbox
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  We sent a password reset link to
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {email}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-400">
                  Click the link in the email to reset your password. If you
                  don&apos;t see it, check your spam folder.
                </p>

                <div className="mt-8 space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Try a different email
                  </button>
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              </div>
            ) : (
              /* ------ Form state ------ */
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Reset your password
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    Enter the email address associated with your account and
                    we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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

                  {/* Submit */}
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Send reset link
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
