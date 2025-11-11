"use client";
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDatabaseError = this.state.error?.message?.includes('relation') || 
                             this.state.error?.message?.includes('does not exist') ||
                             this.state.error?.message?.includes('PostgresError');

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" gutterBottom color="error">
            Something went wrong
          </Typography>
          
          {isDatabaseError && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Database Error: {this.state.error?.message}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                This usually means the database migrations haven't been run yet.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please run: <code>npm run db:push</code>
              </Typography>
            </Box>
          )}
          
          {!isDatabaseError && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            sx={{ mt: 3 }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
