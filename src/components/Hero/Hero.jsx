'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import ParticleAnimation from './ParticleAnimation';

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  
  const content = [
    {
      url: "https://tscopier-cdn.com/static/resources/videos/demo.mp4",
      title: "TradeCopier FeatureEssense",
      heading: "Welcome to Signal Copier",
      description: "Automate your trading signals across multiple accounts with our powerful signal copying solution"
    },
    {
      url: "https://telegramsignalcopier.com/wp-content/uploads/2024/07/Final-4_3.mp4",
      title: "TradeCopier Demo",
      heading: "Telegram Signal Copier",
      description: "Copy trading signals directly from Telegram channels to your MT4/MT5 accounts automatically"
    }
  ];

  return (
    <section className="relative w-full h-[75vh] mx-auto overflow-hidden">
      {/* Darkened background for more pronounced particle effects */}
      <div className="absolute inset-0 bg-black opacity-90" />
      
      {/* Particles */}
      <ParticleAnimation />

      {/* Content Container */}
      <div className="absolute inset-0 px-6 md:px-12 flex items-center">
        {/* Text Content - Centered in left half */}
        <div className='flex-[0.625] ml-[12.5%]'>
          <motion.div
            key={currentVideo} // This triggers animation when content changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              {content[currentVideo].heading.split(' ').map((word, i) => (
                <span key={i} className={i === content[currentVideo].heading.split(' ').length - 1 ? 'text-primary' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              {content[currentVideo].description}
            </p>
          </motion.div>
        </div>

        {/* Video Container - Right side */}
        <div className='flex-[0.375] relative space-y-4 ml-[12.5%]'>
          {/* Video Frame */}
          <div className="rounded-lg overflow-hidden shadow-2xl">
            <video 
              key={content[currentVideo].url}
              autoPlay 
              muted 
              className="w-full aspect-video object-contain"
              onEnded={() => setCurrentVideo((prev) => (prev + 1) % content.length)}
            >
              <source src={content[currentVideo].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Radio-style Video Controls */}
          <div className="flex justify-center gap-3">
            {content.map((item, index) => (
              <button
                key={item.url}
                onClick={() => setCurrentVideo(index)}
                className="relative group"
                aria-label={item.title}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentVideo === index 
                    ? 'bg-primary scale-100' 
                    : 'bg-white/50 scale-75 hover:scale-90 hover:bg-white/70'
                }`} 
                />
                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-white/70 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className='absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center'>
        <a href='#about'>
          <div className='w-[35px] h-[64px] rounded-3xl border-4 border-white/20 flex justify-center items-start p-2'>
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className='w-3 h-3 rounded-full bg-white mb-1'
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero; 