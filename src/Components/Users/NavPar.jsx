import React, { useState, useEffect } from 'react';

const Navbar = ({ language, toggleLanguage }) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide navbar
        setShowNavbar(false);
      } else {
        // scrolling up → show navbar
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`PageHead ${showNavbar ? 'show' : 'hide'}`}>
      <img src="/Logo.png" alt="El Bossely Bikes Logo" className="logo" />
      <nav className="navBar">
        <div>
          <a href="#home">{language === 'en' ? 'Home' : 'الرئيسية'}</a>
          <a href="#featured">{language === 'en' ? 'Featured Bikes' : 'الدراجات المميزة'}</a>
          <a href="#products">{language === 'en' ? 'Products' : 'المنتجات'}</a>
          <a href="#order">{language === 'en' ? 'Order Bike' : 'طلب دراجة'}</a>
          <a href="#reviews">{language === 'en' ? 'Reviews' : 'المراجعات'}</a>
        </div>
      </nav>
        <button onClick={toggleLanguage} className="language-toggle">
          {language === 'en' ? 'English' : 'العربية'}
        </button>
    </div>
  );
};

export default Navbar;
