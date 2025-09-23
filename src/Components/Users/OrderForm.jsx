import React, { useEffect, useState } from 'react';
import API_URL from '../../config'; 


const OrderForm = ({

  language,
  user,
}) => {

  const [newOrUsed, setNewOrUsed] = useState(''); // New or Used Bikes
  
  const [availableBikeManufacturers, setAvailableBikeManufacturers] = useState(["asdfkjdfkj","asldkfjkdjf"]);
  const [bikeManufacturer, setBikeManufacturer] = useState('');
  
  const [availableBikeModels, setAvailableBikeModels] = useState([]);
  const [bikeModel, setBikeModel] = useState('');

  const [availableBikeYears, setAvailableBikeYears] = useState([]);
  const [yearOfManufacture, setYearOfManufacture] = useState('');

  const [searchedBikes, setSearchedBikes] = useState([]);

  // this state is not used now but it can be used later to store the selected bike
  // and using it to display a pop up message with the bike details
  // after supmitting the order
  // so I will keep it here for now
  const [selectedBike, setSelectedBike] = useState(null);

  const [sliderIndexes, setSliderIndexes] = useState({});


  const [clientName, setClientName] = useState(user ? (user.username) : '');
  const [clientPhone, setClientPhone] = useState(user ? (user.phonenumber) : '');

  const [choosenBikeId, setChoosenBikeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [orderSubmitted, setOrderSubmitted] = useState("");







  // ✅ Universal Fetch Function
  const fetchData = async (type, params) => {
    const endpointMap = {
      manufacturer: `${API_URL}/api/bikes/manufacturers`,
      model: `${API_URL}/api/bikes/models`, 
      year: `${API_URL}/api/bikes/years`,
      search: `${API_URL}/api/bikes/search`,
    };

    try {
      const response = await fetch(endpointMap[type], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) throw new Error('Network error');

      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  };

  // ✅ Auto-fetch manufacturers when `newOrUsed` changes
  useEffect(() => {
    if (newOrUsed) {
      fetchData('manufacturer', { newOrUsed }).then(res => {
        setAvailableBikeManufacturers(res);
      });
      setBikeManufacturer('');
      setBikeModel('');
      setYearOfManufacture('');
      setAvailableBikeModels([]);
      setAvailableBikeYears([]);
    }
  }, [newOrUsed]);

  // ✅ Auto-fetch models when `bikeManufacturer` changes
  useEffect(() => {
    if (newOrUsed && bikeManufacturer) {
      
      fetchData('model', { newOrUsed, bikeManufacturer }).then(setAvailableBikeModels);
      setBikeModel('');
      setYearOfManufacture('');
      setAvailableBikeYears([]);
    }
  }, [bikeManufacturer]);

  // ✅ Auto-fetch years when `bikeModel` changes
  useEffect(() => {
    if (newOrUsed && bikeManufacturer && bikeModel) {
      fetchData('year', { newOrUsed, bikeManufacturer, bikeModel }).then(setAvailableBikeYears);
      setYearOfManufacture('');
    }
  }, [bikeModel]);


// Auto-fill client info if user is logged in
  useEffect(() => {
    if (user) {
      setClientName(user.username);
      setClientPhone(user.phonenumber);
    } else {
      setClientName('');
      setClientPhone('');
    }
  }, [user]);

  // ✅ Search Bikes Handler
  const handleSearch = async () => {

    

    const results = await fetchData('search', {
      newOrUsed: newOrUsed || 'all',
      manufacturer: bikeManufacturer || 'all',
      model: bikeModel || 'all',
      year: yearOfManufacture || 'all',
    });

    setSearchedBikes(results);
  };



  const handleNext = (bikeId, picturesLength) => {
    setSliderIndexes(prev => ({
      ...prev,
      [bikeId]: ((prev[bikeId] || 0) + 1) % picturesLength
    }));
  };

  const handlePrev = (bikeId, picturesLength) => {
    setSliderIndexes(prev => ({
      ...prev,
      [bikeId]: (prev[bikeId] - 1 + picturesLength) % picturesLength
    }));
  };



// When selecting a bike
const handleSelectBike = (bike) => {
  setChoosenBikeId(bike._id);
  setSelectedBike(bike);
  setIsModalOpen(true);
};


// ✅ Submit Order Handler
const handleSubmitOrder = async (e) => {
  e.preventDefault();

  if (!choosenBikeId || !clientName || !clientPhone) {
    alert(language === 'en' ? 'Please fill in all fields.' : 'يرجى ملء جميع الحقول.');
    return;
  }

  const userId = null; // Assuming no user authentication for now
  const contactInfo = {
    name: clientName,
    phone: clientPhone,
    email: null // Optional, can be added later
  };

  const orderDetails = {
    choosenBikeId,
    userId,
    contactInfo
  };

  // ✅ Ask for confirmation before sending
  const confirmMessage =
    language === "en"
      ? `Are you sure you want to submit an order for this bike?\n\nSpecs:\n${selectedBike?.name} (${selectedBike?.year})\n${selectedBike?.manufacturer} - ${selectedBike?.model}\n${selectedBike?.specs || "No specs available"}`
      : `هل أنت متأكد أنك تريد إرسال طلب لهذه الدراجة؟\n\nالمواصفات:\n${selectedBike?.name} (${selectedBike?.year})\n${selectedBike?.manufacturer} - ${selectedBike?.model}\n${selectedBike?.specs || "لا توجد مواصفات"}`;

  const confirmed = window.confirm(confirmMessage);
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      throw new Error("Failed to submit order");
    }

    const data = await response.json();
    setOrderSubmitted(true);
    alert(language === "en" ? "Order submitted successfully!" : "تم إرسال الطلب بنجاح!");
  } catch (error) {
    console.error("Error submitting order:", error);
    alert(language === "en" ? "Failed to submit order." : "فشل في إرسال الطلب.");
  }
};








  return (

    <section id="order">

      <h2>{language === 'en' ? 'Order a Bike' : 'اطلب دراجة'}</h2>

      <form onSubmit={handleSubmitOrder} className="order-form">
        {/* New or Used */}
        <label>
          {language === 'en' ? 'Condition:' : 'الحالة:'}
          <select value={newOrUsed} onChange={(e) => setNewOrUsed(e.target.value)}>
            <option value="">{language === 'en' ? 'Select Condition' : 'اختر الحالة'}</option>
            <option value="new">{language === 'en' ? 'New' : 'جديدة'}</option>
            <option value="used">{language === 'en' ? 'Used' : 'مستعملة'}</option>
          </select>
        </label>

        {/* Manufacturer */}
        <label>
          {language === 'en' ? 'Manufacturer:' : 'المُصنع:'}
          <select value={bikeManufacturer} onChange={(e) => setBikeManufacturer(e.target.value)}>
            <option value="">{language === 'en' ? 'Select Manufacturer' : 'اختر المُصنع'}</option>
            {availableBikeManufacturers.map((man, idx) => (
              <option key={idx} value={man}>{man}</option>
            ))}
          </select>
        </label>

        {/* Model */}
        <label>
          {language === 'en' ? 'Model:' : 'الموديل:'}
          <select value={bikeModel} onChange={(e) => setBikeModel(e.target.value)}>
            <option value="">{language === 'en' ? 'Select Model' : 'اختر الموديل'}</option>
            {availableBikeModels.map((model, idx) => (
              <option key={idx} value={model}>{model}</option>
            ))}
          </select>
        </label>

        {/* Year */}
        <label>
          {language === 'en' ? 'Year of Manufacture:' : 'سنة الصنع:'}
          <select value={yearOfManufacture} onChange={(e) => setYearOfManufacture(e.target.value)}>
            <option value="">{language === 'en' ? 'Select Year' : 'اختر السنة'}</option>
            {availableBikeYears.map((year, idx) => (
              <option key={idx} value={year}>{year}</option>
            ))}
          </select>
        </label>

        {/* Search Button */}
        <button type="button" className="search-button" onClick={handleSearch}>
          {language === 'en' ? 'Search Bikes' : 'ابحث عن الدراجات'}
        </button> 
        



        {/* Display Searched Bikes */}
          <div className="searched-bikes-grid">
            {searchedBikes.map((bike) => {
              const pictures = bike.pictures || [];
              const currentIndex = sliderIndexes[bike._id] || 0;

              return (
                <div key={bike._id} 
                    className={`bike-card ${choosenBikeId === bike._id ? 'selected' : ''}`}
                    onClick={() => handleSelectBike(bike)}> 
                                    

                  <div className="slider-wrapper">
                    <button className="slider-btn left" onClick={(e) => { 
                      e.stopPropagation(); 
                      handlePrev(bike._id, pictures.length); 
                    }}>‹</button>

                    <img
                      src={`${API_URL}/${pictures[currentIndex]}`}
                      alt={`${bike.name} - ${currentIndex + 1}`}
                      className="bike-image"
                    />

                    <button className="slider-btn right" onClick={(e) => { 
                      e.stopPropagation(); 
                      handleNext(bike._id, pictures.length); 
                    }}>›</button>
                  </div>

                  <div className="bike-info">
                    <h4>{bike.name}</h4>
                    <p>{language === 'en' ? `Manufacturer: ${bike.manufacturer}` : `المصنع: ${bike.manufacturer}`}</p>
                    <p>{language === 'en' ? `Model: ${bike.model}` : `الموديل: ${bike.model}`}</p>
                    <p>{language === 'en' ? `Year: ${bike.year}` : `السنة: ${bike.year}`}</p>
                    <p>{language === 'en' ? ` ${bike.specs}` : ` ${bike.specs}`}</p>
                  </div>
                </div>
              );
            })}
          </div>




        {/* Display Selected Bike for Order */}
        {isModalOpen && choosenBikeId && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div
              className="modal-card"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <span
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </span>

              <h3>{language === 'en' ? 'Selected Bike:' : 'الدراجة المختارة:'}</h3>

              {(() => {
                const selectedBike = searchedBikes.find(bike => bike._id === choosenBikeId);
                if (!selectedBike) return null;

                return (
                  <>


                    <button
                        type="button"   // ✅ prevent form submission
                        className="slider-btn left"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev(
                            choosenBikeId,
                            selectedBike.pictures?.length || 0
                          );
                        }}
                      >
                        ‹
                      </button>

                      <img
                        src={`${API_URL}/${selectedBike.pictures?.[sliderIndexes[choosenBikeId] || 0]}`}
                        alt={`${selectedBike.name} - ${(sliderIndexes[choosenBikeId] || 0) + 1}`}
                        className="bike-image"
                      />

                      <button
                        type="button"   // ✅ prevent form submission
                        className="slider-btn right"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext(
                            choosenBikeId,
                            selectedBike.pictures?.length || 0
                          );
                        }}
                      >
                        ›
                      </button>
                    {/* slider code here */}
                    <div className="bike-info">
                      <h4>{selectedBike.name}</h4>
                      <p>{language === 'en' ? `Manufacturer: ${selectedBike.manufacturer}` : `المصنع: ${selectedBike.manufacturer}`}</p>
                      <p>{language === 'en' ? `Model: ${selectedBike.model}` : `الموديل: ${selectedBike.model}`}</p>
                      <p>{language === 'en' ? `Year: ${selectedBike.year}` : `السنة: ${selectedBike.year}`}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}


        {/* Client Info */}
        <label>
          {language === 'en' ? 'Your Name:' : 'اسمك:'}
          <input type="text" placeholder={clientName} value={clientName} onChange={(e) => setClientName(e.target.value)} required />
        </label>

        <label>
          {language === 'en' ? 'Phone Number:' : 'رقم الهاتف:'}
          <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required />
        </label>

        <button type="submit" className="search-button" style={{ marginTop: '1rem' }}>
          {language === 'en' ? 'Submit Order' : 'إرسال الطلب'}
        </button>

      </form>
    </section>
  );
};

export default OrderForm;
