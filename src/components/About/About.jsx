export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">About Us</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="/about-image.png"
                alt="About Us"
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Our Mission
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                QuantTraderTools is dedicated to providing cutting-edge SaaS solutions that empower businesses 
                and individual clients to thrive in the digital age. Our products combines innovation with 
                reliability to deliver exceptional results at affordable prices.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="min-w-[36px] h-9 rounded-full bg-primary/10 dark:bg-primary/40 flex items-center justify-center text-primary dark:text-white">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                      <path d="M12 11h4" />
                      <path d="M12 16h4" />
                      <path d="M8 11h.01" />
                      <path d="M8 16h.01" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Professional Excellence</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Committed to delivering the highest quality solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="min-w-[36px] h-9 rounded-full bg-primary/10 dark:bg-primary/40 flex items-center justify-center text-primary dark:text-white">
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Customer Focus</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Ease of use, cost effectiveness and customer satisfaction are our primary goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 