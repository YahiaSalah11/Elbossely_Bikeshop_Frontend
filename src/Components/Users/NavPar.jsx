import React, { useState, useEffect } from "react";
import LoginCard from "../Auth/LoginCard";
import SignupCard from "../Auth/SignupCard"; 

const Navbar = ({ language, toggleLanguage , user , setUser}) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Logout function
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <div className={`PageHead ${showNavbar ? "show" : "hide"}`}>
        <img src="/Logo.png" alt="El Bossely Bikes Logo" className="logo" />

        <nav className="navBar">
          <div>
            <a href="#home">{language === "en" ? "Home" : "الرئيسية"}</a>
            <a href="#featured">{language === "en" ? "Featured Bikes" : "الدراجات المميزة"}</a>
            <a href="#products">{language === "en" ? "Products" : "المنتجات"}</a>
            <a href="#order">{language === "en" ? "Order Bike" : "طلب دراجة"}</a>
            <a href="#reviews">{language === "en" ? "Reviews" : "المراجعات"}</a>
          </div>
        </nav>

        {/* Right Side Buttons */}
        <div className="flex flex-col mr-3 gap-4">
          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="nav-button">
            {language === "en" ? "English" : "العربية"}
          </button>

          {/* Auth Section */}
          {user ? (
            <div className="flex flex-col gap-2">
              <span className="text-white">
                {language === "en" ? `Hi, ${user.username}` : `مرحباً، ${user.username}`}
              </span>
              <button onClick={handleLogout} className="nav-button">
                {language === "en" ? "Logout" : "تسجيل الخروج"}
              </button>
            </div>
          ) : ( 
            <div className="flex flex-col gap-2">
              <button onClick={() => setShowLogin(true)} className="nav-button">
                {language === "en" ? "Login" : "تسجيل الدخول"}
              </button>
              <button onClick={() => setShowSignup(true)} className="nav-button">
                {language === "en" ? "Sign Up" : "إنشاء حساب"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showLogin && (
        <LoginCard 
          onClose={() => setShowLogin(false)} 
          onLogin={(userData) => {
            setUser(userData);
            setShowLogin(false);
          }} 
        />
      )}
      {showSignup && (
        <SignupCard 
          onClose={() => setShowSignup(false)} 
          onSignup={(userData) => {
            setUser(userData);
            setShowSignup(false);
          }} 
        />
      )}
    </>
  );
};

export default Navbar;
