/* ─────────────────────────────────────────────────────────────────────────────
   App.tsx — Root router and layout for Aadhara Foundation website
   ───────────────────────────────────────────────────────────────────────────── */

import { BrowserRouter, Routes, Route, ScrollRestoration, Navigate } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';

import { Navbar, Footer, PageTransition } from './components';
import {
  Home,
  About,
  Causes,
  Projects,
  Impact,
  Donate,
  DonateCheckout,
  DonateSuccess,
  Contact,
  NotFound,
} from './pages';

// ─── Route wrapper: applies PageTransition to every page ─────────────────────

function RoutedPage({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ReactLenis root>
      <BrowserRouter>
        {/* Restore scroll position on navigation */}
        <ScrollRestoration />

        {/* Always-visible navigation */}
        <Navbar />

        {/* Page routes */}
        <Routes>
          <Route
            path="/"
            element={
              <RoutedPage>
                <Home />
              </RoutedPage>
            }
          />
          <Route
            path="/about"
            element={
              <RoutedPage>
                <About />
              </RoutedPage>
            }
          />
          <Route
            path="/causes"
            element={
              <RoutedPage>
                <Causes />
              </RoutedPage>
            }
          />
          <Route
            path="/projects"
            element={
              <RoutedPage>
                <Projects />
              </RoutedPage>
            }
          />
          <Route
            path="/impact"
            element={
              <RoutedPage>
                <Impact />
              </RoutedPage>
            }
          />
          <Route
            path="/donate"
            element={
              <RoutedPage>
                <Donate />
              </RoutedPage>
            }
          />
          <Route
            path="/donate/checkout/:token"
            element={
              <RoutedPage>
                <DonateCheckout />
              </RoutedPage>
            }
          />
          <Route
            path="/donate/success/:token"
            element={
              <RoutedPage>
                <DonateSuccess />
              </RoutedPage>
            }
          />
          {/* Legacy route retired: redirected to /donate */}
          <Route
            path="/pay/:token"
            element={<Navigate to="/donate" replace />}
          />
          <Route
            path="/contact"
            element={
              <RoutedPage>
                <Contact />
              </RoutedPage>
            }
          />
          {/* 404 catch-all */}
          <Route
            path="*"
            element={
              <RoutedPage>
                <NotFound />
              </RoutedPage>
            }
          />
        </Routes>

        {/* Always-visible footer */}
        <Footer />
      </BrowserRouter>
    </ReactLenis>
  );
}
