'use client';
import { useState, useEffect } from 'react';
import LegalLayout from '../LegalLayout';

export default function TermsOfService() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    setFormattedDate(`${day} ${month} ${year}`);
  }, []);

  return (
    <LegalLayout currentPage="/legal/terms">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Use</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4"><strong>Last updated:</strong> {formattedDate}</p>
          
          <p className="mb-6">These Terms of Use govern your access to and use of QuantCopier (the "Product"), offered by QuantTraderTools ("Company," "we," or "us") via this website and related services (collectively, the "Services"). By using the Services, you agree to these Terms and our Privacy Policy. If you disagree, do not use the Services.</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
            <p>The Services of our product(s) are intended for users who meet the minimum age requirements in their jurisdiction. In most regions, this means being at least 15 years old, though some jurisdictions may require users to be older. By using the Services, you confirm you meet the applicable age requirement in your location and can form a binding contract. You are responsible for complying with all applicable laws.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Risk Disclosure</h2>
            <p>Trading foreign exchange on margin and CFDs carries substantial risk, including the potential loss of more than your initial investment. Leverage can magnify both gains and losses. Consider your investment objectives, experience, and risk tolerance before trading. Consult a financial advisor if needed. We are not responsible for any trading losses you incur while using QuantCopier.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
            <p>We reserve the right to refuse service, modify or discontinue the Services (or any part thereof), or change prices without notice. We are not liable for any resulting impact.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Accuracy</h2>
            <p>We strive for accurate information but do not guarantee it. Content on our site is for general information only.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Product Availability</h2>
            <p>Product availability and pricing are subject to change without notice. We may limit product quantities or sales. We do not warrant that products will meet your expectations. We may refuse or limit orders at our discretion.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Service Reliability and Limitations</h2>
            <p>While we strive to provide reliable services with our software (<strong>QuantCopier</strong>), you acknowledge and agree that:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Despite our best efforts to improve our products and features, service errors and interruptions may occur</li>
              <li>The product may not always function as expected or described due to various technical factors</li>
              <li>Factors beyond our control, including but not limited to VPS failures, server outages, network issues, or third-party service disruptions, may affect the product's functionality</li>
              <li>We cannot guarantee continuous, uninterrupted, or secure access to our services</li>
              <li>Market data delays, execution issues, or other trading-related complications may occur due to external factors</li>
              <li>You understand and accept these limitations when using our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Terms Changes</h2>
            <p>We may update these Terms at any time. Your continued use of the Services after changes are posted constitutes acceptance.</p>
          </section>
        </div>
      </div>
    </LegalLayout>
  );
} 