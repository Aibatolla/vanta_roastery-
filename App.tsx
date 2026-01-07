import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { TheRitual } from './components/TheRitual';
import { TheStandard } from './components/TheStandard';
import { TheOrigins } from './components/TheOrigins';
import { Atmosphere } from './components/Atmosphere';
import { LimitedEdition } from './components/LimitedEdition';
import { Products } from './components/Products';
import { Subscription } from './components/Subscription';
import { Footer } from './components/Footer';
import { NoiseOverlay } from './components/NoiseOverlay';
import { Cursor } from './components/Cursor';
import { SmoothScroll } from './components/SmoothScroll';
import { Navigation } from './components/Navigation';
import { MenuModal } from './components/MenuModal';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReservationModal } from './components/ReservationModal';
import { Toast } from './components/Toast';
import { AdminPanel } from './components/AdminPanel';
import { MenuProvider, useMenu } from './context/MenuContext';
import { CartProvider, useCart } from './context/CartContext';

// Simple router - check if we're on /admin
const isAdminRoute = () => window.location.pathname === '/admin';

// Wrapper to access menu and cart context
const AppContent = () => {
  const { isOpen, close } = useMenu();
  const { toastMessage, isToastVisible, hideToast } = useCart();
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  // Admin route
  if (isAdminRoute()) {
    return <AdminPanel />;
  }

  return (
    <>
      <main className="w-full bg-[#0a0908] text-white selection:bg-amber-500/30">
        <Cursor />
        <NoiseOverlay />
        <Navigation onReserveClick={() => setIsReservationOpen(true)} />
        <div id="hero">
          <Hero
            posterSrc="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2574&auto=format&fit=crop"
            brandName="VANTA"
            onReserveClick={() => setIsReservationOpen(true)}
          />
        </div>
        <div id="standard"><TheStandard /></div>
        <div id="ritual"><TheRitual /></div>
        <div id="atmosphere"><Atmosphere /></div>
        <div id="origins"><TheOrigins /></div>
        <div id="limited"><LimitedEdition onOpenReservation={() => setIsReservationOpen(true)} /></div>
        {/* <Products /> */}
        <div id="subscription"><Subscription /></div>
        <Footer />
      </main>

      {/* Modals */}
      <MenuModal isOpen={isOpen} onClose={close} />
      <CartModal />
      <CheckoutModal />
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        onHide={hideToast}
      />
    </>
  );
};

export default function App() {
  return (
    <MenuProvider>
      <CartProvider>
        <SmoothScroll>
          <AppContent />
        </SmoothScroll>
      </CartProvider>
    </MenuProvider>
  );
}