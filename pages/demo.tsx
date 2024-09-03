import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import VideoSubtitleTool from '../components/VideoSubtitleTool';

export default function Demo() {
  const { isLoaded, userId, sessionId } = useAuth();
  const router = useRouter();

  // If the auth isn't loaded yet, don't render anything
  if (!isLoaded) {
    return null;
  }

  // If the user isn't signed in, redirect them to the sign-in page
  if (!userId) {
    router.push('/sign-in');
    return null;
  }

  return (
    <>
      <Head>
        <title>Try Video Subtitle Tool - SubtitleAI</title>
      </Head>
      <div className='flex flex-col items-center justify-center px-4 mt-10'>
        <h1 className='text-4xl font-bold mb-8'>Try Our Video Subtitle Tool</h1>
        <div className='w-full max-w-4xl mx-auto'>
          <VideoSubtitleTool />
        </div>
      </div>
    </>
  );
}