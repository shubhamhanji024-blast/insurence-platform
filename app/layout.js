import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { AuthProvider } from '@/context/AuthContext';

export const viewport = {
  themeColor: '#1e3a8a',
};

export const metadata = {
  title: 'GrowthNest | Smarter Financial Decisions',
  description: 'GrowthNest helps individuals and businesses make smarter financial decisions through personalized financial planning, investment guidance, and modern financial solutions.',
  keywords: 'financial planning, investment planning, wealth management, retirement planning, tax planning, insurance planning, GrowthNest',
  openGraph: {
    title: 'GrowthNest | Smarter Financial Decisions',
    description: 'GrowthNest helps individuals and businesses make smarter financial decisions through personalized financial planning, investment guidance, and modern financial solutions.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GrowthNest',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </AuthProvider>
      </body>
    </html>
  );
}
