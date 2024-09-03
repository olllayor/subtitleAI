import React from 'react';
import Head from 'next/head';
import { Button } from '../components/ui/button';
import { CheckCircle } from 'lucide-react';

const PricingTier = ({ name, price, features, buttonText }: { name: string; price: string; features: string[]; buttonText: string }) => (
  <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
    <h3 className="mb-4 text-2xl font-semibold">{name}</h3>
    <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best option for {name.toLowerCase()} use</p>
    <div className="flex justify-center items-baseline my-8">
      <span className="mr-2 text-5xl font-extrabold">{price}</span>
      <span className="text-gray-500 dark:text-gray-400">/month</span>
    </div>
    <ul role="list" className="mb-8 space-y-4 text-left">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center space-x-3">
          <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button className="w-full">{buttonText}</Button>
  </div>
);

const PricingPage = () => {
  const pricingTiers = [
    {
      name: "Free",
      price: "$0",
      features: [
        "5 minutes of video processing per month",
        "AI-generated captions",
        "Basic subtitle editing",
        "Standard processing speed",
        "720p max resolution"
      ],
      buttonText: "Start for Free"
    },
    {
      name: "Basic",
      price: "$9.99",
      features: [
        "30 minutes of video processing per month",
        "AI-generated captions",
        "Advanced subtitle editing",
        "Faster processing speed",
        "1080p max resolution",
        "Email support"
      ],
      buttonText: "Get Started"
    },
    {
      name: "Pro",
      price: "$24.99",
      features: [
        "120 minutes of video processing per month",
        "AI-generated captions with higher accuracy",
        "Advanced subtitle editing with style customization",
        "Priority processing speed",
        "4K resolution support",
        "Email and chat support",
        "Subtitle translation to 1 language"
      ],
      buttonText: "Go Pro"
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing - SubtitleAI</title>
      </Head>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Designed for creators like you</h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">Here at SubtitleAI we focus on making video subtitling easy, fast, and accessible for everyone.</p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PricingPage;