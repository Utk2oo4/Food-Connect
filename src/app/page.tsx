'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="flex items-center space-x-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Redirecting to login...</p>
      </div>
    </main>
  );
}
