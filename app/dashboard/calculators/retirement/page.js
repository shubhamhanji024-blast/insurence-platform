'use client';
import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import RetirementCalculator from '@/components/retirement/RetirementCalculator';

export default function DashboardRetirementPage() {
  return (
    <DashboardLayout>
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-900)', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif" }}>
          🌴 Retirement Calculator
        </h2>
        <p style={{ color: 'var(--gray-600)', fontSize: '0.92rem', margin: 0 }}>
          Estimate the retirement corpus you may need and plan your savings accordingly.
        </p>
      </div>

      <Suspense fallback={<div className="glass-card text-center" style={{ padding: '3rem', color: 'var(--gray-500)' }}>Loading Retirement calculator...</div>}>
        <RetirementCalculator />
      </Suspense>
    </DashboardLayout>
  );
}
