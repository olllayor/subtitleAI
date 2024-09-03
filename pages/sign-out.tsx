import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Film } from "lucide-react";
import { Button } from "../components/ui/button";

export default function SignOutPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Sign Out - SubtitleAI</title>
      </Head>
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Are you sure you want to sign out?</h1>
          <SignOutButton signOutCallback={() => router.push("/")}>
            <Button className="bg-black text-white font-medium px-4 py-2 hover:bg-black/80">
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </main>
    </div>
  );
}