'use client';
import { useState, useEffect } from 'react';
import LegalLayout from '../LegalLayout';

export default function RefundPolicy() {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    setFormattedDate(`${day} ${month} ${year}`);
  }, []);

  return (
    <LegalLayout currentPage="/legal/refund">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">QuantCopier Refund Policy</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="mb-4"><strong>Last updated:</strong> {formattedDate}</p>
          
          <p className="mb-6">This policy applies to purchases of QuantCopier. By using our services, you agree to these terms.</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>All sales are final after 48 hours from the purchase.</li>
              <li>Refunds are only granted if the product doesn't work as advertised.</li>
              <li>We do not offer refunds for simply changing your mind or for issues with third-party software or unsupported operating systems.</li>
              <li>Refunds are not granted for problems connecting or trading with supported MetaTrader5 platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subscription Cancellations</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>You can cancel your monthly subscription anytime.</li>
              <li>Cancellation prevents future charges, but you won't receive a refund for the current billing cycle.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Requesting a Refund</h2>
            <p>Contact us at <a href="mailto:quantcopier@gmail.com" className="text-primary hover:underline">quantcopier@gmail.com</a> to request a refund. If approved, it will be credited to your original payment method within 7-10 business days. If expedited assistance is required, please contact <strong>Dilip Rajkumar</strong> on <a href="https://wa.me/917708385855" className="text-primary hover:underline">WhatsApp</a></p>
          </section>

          <div className="bg-primary/10 border border-primary rounded-lg p-4 mt-8">
            <p className="mb-0">
              <strong>Please note:</strong> Our software is designed to work specifically with MetaTrader 5 running on Windows operating system. We are not responsible for compatibility issues when using other operating systems or attempting to run MetaTrader 5 on non-Windows platforms.
            </p>
          </div>
        </div>
      </div>
    </LegalLayout>
  );
} 