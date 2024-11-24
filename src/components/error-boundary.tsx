// components/error-boundary.tsx
'use client';

import {Component, ErrorInfo, ReactNode } from 'react';
import {Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong</h2>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="text-white"
            >
              Reload page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
