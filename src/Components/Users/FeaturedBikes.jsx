import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';
import "@fortawesome/fontawesome-free/css/all.min.css";


const FeaturedBikes = ({ setIsLoading, language }) => {
  const [selectedFeaturedBikes, setSelectedFeaturedBikes] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    setIsLoading(true);
    axios.get(`${API_URL}/api/bikes/featured`)
      .then(res => {
        setSelectedFeaturedBikes(res.data);
        const indexes = {};
        res.data.forEach(bike => {
          indexes[bike._id] = 0; // ✅ use _id
        });
        setImageIndexes(indexes);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleNext = (id, picturesLength) => {
    setImageIndexes(prev => ({
      ...prev,
      [id]: (prev[id] + 1) % picturesLength,
    }));
  };

  const handlePrev = (id, picturesLength) => {
    setImageIndexes(prev => ({
      ...prev,
      [id]: (prev[id] - 1 + picturesLength) % picturesLength,
    }));
  };

  return (
    <section id="featured">
      <h2>{language === 'en' ? 'Featured Bikes' : 'الدراجات المميزة'}</h2>
      <div className="featured-grid">
        {selectedFeaturedBikes.slice(0, 3).map((bike) => (
          <div key={bike._id} className="featured-card">
            <div className="slider-container">
              <button className="nav-btn prev" onClick={() => handlePrev(bike._id, bike.pictures.length)}>
                <i className="fas fa-chevron-left"></i>
              </button>             
              <img
                src={`${API_URL}/${bike.pictures[imageIndexes[bike._id]]}`} // ✅ prepend backend URL
                alt={bike.name}
                className="bike-image"
              />
              <button className="nav-btn next" onClick={() => handleNext(bike._id, bike.pictures.length)}>
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            <div className="bike-details">
              <h3>{bike.name}</h3>
              <p>{bike.specs}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBikes;
