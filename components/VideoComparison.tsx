import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Component() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">See the Difference</h2>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2 max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl transform rotate-2 group-hover:rotate-1 transition-transform duration-300"></div>
              <div className="relative bg-white p-4 rounded-3xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Original Video</h3>
                <Image
                  alt="Original video without subtitles"
                  width={900}
                  height={1350}
                  src="/original.gif"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <ArrowRight className="w-12 h-12 text-blue-500" />
          </div>
          <div className="w-full lg:w-1/2 max-w-2xl mt-8 lg:mt-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-3xl transform -rotate-2 group-hover:-rotate-1 transition-transform duration-300"></div>
              <div className="relative bg-white p-4 rounded-3xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Video with Subtitles</h3>
                <Image
                  alt="Video with AI-generated subtitles"
                  width={900}
                  height={1350}
                  src="/subtitle.gif"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-12 text-lg text-gray-600 max-w-2xl mx-auto">
          Our AI-powered subtitle generator transforms your videos, making them more accessible and engaging for all viewers.
        </p>
      </div>
    </section>
  )
}