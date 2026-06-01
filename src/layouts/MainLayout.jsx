import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;