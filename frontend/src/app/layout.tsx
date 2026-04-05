import type { Metadata, Viewport } from 'next';
import { Manrope, Sora } from 'next/font/google';
import Script from 'next/script';
import { Providers } from '@/providers';
import '@/styles/globals.css';

const inter = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jakarta = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Vriksham - The Future of Green Infrastructure',
  description:
    'Transform your spaces with intelligent plant management. Monitor, maintain, and maximize your green assets with AI-powered insights.',
  keywords: [
    'green infrastructure',
    'plant management',
    'AI',
    'sustainability',
    'ESG',
    'corporate greenery',
    'smart monitoring',
  ],
  openGraph: {
    title: 'Vriksham - The Future of Green Infrastructure',
    description:
      'Transform your spaces with intelligent plant management. Monitor, maintain, and maximize your green assets with AI-powered insights.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="app-shell-base min-h-screen font-sans antialiased">
        <Script
          id="performance-api-polyfill"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var perf = typeof window !== 'undefined' ? window.performance : undefined;
                var noop = function () { return undefined; };
                var methods = ['mark', 'measure', 'clearMarks', 'clearMeasures'];

                var isObjectLike = function (value) {
                  return value !== null && (typeof value === 'object' || typeof value === 'function');
                };

                var ensureObject = function (value) {
                  return isObjectLike(value) ? value : {};
                };

                var patchTarget = function (target) {
                  if (!isObjectLike(target)) return target;

                  methods.forEach(function (method) {
                    if (typeof target[method] === 'function') return;

                    try {
                      target[method] = noop;
                    } catch (_) {
                      // Ignore assignment failures and try defineProperty fallback.
                    }

                    if (typeof target[method] === 'function') return;

                    try {
                      Object.defineProperty(target, method, {
                        configurable: true,
                        writable: true,
                        value: noop,
                      });
                    } catch (_) {
                      // Ignore read-only or sealed targets.
                    }
                  });

                  return target;
                };

                patchTarget(perf);

                if (typeof Performance !== 'undefined' && Performance.prototype) {
                  patchTarget(Performance.prototype);
                }

                if (typeof window === 'undefined') return;

                var currentMgt = patchTarget(ensureObject(window.mgt));

                try {
                  Object.defineProperty(window, 'mgt', {
                    configurable: true,
                    get: function () {
                      return currentMgt;
                    },
                    set: function (nextValue) {
                      currentMgt = patchTarget(ensureObject(nextValue));
                    },
                  });
                } catch (_) {
                  // Fallback to direct assignment when defineProperty is blocked.
                  window.mgt = currentMgt;
                }

                var attempts = 0;
                var maxAttempts = 120;
                var monitorId = window.setInterval(function () {
                  attempts += 1;
                  var nextMgt = patchTarget(ensureObject(window.mgt));

                  if (window.mgt !== nextMgt) {
                    try {
                      window.mgt = nextMgt;
                    } catch (_) {
                      // Ignore assignment failures for locked globals.
                    }
                  }

                  if (attempts >= maxAttempts) {
                    window.clearInterval(monitorId);
                  }
                }, 250);
              })();
            `,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
