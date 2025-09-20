import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import Navbar from './Components/Users/NavPar';
import Hero from './Components/Users/Hero';
import FeaturedBikes from './Components/Users/FeaturedBikes';
import Products from './Components/Users/Products';
import OrderForm from './Components/Users/OrderForm';
import OwnerDashboard from './Components/Owner/OwnerDashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  return (
    <Router>
      <Routes>
        {/* Public site */}
        <Route
          path="/"
          element={
            <div>
              <Navbar
                language={language}
                toggleLanguage={() =>
                  setLanguage(language === 'en' ? 'ar' : 'en')
                }
              />
              <Hero language={language} />

              {/* Featured Bikes Section */}
              <FeaturedBikes setIsLoading={setIsLoading} language={language} />

              {/* Products Section */}
              <Products setIsLoading={setIsLoading} language={language} />

              <OrderForm language={language} />
            </div>
          }
        />

        {/* Owner Dashboard */}
        <Route path="/owner" element={<OwnerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
