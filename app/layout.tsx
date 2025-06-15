import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './client-layout';
import HtmlWrapper from './html-wrapper';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HtmlWrapper>
      <ClientLayout>
        {children}
      </ClientLayout>
    </HtmlWrapper>
  );
}
