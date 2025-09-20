import React from 'react';

const Hero = ({ language }) => {
  return (
    <section id="home">
      {/* Left side */}
      <div className="hero-text">
        <h1>{language === 'en' ? 'WELCOME IN THE KINGDOM!' : 'هلا بكم في المملكة'}</h1>
        <div>
          <a href="#products">{language === 'en' ? 'Explore Bikes' : 'استكشف الدراجات'}</a>
          <a href="#order">{language === 'en' ? 'Order Bike' : 'اطلب دراجة'}</a>
        </div>
      </div>

      {/* Right side */}
      <div className="bike-image-container">
        <img src="/blue-motorbike.png" alt="motorcycle" />
      </div>
    </section>
  );
};

export default Hero;
