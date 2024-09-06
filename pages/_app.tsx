import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import { Film } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import { Button } from "../components/ui/button";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-w-6xl mx-auto flex-col min-h-screen">
      <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Film className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold text-primary">SubtitleAI</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
            </SignedOut>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
  );
}