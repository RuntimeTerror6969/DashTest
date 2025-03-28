'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import PaymentCheckout from '@/components/PaymentCheckout';
import merchantConfig from '@/config/merchantConfig.json';

import { 
  Copy,
  MessageSquare,
  Zap,
  Clock,
  Filter,
  Bell,
  Download,
  Settings,
  PlayCircle,
  MessageCircle,
  BellRing,
  CheckCircle
} from 'lucide-react';

// Dynamically import components that use browser APIs
const DynamicProductPage = dynamic(() => import('@/components/Products/ProductPage'), {
  ssr: true
});

export default function MessageCopierPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentCurrency, setCurrentCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState(83); // Default rate

  const handleCurrencyChange = (currency, rate) => {
    setCurrentCurrency(currency);
    setExchangeRate(rate);
  };

  const handleSelectPlan = (plan) => {
    let finalAmount = plan.totalAmount;
    
    // Convert amount if currency is INR
    if (currentCurrency === 'INR') {
      finalAmount = Math.round(plan.totalAmount * exchangeRate);
    }
    
    setSelectedPlan({
      ...plan,
      orderID: generateOrderId(plan.item),
      currency: currentCurrency,
      totalAmount: finalAmount
    });
    setShowPayment(true);
  };

  // Generate a stable order ID based on the plan details
  const generateOrderId = (productId) => {
    // Product ID mapping
    const productIdMap = {
      'MessageCopierTelegram-M1': 'MCTM1',
      'MessageCopierTelegram-M6': 'MCTM6',
      'MessageCopierTelegram-M12': 'MCTM12',
      'MessageCopierTelegram-Lifetime': 'MCTL',
      'MessageCopierDiscord-M1': 'MCDM1',
      'MessageCopierDiscord-M6': 'MCDM6',
      'MessageCopierDiscord-M12': 'MCDM12',
      'MessageCopierDiscord-Lifetime': 'MCDL',
      'MessageCopierCombo-M1': 'MCCM1',
      'MessageCopierCombo-M6': 'MCCM6',
      'MessageCopierCombo-M12': 'MCCM12',
      'MessageCopierCombo-Lifetime': 'MCCL'
    };

    // Get shortened product ID
    const shortProductId = productIdMap[productId] || productId;

    // Generate timestamp in YYYYMMDDHHMM format
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');

    return `${shortProductId}-${timestamp}`;
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQs', href: '#faqs' }
  ];

  const pageData = {
    navItems,
    title: (
      <span className="font-serif">
        <span className="font-extralight">Message</span>
        <span className="font-medium">Copier</span>
      </span>
    ),
    heroDescription: "Our MessageCopier software enables seamless message synchronization between Discord and Telegram channels, offering comprehensive features for efficient content distribution and channel management.",
    features: [
      {
        icon: <Copy className="w-8 h-8 text-primary" />,
        title: "Cross-Platform Copying",
        description: "Copy messages seamlessly between Telegram channels and Discord servers, maintaining formatting and media content."
      },
      {
        icon: <MessageSquare className="w-8 h-8 text-primary" />,
        title: "Smart Message Parsing",
        description: "Intelligent parsing system that preserves message formatting, emojis, and attachments across platforms."
      },
      {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Real-time Sync",
        description: "Instant message synchronization ensures your channels stay up-to-date with zero delay in content distribution."
      },
      {
        icon: <Clock className="w-8 h-8 text-primary" />,
        title: "Scheduled Posting",
        description: "Schedule messages to be copied and posted at specific times, perfect for content planning and time zone management."
      },
      {
        icon: <Filter className="w-8 h-8 text-primary" />,
        title: "Custom Filters",
        description: "Set up filters to copy only specific types of messages or content matching your criteria."
      },
      {
        icon: <Bell className="w-8 h-8 text-primary" />,
        title: "Activity Monitoring",
        description: "Get notifications about copying activities and channel updates through your preferred platform."
      }
    ],
    howItWorks: [
      {
        icon: <Download className="w-8 h-8 text-primary" />,
        number: "01",
        title: "Download & Install",
        description: "Download the MessageCopier software and follow our simple installation guide to get started."
      },
      {
        icon: <Settings className="w-8 h-8 text-primary" />,
        number: "02",
        title: "Configure Platforms",
        description: "Set up your Discord and Telegram credentials to enable cross-platform message copying."
      },
      {
        icon: <PlayCircle className="w-8 h-8 text-primary" />,
        number: "03",
        title: "Launch MessageCopier",
        description: "Start the application and connect to your source and destination channels."
      },
      {
        icon: <MessageCircle className="w-8 h-8 text-primary" />,
        number: "04",
        title: "Set Up Channels",
        description: "Select the source channels you want to copy from and the destination channels to copy to."
      },
      {
        icon: <BellRing className="w-8 h-8 text-primary" />,
        number: "05",
        title: "Configure Notifications",
        description: "Set up notification preferences to stay informed about copying activities."
      },
      {
        icon: <CheckCircle className="w-8 h-8 text-primary" />,
        number: "06",
        title: "Start Copying",
        description: "Begin automated message copying between your configured channels and servers."
      }
    ],
    pricingTiers: {
      telegram: [
        {
          name: "Monthly",
          price: "5",
          period: "per month",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Email support",
            "Telegram Only"
          ],
          isPopular: false,
          productId: "MessageCopierTelegram-M1",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierTelegram-M1"),
            item: "MessageCopierTelegram-M1",
            currency: "USD",
            totalAmount: 10
          })
        },
        {
          name: "6 Months",
          price: "25",
          period: "for 6 months",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Email support",
            "Telegram Only"
          ],
          isPopular: false,
          productId: "MessageCopierTelegram-M6",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierTelegram-M6"),
            item: "MessageCopierTelegram-M6",
            currency: "USD",
            totalAmount: 25
          })
        },
        {
          name: "Annual",
          price: "50",
          period: "per year",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Priority Meet support (1 year)",
            "Telegram Only"
          ],
          isPopular: false,
          productId: "MessageCopierTelegram-M12",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierTelegram-M12"),
            item: "MessageCopierTelegram-M12",
            currency: "USD",
            totalAmount: 50
          })
        },
        {
          name: "Lifetime",
          price: "100",
          period: "one-time payment",
          features: [
            "All previous features",
            "Lifetime updates + support",
            "Priority Meet support (1 year)",
            "Telegram Only"
          ],
          isPopular: true,
          productId: "MessageCopierTelegram-Lifetime",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierTelegram-Lifetime"),
            item: "MessageCopierTelegram-Lifetime",
            currency: "USD",
            totalAmount: 100
          })
        }
      ],
      discord: [
        {
          name: "Monthly",
          price: "5",
          period: "per month",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Email support",
            "Discord Only"
          ],
          isPopular: false,
          productId: "MessageCopierDiscord-M1",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierDiscord-M1"),
            item: "MessageCopierDiscord-M1",
            currency: "USD",
            totalAmount: 10
          })
        },
        {
          name: "6 Months",
          price: "25",
          period: "for 6 months",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Email support",
            "Discord Only"
          ],
          isPopular: false,
          productId: "MessageCopierDiscord-M6",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierDiscord-M6"),
            item: "MessageCopierDiscord-M6",
            currency: "USD",
            totalAmount: 25
          })
        },
        {
          name: "Annual",
          price: "50",
          period: "per year",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Priority Meet support (1 year)",
            "Discord Only"
          ],
          isPopular: false,
          productId: "MessageCopierDiscord-M12",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierDiscord-M12"),
            item: "MessageCopierDiscord-M12",
            currency: "USD",
            totalAmount: 50
          })
        },
        {
          name: "Lifetime",
          price: "100",
          period: "one-time payment",
          features: [
            "All previous features",
            "Lifetime updates + support",
            "Priority Meet support (1 year)",
            "Discord Only"
          ],
          isPopular: true,
          productId: "MessageCopierDiscord-Lifetime",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierDiscord-Lifetime"),
            item: "MessageCopierDiscord-Lifetime",
            currency: "USD",
            totalAmount: 100
          })
        }
      ],
      combo: [
        {
          name: "Monthly",
          price: "10",
          period: "per month",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Email support",
            "Telegram + Discord"
          ],
          isPopular: false,
          productId: "MessageCopierCombo-M1",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierCombo-M1"),
            item: "MessageCopierCombo-M1",
            currency: "USD",
            totalAmount: 20
          })
        },
        {
          name: "6 Months",
          price: "50",
          period: "for 6 months",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Email support",
            "Telegram + Discord"
          ],
          isPopular: false,
          productId: "MessageCopierCombo-M6",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierCombo-M6"),
            item: "MessageCopierCombo-M6",
            currency: "USD",
            totalAmount: 50
          })
        },
        {
          name: "Annual",
          price: "90",
          period: "per year",
          features: [
            "Unlimited channels",
            "Custom Message Filtering",
            "Priority Meet support (1 year)",
            "Telegram + Discord"
          ],
          isPopular: false,
          productId: "MessageCopierCombo-M12",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierCombo-M12"),
            item: "MessageCopierCombo-M12",
            currency: "USD",
            totalAmount: 90
          })
        },
        {
          name: "Lifetime",
          price: "180",
          period: "one-time payment",
          features: [
            "All previous features",
            "Lifetime updates + support",
            "Priority Meet support (1 year)",
            "Telegram + Discord"
          ],
          isPopular: true,
          productId: "MessageCopierCombo-Lifetime",
          onSelect: () => handleSelectPlan({
            orderID: generateOrderId("MessageCopierCombo-Lifetime"),
            item: "MessageCopierCombo-Lifetime",
            currency: "USD",
            totalAmount: 180
          })
        }
      ]
    },
    faqs: [
      {
        question: "Is my data secure?",
        answer: "Yes, your credentials and data are stored locally on your machine. We don't store any sensitive information on our servers."
      },
      {
        question: "Can I copy messages between different platforms?",
        answer: "Yes, MessageCopier supports cross-platform copying between Discord and Telegram while maintaining message formatting and media content."
      },
      {
        question: "What types of content can be copied?",
        answer: "MessageCopier supports text, images, videos, files, emojis, and formatted messages. Some platform-specific features may have limited compatibility."
      },
      {
        question: "Is there a limit to the number of channels?",
        answer: "Channel limits depend on your subscription tier. Higher tiers offer more channels and unlimited copying capabilities."
      },
      {
        question: "Can I schedule message copying?",
        answer: "Yes, you can schedule messages to be copied at specific times, perfect for managing content across different time zones."
      },
      {
        question: "Do you offer customer support?",
        answer: "Yes, we provide customer support via email and our dedicated support channel. Premium users get priority support."
      },
      {
        question: "Can I try before buying?",
        answer: "We offer a limited trial version that allows you to test basic features before purchasing a full license."
      }
    ],
    sectionTitles: {
      features: "Features Of Our MessageCopier Software",
      howItWorks: "Simple Setup Process",
      pricing: "Choose Your Plan"
    },
    sectionDescriptions: {
      pricing: "Select a plan that fits your needs. Whether you're managing a single channel or multiple servers, we have the right solution for you."
    }
  };

  if (showPayment && selectedPlan) {
    return (
      <PaymentCheckout
        orderData={{
          ...selectedPlan,
          currency: currentCurrency,
          exchangeRate
        }}
        merchantDetails={{
          ...merchantConfig,
        }}
      />
    );
  }

  return (
    <DynamicProductPage 
      {...pageData} 
      onCurrencyChange={handleCurrencyChange}
      onSelectPlan={handleSelectPlan}
    />
  );
} 