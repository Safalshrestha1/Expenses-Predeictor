import React from 'react';
import Navbar from '../components/nav/Navbar.jsx';
import Hero from '../components/home/Hero.jsx';
import TrustSection from '../components/home/TrustSection.jsx';
import FeaturesSection from '../components/home/FeaturesSection.jsx';
import HowItWorks from '../components/home/HowItWorks.jsx';
import PredictionPreview from '../components/home/PredictionPreview.jsx';
import DashboardPreviewSection from '../components/home/DashboardPreviewSection.jsx';
import CTASection from '../components/home/CTASection.jsx';
import Footer from '../components/home/Footer.jsx';
import '../styles/home.css';

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <TrustSection />
      <FeaturesSection />
      <HowItWorks />
      <PredictionPreview />
      <DashboardPreviewSection />
      <CTASection />
      <Footer />
    </div>
  );
}
