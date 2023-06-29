import React from 'react';
import '../../App.css';
import Cards from '../Cards';
import HeroSection from '../HeroSection';
import Footer from '../Footer';
import Navbar2 from '../Navbar2';

function Home() {
  return (
    <>
      <Navbar2/>
      <HeroSection />
      <Cards />
      <Footer />
    </>
  );
}

export default Home;
