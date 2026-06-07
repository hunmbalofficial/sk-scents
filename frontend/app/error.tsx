'use client';

export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-3xl text-white mb-4">Something went wrong</h1>
        <p className="text-luxury-gray mb-6">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="btn-primary px-8 py-3 rounded-lg text-sm tracking-wider uppercase">
          Try Again
        </button>
      </div>
    </div>
  );
}
