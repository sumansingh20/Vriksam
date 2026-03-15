'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building2,
  ChevronDown,
  Clock,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type InquiryType = 'general' | 'sales' | 'support' | 'partnership' | 'careers';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: InquiryType;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/* -------------------------------------------------------------------------- */
/*  FAQ Data                                                                   */
/* -------------------------------------------------------------------------- */

const faqs = [
  {
    question: 'What areas does VRIKSHAM currently serve?',
    answer: 'VRIKSHAM operates across 50+ cities in India, with primary operations in Bangalore, Hyderabad, Mumbai, Chennai, Delhi NCR, and Pune. We are continuously expanding to new locations.',
  },
  {
    question: 'How quickly can you set up a green infrastructure project?',
    answer: 'For standard office setups, we can complete the initial assessment within 48 hours and full installation within 1-2 weeks. Larger projects with custom requirements may take 3-4 weeks depending on scope.',
  },
  {
    question: 'Do you offer trial periods for your services?',
    answer: 'Yes! All our plans include a 14-day free trial. You can experience our complete platform including AI health monitoring, technician visits, and ESG reporting before committing.',
  },
  {
    question: 'What happens if a plant dies under your care?',
    answer: 'We stand behind our service with a plant health guarantee. If any plant in our care does not survive due to maintenance issues, we replace it at no additional cost within the guarantee period.',
  },
  {
    question: 'Can I integrate VRIKSHAM data with our existing ESG reporting tools?',
    answer: 'Absolutely. Our Enterprise plan includes full API access and pre-built integrations with popular ESG platforms. We can also provide custom data exports in formats compatible with major reporting frameworks.',
  },
];

/* -------------------------------------------------------------------------- */
/*  FAQ Item                                                                   */
/* -------------------------------------------------------------------------- */

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <span className="pr-4 text-sm font-semibold text-gray-900">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 px-5 pb-5 pt-4">
              <p className="text-sm leading-relaxed text-gray-600">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: 'general',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* ================================================================== */}
      {/*  Hero                                                               */}
      {/* ================================================================== */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              Contact Us
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Get in{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                touch
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Have questions about our green infrastructure solutions? We are here to help.
              Reach out and our team will respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  Contact Form + Info - Split Layout                                 */}
      {/* ================================================================== */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* --- Left: Form --- */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-xl shadow-black/[0.03] sm:p-10">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <Send className="h-7 w-7 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Message sent successfully!
                    </h3>
                    <p className="mt-3 text-gray-500">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', company: '', inquiryType: 'general', message: '' });
                      }}
                      className="mt-6 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                      <p className="mt-2 text-sm text-gray-500">
                        Fill out the form below and we will get back to you promptly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Name */}
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Your full name"
                            className={cn(
                              'w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2',
                              errors.name
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20',
                            )}
                          />
                          {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateField('email', e.target.value)}
                            placeholder="you@company.com"
                            className={cn(
                              'w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2',
                              errors.email
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20',
                            )}
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        {/* Phone */}
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>

                        {/* Company */}
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Company
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) => updateField('company', e.target.value)}
                            placeholder="Your company name"
                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>

                      {/* Inquiry Type */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Inquiry Type
                        </label>
                        <select
                          value={formData.inquiryType}
                          onChange={(e) => updateField('inquiryType', e.target.value)}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="sales">Sales / Pricing</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="careers">Careers</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) => updateField('message', e.target.value)}
                          placeholder="Tell us about your green infrastructure needs..."
                          rows={5}
                          className={cn(
                            'w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2',
                            errors.message
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                              : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20',
                          )}
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-shadow hover:shadow-emerald-500/40 disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>

            {/* --- Right: Contact Info --- */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 lg:col-span-2"
            >
              {/* Email */}
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-black/[0.03]">
                <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-3">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                <p className="mt-1 text-sm text-gray-500">We reply within 24 hours</p>
                <a
                  href="mailto:hello@vriksham.com"
                  className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  hello@vriksham.com
                </a>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-black/[0.03]">
                <div className="mb-3 inline-flex rounded-xl bg-sky-500/10 p-3">
                  <Phone className="h-5 w-5 text-sky-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                <p className="mt-1 text-sm text-gray-500">Mon-Fri from 9am to 6pm IST</p>
                <a
                  href="tel:+919876543210"
                  className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
                >
                  +91-9876543210
                </a>
              </div>

              {/* Office Address */}
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-black/[0.03]">
                <div className="mb-3 inline-flex rounded-xl bg-violet-500/10 p-3">
                  <Building2 className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Office</h3>
                <p className="mt-1 text-sm text-gray-500">Visit us at our headquarters</p>
                <p className="mt-2 text-sm font-medium text-gray-700">
                  VRIKSHAM HQ, 42 HSR Layout,<br />
                  Sector 7, Bangalore 560102
                </p>
              </div>

              {/* Hours */}
              <div className="rounded-2xl border border-gray-200/60 bg-white p-6 shadow-lg shadow-black/[0.03]">
                <div className="mb-3 inline-flex rounded-xl bg-amber-500/10 p-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Business Hours</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100 p-8">
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <MapPin className="mb-3 h-10 w-10 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-800">Bangalore, India</p>
                  <p className="mt-1 text-xs text-emerald-600/70">HSR Layout, Sector 7</p>
                </div>
                {/* Decorative grid lines */}
                <div className="pointer-events-none absolute inset-0 opacity-30" style={{
                  backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/*  FAQ Section                                                        */}
      {/* ================================================================== */}
      <section className="bg-gradient-to-b from-white via-emerald-50/30 to-white py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <div className="mx-auto mb-4 inline-flex rounded-xl bg-emerald-500/10 p-3">
              <MessageSquare className="h-5 w-5 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600">
              Quick answers to common questions about our services.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
