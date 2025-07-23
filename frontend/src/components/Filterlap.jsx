import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactSlider from 'react-slider';  // react-slider import

import '../styles/filterLap.css';

function FilterLap({ setLaptops , setOriginalLaptops }) {
  const [companies, setCompanies] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    axios.get('http://localhost:8086/companies')
      .then(response => setCompanies(response.data))
      .catch(error => console.error("Error fetching companies:", error));
  }, []);

  const formik = useFormik({
    initialValues: {
      model_name: '',
      c_id: '',
      lapCode: '',
      processor: '',
      graphicsCard: '',
      memory: '',
      status: '',
    },
    onSubmit: async (values) => {
      try {
        const params = {
          model_name: values.model_name || undefined,
          c_id: values.c_id || undefined,
          lapCode: values.lapCode || undefined,
          processor: values.processor || undefined,
          memory: values.memory || undefined,
          graphicsCard: values.graphicsCard || undefined,
          status: values.status !== '' ? values.status : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        };

        const response = await axios.get('http://localhost:8086/search', { params });

        if (typeof response.data === 'string') {
          toast.info(response.data);
          setLaptops([]);
          setOriginalLaptops([]);
        } else {
          setLaptops(response.data);
          setOriginalLaptops(response.data);
          toast.success("Filtered results loaded!");
        }
      } catch (error) {
        console.error("Filter request failed:", error);
        toast.error("Failed to fetch filtered laptops.");
      }
    }
  });

  return (
    <div className="filter">
      <h2>Filter</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Model Name */}
        <div className="form-group">
          <input
            type="text"
            name="model_name"
            placeholder="Model Name"
            value={formik.values.model_name}
            onChange={formik.handleChange}
          />
        </div>

        {/* Company */}
        <div className="form-group">
          <select
            name="c_id"
            value={formik.values.c_id}
            onChange={formik.handleChange}
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.cmpny_id} value={company.cmpny_id}>
                {company.cmpny_name}
              </option>
            ))}
          </select>
        </div>

        {/* Lap Code */}
        <div className="form-group">
          <input
            type="text"
            name="lapCode"
            placeholder="Laptop Code"
            value={formik.values.lapCode}
            onChange={formik.handleChange}
          />
        </div>

        {/* Processor */}
        <div className="form-group">
          <input
            type="text"
            name="processor"
            placeholder="Processor"
            value={formik.values.processor}
            onChange={formik.handleChange}
          />
        </div>

        {/* Price Range */}
        <div className="form-group price-slider">
          <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            min={0}
            max={1000000}
            step={10000}
            value={priceRange}
            onChange={setPriceRange}
            pearling
            minDistance={1000}
          />
        </div>

        {/* Graphics Card */}
        <div className="form-group">
          <input
            type="text"
            name="graphicsCard"
            placeholder="Graphics Card"
            value={formik.values.graphicsCard}
            onChange={formik.handleChange}
          />
        </div>

        {/* Memory */}
        <div className="form-group">
          <input
            type="text"
            name="memory"
            placeholder="Memory"
            value={formik.values.memory}
            onChange={formik.handleChange}
          />
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" className="filter-button">Filter</button>
          <button
            type="button"
            className="closebutton"
            onClick={() => window.location.reload()}
          >
            ✖ Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default FilterLap;
