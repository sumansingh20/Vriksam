'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Input class helper                                                         */
/* -------------------------------------------------------------------------- */

const inputClasses =
  'w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100';

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-40px' });
  const formInView = useInView(formRef, { once: true, margin: '-40px' });
  const infoInView = useInView(infoRef, { once: true, margin: '-40px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-40px' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* ================================================================== */}
      {/*  Hero                                                              */}
      {/* ================================================================== */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Get in touch
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-500">
              Have a question or want to learn more about our green
              infrastructure platform? We would love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Main Grid — Form + Contact Info                                   */}
      {/* ================================================================== */}
      <section className="bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* -------------------------------------------------------------- */}
            {/*  Left Column — Contact Form                                    */}
            {/* -------------------------------------------------------------- */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, y: 24 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-8 py-16 text-center"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Message sent!
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setEmail('');
                      setCompany('');
                      setSubject('General Inquiry');
                      setMessage('');
                    }}
                    className="mt-8 text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit} className="space-y-5">
                  {/* Full name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-medium text-gray-900"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className={inputClasses}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-gray-900"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className={inputClasses}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      htmlFor="company"
                      className="mb-1.5 block text-sm font-medium text-gray-900"
                    >
                      Company{' '}
                      <span className="font-normal text-gray-400">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Inc."
                      className={inputClasses}
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-1.5 block text-sm font-medium text-gray-900"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={cn(inputClasses, 'appearance-none')}
                    >
                      <option>General Inquiry</option>
                      <option>Schedule a Consultation</option>
                      <option>Partnership</option>
                      <option>Support</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-medium text-gray-900"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your project or question..."
                      className={cn(inputClasses, 'resize-none')}
                    />
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
                  >
                    Send message
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* -------------------------------------------------------------- */}
            {/*  Right Column — Contact Info + Office Card                     */}
            {/* -------------------------------------------------------------- */}
            <motion.div
              ref={infoRef}
              initial={{ opacity: 0, y: 24 }}
              animate={infoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-10"
            >
              {/* Contact items */}
              <div className="space-y-8">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href="mailto:hello@vriksham.com"
                      className="mt-0.5 block text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      hello@vriksham.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a
                      href="tel:+914012345678"
                      className="mt-0.5 block text-sm text-gray-500 transition-colors hover:text-gray-900"
                    >
                      +91 40 1234 5678
                    </a>
                  </div>
                </div>

                {/* Office */}
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Office</p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Hyderabad, India
                    </p>
                  </div>
                </div>
              </div>

              {/* Office card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Office hours
                    </p>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Mon&ndash;Fri, 9 AM &ndash; 6 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ link */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-500">
                  Looking for technical support?
                </p>
                <a
                  href="/support"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Visit our help center
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Bottom CTA                                                        */}
      {/* ================================================================== */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl text-center"
          >
            <p className="text-lg font-medium text-gray-900">
              Prefer to schedule a call?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Book a 30-minute consultation with our team and see the platform in
              action.
            </p>
            <a
              href="#contact-form"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              Book a consultation
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
