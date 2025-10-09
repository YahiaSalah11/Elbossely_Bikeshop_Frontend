import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_URL from '../../config';   

const BikeManager = ({ language }) => {
  const [availableBikes, setAvailableBikes] = useState([]);
  const [sliderIndexes, setSliderIndexes] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    year: "",
    newOrUsed: "new",
    specs: "",
    bikeType: "chinese",
    pictures: [],
    isFeatured: false,
  });

  const pasteDropAreaRef = useRef(null);

  // ✅ Fetch all bikes on load
  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/bikes/search`, {});
      setAvailableBikes(res.data);
    } catch (err) {
      console.error("Error fetching bikes", err);
    }
  };

  // ✅ Handle pasted images
  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      let newImages = [];
      for (let item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          newImages.push(file);
        }
      }
      if (newImages.length > 0) {
        setFormData((prev) => ({
          ...prev,
          pictures: [...prev.pictures, ...newImages],
        }));
      }
    };

    const area = pasteDropAreaRef.current;
    area.addEventListener("paste", handlePaste);

    return () => area.removeEventListener("paste", handlePaste);
  }, []);

  // ✅ Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        pictures: [...prev.pictures, ...files],
      }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ✅ Add new bike
  const handleAddBike = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "pictures") {
          for (let pic of formData.pictures) data.append("pictures", pic);
        } else {
          data.append(key, formData[key]);
        }
      });

      await axios.post(`${API_URL}/api/bikes/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchBikes(); // refresh list
      setFormData({
        name: "",
        manufacturer: "",
        model: "",
        year: "",
        newOrUsed: "new",
        specs: "",
        bikeType: "chinese",
        pictures: [],
        isFeatured: false,
      });
    } catch (err) {
      console.error("Error adding bike", err);
    }
  };

  // ✅ Delete bike
  const handleDeleteBike = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bike?")) return;
    try {
      await axios.delete(`${API_URL}/api/bikes/deletebike/${id}`);
      fetchBikes();
    } catch (err) {
      console.error("Error deleting bike", err);
    }
  };

  // ✅ Delete all bikes
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete ALL bikes?")) return;
    try {
      await axios.delete(`${API_URL}/api/bikes/deleteallbikes`);
      setAvailableBikes([]);
    } catch (err) {
      console.error("Error deleting all bikes", err);
    }
  };

  // ✅ Slider controls
  const nextImage = (bikeId, pictures) => {
    setSliderIndexes((prev) => ({
      ...prev,
      [bikeId]: (prev[bikeId] + 1 || 0) % pictures.length,
    }));
  };

  const prevImage = (bikeId, pictures) => {
    setSliderIndexes((prev) => ({
      ...prev,
      [bikeId]: (prev[bikeId] - 1 + pictures.length) % pictures.length,
    }));
  };

  return (
    <div className="bike-manager">
      <h2>{language === "en" ? "🚲 Bike Manager" : "🚲 إدارة الدراجات"}</h2>

      {/* ✅ Add Bike Form */}
      <form onSubmit={handleAddBike} className="add-bike-form">
        <h3>{language === "en" ? "Add New Bike" : "إضافة دراجة جديدة"}</h3>
        <input
          type="text"
          placeholder={language === "en" ? "Name" : "اسم الدراجة"}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder={language === "en" ? "Manufacturer" : "الشركة المصنعة"}
          value={formData.manufacturer}
          onChange={(e) =>
            setFormData({ ...formData, manufacturer: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder={language === "en" ? "Model" : "طراز الدراجة"}
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder={language === "en" ? "Year" : "سنة الصنع"}
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          required
        />

        <select
          value={formData.newOrUsed}
          onChange={(e) =>
            setFormData({ ...formData, newOrUsed: e.target.value })
          }
        >
          
          <option value="new">{language === "en" ? "New" : "جديد"}</option>
          <option value="used">{language === "en" ? "Used" : "مستعمل"}</option>
        </select>

        <select
          value={formData.bikeType}
          onChange={(e) =>
            setFormData({ ...formData, bikeType: e.target.value })
          }
        >
          <option value="chinese">
            {language === "en" ? "Chinese" : "صيني"}
          </option>
          <option value="indian">
            {language === "en" ? "Indian" : "هندي"}
          </option>
          <option value="electric">
            {language === "en" ? "Electric" : "كهربائي"}
          </option>
          <option value="japanese">
            {language === "en" ? "Japanese" : "ياباني"}
          </option>
        </select>

        <select
          value={formData.isFeatured}
          onChange={(e) =>
            setFormData({ ...formData, isFeatured: e.target.value === "true" })
          }
        >
          <option value="false">{language === "en" ? "Regular" : "عادي"}</option>
          <option value="true">{language === "en" ? "Featured" : "مميز"}</option>
        </select>

        <textarea
          placeholder={language === "en" ? "Specs" : "المواصفات"}
          value={formData.specs}
          onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
        />



        {/* ✅ File Upload + Paste/Drop Area */}
        <div
          ref={pasteDropAreaRef}
          className="upload-area"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          tabIndex={0}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFormData({
                ...formData,
                pictures: [...formData.pictures, ...Array.from(e.target.files)],
              })
            }
          />
          <p>
            📌 {language === "en"
              ? "Choose files, paste (Ctrl+V), or drag & drop images here"
              : "اختر الملفات، الصق (Ctrl+V)، أو اسحب الصور هنا"}
          </p>
          <div className="preview-images">
            {formData.pictures.map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt={`preview-${idx}`}
              />
            ))}
          </div>
        </div>

        <button type="submit">{language === "en" ? "Add Bike" : "إضافة"}</button>
      </form>

      {/* ✅ Delete All */}
      <button onClick={handleDeleteAll} className="delete-all-btn">
        {language === "en" ? "Delete All Bikes" : "حذف جميع الدراجات"}
      </button>

      {/* ✅ Bike List */}
      <div className="bike-list">
        <h3>{language === "en" ? "All Bikes" : "جميع الدراجات"}</h3>
        {availableBikes.length === 0 ? (
          <p>
            {language === "en" ? "No bikes available" : "لا توجد دراجات متاحة"}
          </p>
        ) : (
          availableBikes.map((bike) => (
            <div key={bike._id} className="bike-item">
              <h4>
                {bike.name} ({bike.year})
              </h4>
              <p>
                {bike.manufacturer} - {bike.model} ({bike.newOrUsed})
              </p>

              {bike.pictures && bike.pictures.length > 0 ? (
                <div className="bike-slider">
                  <button onClick={() => prevImage(bike._id, bike.pictures)}>
                    ◀
                  </button>
                  <img
                    src={`${API_URL}/${
                      bike.pictures[sliderIndexes[bike._id] || 0]
                    }`}
                    alt={`${bike.name}-img`}
                  />
                  <button onClick={() => nextImage(bike._id, bike.pictures)}>
                    ▶
                  </button>
                </div>
              ) : (
                <p>
                  {language === "en"
                    ? "No pictures uploaded"
                    : "لا توجد صور مرفوعة"}
                </p>
              )}

              <button onClick={() => handleDeleteBike(bike._id)}>
                {language === "en" ? "Delete" : "حذف"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BikeManager;
