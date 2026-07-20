import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

interface MainLayoutProps {
  children: ReactNode;
  whatsappMessage?: string;
}

export default function MainLayout({ children, whatsappMessage }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton message={whatsappMessage} />
    </div>
  );
}