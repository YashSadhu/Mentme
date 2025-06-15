'use client';

import { useEffect, useState } from 'react';

export function SuppressHydrationWarning({
  children,
  suppress = true,
}: {
  children: React.ReactNode;
  suppress?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on the server, only on the client
  if (!isClient) {
    return null;
  }

  return (
    <div suppressHydrationWarning={suppress}>
      {children}
    </div>
  );
}

// This is a more aggressive version that wraps the entire component
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? <>{children}</> : null;
}
