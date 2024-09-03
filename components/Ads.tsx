import {
    Film,
    Globe,
    Languages,
    Smartphone,
    Sparkles,
    Tv,
    Users,
    Video,
    VolumeX,
  } from "lucide-react";


export default function Footer() {
    return (
        <footer className="w-full border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Tv className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">1080p Resolution</h3>
                    <p className="text-sm text-gray-600">
                    Export up to 3 1080p HD clips per day, guaranteeing that your
                    videos and captions are crystal clear.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Video className="h-8 w-8 text-green-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">AI Clip Curation</h3>
                    <p className="text-sm text-gray-600">
                    Our AI identifies key moments in your videos that should be turned
                    into viral clips.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Smartphone className="h-8 w-8 text-purple-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">AI Dynamic Layout</h3>
                    <p className="text-sm text-gray-600">
                    Our AI automatically rearranges your video layout for the best
                    viewing experience.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Sparkles className="h-8 w-8 text-yellow-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">Caption Animation</h3>
                    <p className="text-sm text-gray-600">
                    Our animated caption options will keep your viewers watching
                    longer and more engaged.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <VolumeX className="h-8 w-8 text-red-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">Filler Word Removal</h3>
                    <p className="text-sm text-gray-600">
                    Clean your audio track by having OpusClip remove unnecessary
                    filler words, making your captions clearer.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Globe className="h-8 w-8 text-indigo-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">
                    Caption Translation to English
                    </h3>
                    <p className="text-sm text-gray-600">
                    Speed your workflow by automatically translating your non-english
                    captions into English.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Languages className="h-8 w-8 text-pink-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">
                    Support for multiple languages
                    </h3>
                    <p className="text-sm text-gray-600">
                    OpusClip supports captioning in over 20 different languages.
                    </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg">
                    <Users className="h-8 w-8 text-orange-500 mb-2" />
                    <h3 className="text-lg font-semibold mb-2">
                    Detects and focuses on active speakers
                    </h3>
                    <p className="text-sm text-gray-600">
                    Ensures speakers are always centered in your videos frame,
                    enhancing your viewer experience.
                    </p>
                </div>
                </div>
                <div className="mt-8 text-center">
                
                </div>
            </footer>
    )
}