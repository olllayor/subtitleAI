import { SignIn } from "@clerk/nextjs";
import Head from "next/head";

const SignInPage = () => (
  <>
    <Head>
      <title>Sign In - SubtitleAI</title>
    </Head>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignIn 
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/demo"
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-black hover:bg-black/80 text-sm normal-case",
          },
        }}
      />
    </div>
  </>
);

export default SignInPage;