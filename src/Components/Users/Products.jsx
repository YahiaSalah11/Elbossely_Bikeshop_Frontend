import React, { useEffect, useState } from "react";
import axios from "axios";

function Products({ setIsLoading, language }) {
  const bikeTypes = [
    { value: "chinese", label: { en: "Chinese", ar: "صيني" } },
    { value: "indian", label: { en: "Indian", ar: "هندي" } },
    { value: "electric", label: { en: "Electric", ar: "كهربائي" } },
    { value: "japanese", label: { en: "Japanese", ar: "ياباني" } },
  ];
  const [selectedType, setSelectedType] = useState("chinese");
  const [bikes, setBikes] = useState([]);
  const [imageIndexes, setImageIndexes] = useState({});

  useEffect(() => {
    setIsLoading(true);

    axios.post(`${API_URL}/api/bikes/bikesbytype`, {
      bikeType: selectedType,
    })
      .then((res) => {
        setBikes(res.data);

        // Reset image index for each bike
        const indexes = {};
        res.data.forEach((bike) => {
          indexes[bike._id] = 0;
        });
        setImageIndexes(indexes);

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bikes:", err);
        setIsLoading(false);
      });
  }, [selectedType, setIsLoading]);

  // Handle switching images
  const handleNextImage = (bikeId, totalImages) => {
    setImageIndexes((prev) => ({
      ...prev,
      [bikeId]: (prev[bikeId] + 1) % totalImages,
    }));
  };

  const handlePrevImage = (bikeId, totalImages) => {
    setImageIndexes((prev) => ({
      ...prev,
      [bikeId]: (prev[bikeId] - 1 + totalImages) % totalImages,
    }));
  };

  return (
    <section id="products" className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {language === "en" ? "Bikes" : "الدراجات"}
      </h2>

      {/* Bike Type Buttons */}
      <div className="flex gap-4 mb-6">
        {bikeTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`px-4 py-2 rounded ${
              selectedType === type.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {type.label[language]}
          </button>
        ))}
      </div>

      {/* Bikes List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bikes.length > 0 ? (
          bikes.map((bike) => (
            <div
              key={bike._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              {/* Image Slider */}
              {bike.pictures && bike.pictures.length > 0 && (
                <div className="relative">
                  <img
                    src={`${API_URL}/${bike.pictures[imageIndexes[bike._id]]}`}
                    alt={bike.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <button
                    onClick={() =>
                      handlePrevImage(bike._id, bike.pictures.length)
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() =>
                      handleNextImage(bike._id, bike.pictures.length)
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
                  >
                    {">"}
                  </button>
                </div>
              )}

              <h3 className="text-lg font-semibold mt-4">{bike.name}</h3>
              <p className="text-gray-600">{bike.manufacturer}</p>
              <p className="text-gray-600">{bike.model}</p>
              <p className="text-gray-600">{bike.year}</p>
            </div>
          ))
        ) : (
          <p>{language === "en" ? "No bikes available." : "لا توجد دراجات."}</p>
        )}
      </div>
    </section>
  );
}

export default Products;
