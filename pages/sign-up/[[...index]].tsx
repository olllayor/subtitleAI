import { SignUp } from '@clerk/nextjs'
import Head from 'next/head'
import Link from 'next/link'
import { Film } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Sign Up - SubtitleAI</title>
      </Head>
      
      <main className="flex-grow flex items-center justify-center px-4">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-black hover:bg-black/80 text-white',
              footerActionLink: 'text-black hover:text-black/80'
            }
          }}
          fallbackRedirectUrl="/demo"
        />
      </main>
    </div>
  )
}