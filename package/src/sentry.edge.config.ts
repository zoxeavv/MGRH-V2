import * as Sentry from '@sentry/nextjs';

const sentryOptions: Sentry.VercelEdgeOptions = {
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === 'production',
};

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  sentryOptions.dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
}

Sentry.init(sentryOptions);
