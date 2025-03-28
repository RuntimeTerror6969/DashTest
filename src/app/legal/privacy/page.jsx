'use client';
import { useState, useEffect } from 'react';
import LegalLayout from '../LegalLayout';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    setFormattedDate(`${day} ${month} ${year}`);
  }, []);

  return (
    <LegalLayout currentPage="/legal/privacy">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4"><strong>Last updated:</strong> {formattedDate}</p>
          
          <p className="mb-6"><strong>QuantTraderTools</strong> ("Company," "we," "us," or "our") respects your privacy and is committed to protecting it. This policy explains what information we collect, how we use it, and your choices regarding your data when you use <strong>QuantCopier</strong> (the "Product") and our related services (the "Services"), including our website.</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
            <p>We only collect information you provide directly. This may include personal information (name, email, phone number, location) and data related to your use of the Services. We may also collect information from our business partners, including customers, suppliers, and vendors for business administration. Information submitted or uploaded by our customers and their end-users is considered customer content and is subject to our contractual agreements with those customers.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Use of Information</h2>
            <p>We use your information to provide the Services, fulfill your requests, communicate with you (including marketing communications with your consent), improve our Services, comply with legal obligations, and for other purposes described when you provide the information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Disclosure of Information</h2>
            <p>We may share aggregated, non-identifying information without restriction. We may share personal information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Service providers (bound by confidentiality agreements)</li>
              <li>Business partners</li>
              <li>Successors in case of a merger or acquisition</li>
              <li>Legal authorities if required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>We employ security measures to protect your information, but no transmission over the internet is completely secure.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p>Your data may be stored and processed in countries outside your residence. By using our Services, you consent to this transfer. We will only transfer your personal information if it is required or permitted under applicable data protection law and if appropriate safeguards are in place.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p>Our Services are not for children under 15. We do not knowingly collect data from children under 15 nor monitor the age of our users. If you believe we have collected such data, please contact us.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data. For European Economic Area (EEA) residents under GDPR and Indian residents under DPDPA, these rights may include access, correction, erasure, restriction of processing, data portability, and the right to withdraw consent or lodge a complaint with your local data protection authority. While we aim to honor these rights where possible, some requests may be limited by applicable laws and our legitimate business interests. You can control how some information is collected and used. You can access, correct, or delete your personal information by contacting us at <a href="mailto:quantcopier@gmail.com" className="text-primary hover:underline">quantcopier@gmail.com</a>. You can also delete your information by deleting your account through your registered email address on our client dashboard.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to this Policy</h2>
            <p>We may update this policy and it will be reflected in this page immediately. We will notify you via email of material changes if you are subscribed to our products or services.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p>For questions about this policy, reach out to us using our <Link href="/#contact" className="text-primary hover:underline">Contact Form</Link>.</p>
          </section>
        </div>
      </div>
    </LegalLayout>
  );
} 