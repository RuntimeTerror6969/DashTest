export default function Contact() {
  return (
    <section id="contact" className="relative z-0 py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Contact Us</h2>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-12">
            Have questions? We love to hear from you. Send us a message and we will respond as soon as possible.
          </p>
          
          <div className="bg-white dark:bg-black border border-border/40 rounded-lg shadow-sm">
            {/* Fillout Form Integration */}
            <iframe
              src="https://forms.fillout.com/t/fZU6itryzBus"
              className="w-full min-h-[900px] border-0"
              title="Contact Form"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen; geolocation"
            />
          </div>
          
        </div>
      </div>
    </section>
  );
} 