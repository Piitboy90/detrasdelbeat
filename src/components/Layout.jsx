import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from '@/components/ui/toaster';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;