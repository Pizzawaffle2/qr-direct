// File: src/components/ui/loading-spinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="relative">
        <div className="h-24 w-24 animate-spin rounded-full border-b-4 border-t-4 border-primary"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-primary">
          Loading...
        </div>
      </div>
    </div>
  );
}
