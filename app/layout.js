import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export const metadata = {
  title: 'GrowthNest - Grow Beyond Limits | Insurance Advisor Platform',
  description: 'Join India\'s fastest-growing insurance advisor network. Get trained, certified, and earn unlimited income with 20+ insurance partners. 5000+ advisors trust GrowthNest.',
  keywords: 'insurance advisor, insurance career, LIC agent, HDFC Life, insurance training, earn money, financial advisor, GrowthNest',
  openGraph: {
    title: 'GrowthNest - Grow Beyond Limits',
    description: 'Join India\'s fastest-growing insurance advisor network. Start your insurance career today!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GrowthNest',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: '100vh', paddingTop: 'var(--nav-height)' }}>
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
