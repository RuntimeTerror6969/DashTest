'use client';

import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import ParticleAnimation from './ProductStreakAnimation';
import GlowingBorder from './GlowingBorder';
import ProductCurrencySelector from './ProductCurrencySelector';
import Link from 'next/link';

const PricingTier = ({ name, price, features, isPopular }) => (
  <div className={`p-6 rounded-xl border ${isPopular ? 'border-primary' : 'border-border/40'} bg-white dark:bg-black relative`}>
    {isPopular && (
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm">
        Most Popular
      </span>
    )}
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <p className="text-3xl font-bold mb-4">${price}<span className="text-sm font-normal">/mo</span></p>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {feature}
        </li>
      ))}
    </ul>
    <button className="w-full mt-6 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
      Get Started
    </button>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-border/40">
      <button
        className="w-full py-4 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-left text-gray-900 dark:text-white">{question}</span>
        <svg
          className={`w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4">
          <p className="text-gray-600 dark:text-gray-300">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default function ProductPage({ 
  title,
  heroDescription,
  features,
  howItWorks,
  pricingTiers,
  faqs,
  navItems,
  sectionTitles,
  sectionDescriptions,
  onCurrencyChange,
  onSelectPlan
}) {
  const [activeTab, setActiveTab] = useState('combo');
  const [currency, setCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(83);
  const pricingSectionRef = useRef(null);
  
  const pathname = usePathname();
  const isQuantCopier = pathname.includes('quantcopier');
  const isMessageCopier = pathname.includes('messagecopier');

  const handleCurrencyChange = (newCurrency, rate) => {
    setCurrency(newCurrency);
    setExchangeRate(rate);
    onCurrencyChange(newCurrency, rate);
  };

  const formatPrice = (price) => {
    if (currency === 'USD') return price;
    // Convert to INR and round to nearest 10
    const inrPrice = Math.floor(price * exchangeRate / 10) * 10;
    return inrPrice;
  };

  const scrollToPricing = () => {
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePay = (tier) => {
    if (onSelectPlan) {
      onSelectPlan({
        orderID: tier.productId,
        item: tier.productId,
        currency: currency,
        totalAmount: tier.price
      });
    }
  };

  return (
    <>
      <Header 
        navItems={navItems} 
        showDashboardButton={isQuantCopier || isMessageCopier}
        rightContent={
          <div className="flex items-center gap-4">
            <ProductCurrencySelector onCurrencyChange={handleCurrencyChange} />
            {(isQuantCopier || isMessageCopier) && (

              <Link
                href="/login"
                className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors"
              >
                Client Dashboard
              </Link>
            )}
          </div>
        }
      />
      <main>
        {/* Hero Section */}
        <section className="relative bg-black">
          {/* Add darkened background for particles */}
          <div className="absolute inset-0 bg-black opacity-90" />
          
          {/* Add Particles */}
          <ParticleAnimation />

          <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Text content */}
              <div className="flex-1 text-center md:text-left relative z-10">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-8">
                  {heroDescription}
                </p>
                <div className="flex justify-center md:justify-start">
                  <button 
                    onClick={scrollToPricing}
                    className="px-8 py-3 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* YouTube Shorts Video */}
              <div className="flex-1 flex justify-center relative z-10">
                <div className="w-[315px] h-[560px] rounded-xl overflow-hidden shadow-2xl ml-[250px] relative">
                  <iframe
                    width="315"
                    height="560"
                    src="https://www.youtube.com/embed/dgmYLfdsqs8"
                    title={`${title} Demo Video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full relative z-10"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full-width dark background wrapper */}
        <div className="bg-white dark:bg-black">
          {/* Content container with max width */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Features Section */}
            <section id="features" className="mb-20">
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">QUANTCOPIER FEATURES</span>
                <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">{sectionTitles.features}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index} 
                    className="p-6 rounded-xl border border-border/40 bg-white dark:bg-[#070922] hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="mb-20">
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">How It Works?</span>
                <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">
                  {sectionTitles.howItWorks}
                </h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
                {/* Videos Column */}
                <div className="md:w-5/12 space-y-6">
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/D0UnqGm_miA?controls=1&rel=0"
                      title="QuantCopier Demo Video 1"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube.com/embed/D0UnqGm_miA?controls=1&rel=0"
                      title="QuantCopier Demo Video 2"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>

                {/* Steps Column */}
                <div className="md:w-7/12">
                  {howItWorks.map((step, index) => (
                    <div 
                      key={index} 
                      className="flex gap-6 mb-8 p-6 rounded-xl border border-border/40 bg-white dark:bg-[#070922] hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-2">
                          {step.icon}
                        </div>
                        <span className="text-primary font-bold">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-12">
                <button 
                  onClick={scrollToPricing}
                  className="px-8 py-3 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </button>
              </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" ref={pricingSectionRef} className="mb-20">
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-semibold uppercase tracking-wider">pricing plans</span>
                <h2 className="text-3xl font-bold mt-4 text-gray-900 dark:text-white">
                  {sectionTitles.pricing}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto">
                  {sectionDescriptions.pricing}
                </p>
              </div>

              {/* Pricing Tabs */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex rounded-lg border border-border/40 p-1">
                  <button
                    onClick={() => setActiveTab('telegram')}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'telegram' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isQuantCopier ? 'QuantCopier Telegram' : 'MessageCopier Telegram'}
                  </button>
                  <button
                    onClick={() => setActiveTab('discord')}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'discord' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isQuantCopier ? 'QuantCopier Discord' : 'MessageCopier Discord'}
                  </button>
                  <button
                    onClick={() => setActiveTab('combo')}
                    className={`px-4 py-2 rounded-md ${
                      activeTab === 'combo' 
                        ? 'bg-primary text-white' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    Telegram + Discord (Combo)
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid md:grid-cols-4 gap-8">
                {pricingTiers[activeTab].map((tier, index) => (
                  <div key={index}>
                    {tier.isPopular ? (
                      <GlowingBorder>
                        <div className={`p-6 rounded-xl bg-white dark:bg-[#070922] relative min-h-[420px] flex flex-col 
                          transition-all duration-300 ease-in-out
                          hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]
                          hover:-translate-y-1`}
                        >
                          <div className="flex-grow">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{tier.name}</h3>
                            <div className="mb-8">
                              <div className="flex items-baseline gap-1">
                                <span className="text-gray-500 dark:text-gray-400 text-lg">
                                  {currency === 'USD' ? '$' : '₹'}
                                </span>
                                <span className="text-4xl font-light text-gray-900 dark:text-white">
                                  {formatPrice(tier.price)}
                                </span>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">{tier.period}</p>
                            </div>
                            <ul className="space-y-4">
                              {tier.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-6 flex items-center justify-center gap-2">
                              {activeTab === 'telegram' && (
                                <img src="/telegramLogo.svg" alt="Telegram" className="w-6 h-6" />
                              )}
                              {activeTab === 'discord' && (
                                <img src="/discordLogo.svg" alt="Discord" className="w-6 h-6" />
                              )}
                              {activeTab === 'combo' && (
                                <>
                                  <img src="/telegramLogo.svg" alt="Telegram" className="w-6 h-6" />
                                  <span className="text-gray-400">+</span>
                                  <img src="/discordLogo.svg" alt="Discord" className="w-6 h-6" />
                                </>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => handlePay(tier)}
                            className="w-full mt-6 px-6 py-3 bg-transparent border-2 border-primary text-primary dark:text-white hover:bg-primary hover:text-white rounded-lg transition-colors font-medium"
                          >
                            Select Plan
                          </button>
                        </div>
                      </GlowingBorder>
                    ) : (
                      <div className={`p-6 rounded-xl border border-border/40 bg-white dark:bg-[#070922] relative min-h-[420px] flex flex-col 
                        transition-all duration-300 ease-in-out
                        hover:shadow-[0_0_30px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]
                        hover:-translate-y-1`}
                      >
                        <div className="flex-grow">
                          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{tier.name}</h3>
                          <div className="mb-8">
                            <div className="flex items-baseline gap-1">
                              <span className="text-gray-500 dark:text-gray-400 text-lg">
                                {currency === 'USD' ? '$' : '₹'}
                              </span>
                              <span className="text-4xl font-light text-gray-900 dark:text-white">
                                {formatPrice(tier.price)}
                              </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{tier.period}</p>
                          </div>
                          <ul className="space-y-4">
                            {tier.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                <svg className="w-5 h-5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-6 flex items-center justify-center gap-2">
                            {activeTab === 'telegram' && (
                              <img src="/telegramLogo.svg" alt="Telegram" className="w-6 h-6" />
                            )}
                            {activeTab === 'discord' && (
                              <img src="/discordLogo.svg" alt="Discord" className="w-6 h-6" />
                            )}
                            {activeTab === 'combo' && (
                              <>
                                <img src="/telegramLogo.svg" alt="Telegram" className="w-6 h-6" />
                                <span className="text-gray-400">+</span>
                                <img src="/discordLogo.svg" alt="Discord" className="w-6 h-6" />
                              </>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => handlePay(tier)}
                          className="w-full mt-6 px-6 py-3 bg-transparent border-2 border-primary text-primary dark:text-white hover:bg-primary hover:text-white rounded-lg transition-colors font-medium"
                        >
                          Select Plan
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs Section */}
            <section id="faqs">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Frequently Asked Questions</h2>
              <div className="max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} {...faq} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 