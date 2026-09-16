'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SIPCalculator from '@/components/sip/SIPCalculator';

export default function DashboardSIPPage() {
  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
          📈 SIP Calculator
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', margin: 0 }}>
          Estimate how your monthly investments can grow over time with the power of compounding.
        </p>
      </div>

      <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>Loading SIP calculator...</div>}>
        <SIPCalculator />
      </Suspense>
    </DashboardLayout>
  );
}
