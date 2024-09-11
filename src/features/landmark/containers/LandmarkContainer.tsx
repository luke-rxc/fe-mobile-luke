import React from 'react';
import { FooterProvider } from '../contexts/FooterContext';
import { HeaderProvider } from '../contexts/HeaderContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Navigation } from '../components/navigation';

export const LandmarkContainer: React.FC = ({ children }) => {
  return (
    <HeaderProvider>
      <FooterProvider>
        <NavigationProvider>
          <Header />
          <Navigation />
          {children}
          <Footer />
        </NavigationProvider>
      </FooterProvider>
    </HeaderProvider>
  );
};
