import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_URL from '../../config';

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
              <button onClick={() => handlePrev(bike._id, bike.pictures.length)}>&lt;</button>
              <img
                src={`${API_URL}/${bike.pictures[imageIndexes[bike._id]]}`} // ✅ prepend backend URL
                alt={bike.name}
                className="bike-image"
              />
              <button onClick={() => handleNext(bike._id, bike.pictures.length)}>&gt;</button>
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
