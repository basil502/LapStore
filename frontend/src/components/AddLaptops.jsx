import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/addlaptops.css'



function AddLaptops({  setLaptops, editLaptop, setEditLaptop }) {
  const [companies, setCompanies] = useState([]);
  const [lapCodeStatus, setLapCodeStatus] = useState('');
  const debounceTimeout = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8086/companies')
      .then(response => setCompanies(response.data))
      .catch(error => console.error("Error fetching companies:", error));
  }, []);

  const checkLapCodeExists = async (code) => {
    try {
      const response = await axios.get('http://localhost:8086/checkLapcode', {
        params: { code },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  };

  const validateLapCodeLive = (value) => {
    const trimmed = value.trim();
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    const isValidFormat = /^[A-Za-z0-9]+$/.test(trimmed);
    if (!trimmed || !isValidFormat) {
      setLapCodeStatus('invalid');
      return;
    }

    setLapCodeStatus('checking');

    debounceTimeout.current = setTimeout(async () => {
      const exists = await checkLapCodeExists(trimmed);
      setLapCodeStatus(exists ? 'exists' : 'available');
    }, 500);
  };

  const formik = useFormik({
  enableReinitialize: true,
  initialValues: {
    model_name: editLaptop?.model_name || '',
    c_id: editLaptop?.company?.cmpny_id?.toString() || '',
    lapCode: editLaptop?.lap_code || '',
    processor: editLaptop?.processor || '',
    price: editLaptop?.price || '',
    status: editLaptop?.status?.toString() || '',
    graphicsCard: editLaptop?.graphicsCard || '',
    nostock: editLaptop?.nostock || '',
    memory: editLaptop?.memory || '',
    colour: editLaptop?.colour || '',
    display: editLaptop?.display || '',
  },

    validationSchema: Yup.object({
      model_name: Yup.string()
        .required('Model name is required')
        .matches(/^[A-Za-z0-9 ]+$/, 'Model Name should contain only letters, numbers, and spaces'),
        
      c_id: Yup.string().required('Company is required'),

lapCode: Yup.string()
  .required('Laptop code is required')
  .matches(/^[A-Za-z0-9]+$/, 'Laptop code should be alphanumeric without spaces')
  .min(3, 'Laptop code must be at least 3 characters long'),

      processor: Yup.string()
        .required('Processor detail is required')
        .matches(/^[A-Za-z0-9 .-]+$/, 'Processor can contain only letters, numbers, spaces, dashes, or dots'),
         
      price: Yup.number()
        .typeError('Price must be a number')
        .min(10000, 'Price must be at least ₹10,000')
        .max(1000000, 'Price must not exceed ₹10,00,000')
        .required('Price is required'),

      status: Yup.string()
        .oneOf(['true', 'false'], 'Status must be true or false')
        .required('Status is required'),

      graphicsCard: Yup.string()
        .min(3, 'Graphics card details too short')
        .required('Graphics card is required'),

      nostock: Yup.number()
        .typeError('Stock must be a number')
        .integer('Stock must be an integer')
        .min(1, 'Stock cannot be negative or Zero')
        .max(100, 'Stock quantity cannot exceed 100 units')
        .when('status', {
          is: 'true',
          then: schema => schema.required('Stock is required when status is available'),
          otherwise: schema => schema.notRequired(),
        }),

      memory: Yup.string().required('Memory is required'),
      colour: Yup.string().required('Colour is required'),
      display: Yup.string().required('Display is required'),
    }),

onSubmit: async (values, { resetForm }) => {
  try {
    const payload = {
      model_name: values.model_name,
      lap_code: values.lapCode,
      processor: values.processor,
      price: Number(values.price),
      status: values.status,
      graphicsCard: values.graphicsCard,
      nostock: Number(values.nostock),
      memory: values.memory,
      colour: values.colour,
      display: values.display,
      company: {
        cmpny_id: Number(values.c_id),
      },
    };

    if (editLaptop) {
      // Update mode
      await axios.post(`http://localhost:8086/update/${editLaptop.lap_id}`, payload);
      toast.success('Laptop updated successfully!');
      setEditLaptop(null);
    } else {
      // Add mode
      await axios.post('http://localhost:8086/add', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      toast.success('Laptop added successfully!');
    }

    const updated = await axios.get('http://localhost:8086/getAll');
    setLaptops(updated.data);
    resetForm();
    setLapCodeStatus('');
  } catch (error) {
    console.error("Error saving laptop:", error.response?.data || error.message);
    toast.error('Failed to save laptop. Please try again.');
  }
},

  });

  return (
    <div className="addlaptops">
    <h2>{editLaptop ? 'Update Laptop' : 'Add New Laptop'}</h2>
      <form onSubmit={formik.handleSubmit}>
        {/* Model Name */}
        <div className="form-group">
          <input
            type="text"
            name="model_name"
            placeholder="Model Name"
            value={formik.values.model_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.model_name && formik.errors.model_name && (
            <div className="error">{formik.errors.model_name}</div>
          )}
        </div>

        {/* Company */}
        <div className="form-group">
          <select
            name="c_id"
            value={formik.values.c_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Company</option>
            {companies.map(company => (
              <option key={company.cmpny_id} value={company.cmpny_id}>
                {company.cmpny_name}
              </option>
            ))}
          </select>
          {formik.touched.c_id && formik.errors.c_id && (
            <div className="error">{formik.errors.c_id}</div>
          )}
        </div>

        {/* Laptop Code */}
        <div className="form-group">
          <input
            type="text"
            name="lapCode"
            placeholder="Laptop Code"
            value={formik.values.lapCode}
            onChange={(e) => {
              formik.handleChange(e);
              validateLapCodeLive(e.target.value);
            }}
            onBlur={formik.handleBlur}
          />
          {formik.touched.lapCode && formik.errors.lapCode && (
            <div className="error">{formik.errors.lapCode}</div>
          )}

          {/* Live Validation */}
{formik.values.lapCode && (
  <>
    {lapCodeStatus === 'invalid' && (
      <div className="error">Laptop code should be alphanumeric without spaces</div>
    )}
    {lapCodeStatus === 'checking' && !formik.errors.lapCode && lapCodeStatus !== 'invalid' && (
      <div className="info">Checking laptop code availability...</div>
    )}
    {lapCodeStatus === 'available' && !formik.errors.lapCode && lapCodeStatus !== 'invalid' && (
      <div className="success">Laptop code is available.</div>
    )}
    {lapCodeStatus === 'exists' && !formik.errors.lapCode && lapCodeStatus !== 'invalid' && (
      <div className="error">Laptop code already exists.</div>
    )}
  </>
)}
        </div>

{/* Processor */}
<div className="form-group">
  <input
    type="text"
    name="processor"
    placeholder="Processor"
    list="processorOptions"
    value={formik.values.processor}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  <datalist id="processorOptions">
    <option value="Intel Core i3" />
    <option value="Intel Core i5" />
    <option value="Intel Core i7" />
    <option value="Intel Core i9" />
    <option value="AMD Ryzen 3" />
    <option value="AMD Ryzen 5" />
    <option value="AMD Ryzen 7" />
    <option value="Apple M1" />
    <option value="Apple M2" />
  </datalist>
  {formik.touched.processor && formik.errors.processor && (
    <div className="error">{formik.errors.processor}</div>
  )}
</div>


        {/* Price */}
        <div className="form-group">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="error">{formik.errors.price}</div>
          )}
        </div>

{/* Graphics Card */}
<div className="form-group">
  <input
    type="text"
    name="graphicsCard"
    placeholder="Graphics Card"
    list="graphicsCardOptions"
    value={formik.values.graphicsCard}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  <datalist id="graphicsCardOptions">
    <option value="Intel UHD Graphics" />
    <option value="Intel Iris Xe" />
    <option value="NVIDIA GeForce GTX 1650" />
    <option value="NVIDIA GeForce RTX 3050" />
    <option value="NVIDIA GeForce RTX 3060" />
    <option value="AMD Radeon RX 6500M" />
    <option value="AMD Radeon Vega 8" />
  </datalist>
  {formik.touched.graphicsCard && formik.errors.graphicsCard && (
    <div className="error">{formik.errors.graphicsCard}</div>
  )}
</div>


{/* Memory */}
<div className="form-group">
  <input
    type="text"
    name="memory"
    placeholder="Memory"
    list="memoryOptions"
    value={formik.values.memory}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  <datalist id="memoryOptions">
    <option value="4GB" />
    <option value="8GB" />
    <option value="12GB" />
    <option value="16GB" />
    <option value="32GB" />
    <option value="64GB" />
  </datalist>
  {formik.touched.memory && formik.errors.memory && (
    <div className="error">{formik.errors.memory}</div>
  )}
</div>

        {/* Colour */}
        <div className="form-group">
          <input
            type="text"
            name="colour"
            placeholder="Colour"
            value={formik.values.colour}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.colour && formik.errors.colour && (
            <div className="error">{formik.errors.colour}</div>
          )}
        </div>

{/* Display */}
<div className="form-group">
  <input
    type="text"
    name="display"
    placeholder="Display"
    list="displayOptions"
    value={formik.values.display}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
  />
  <datalist id="displayOptions">
    <option value="13.3 inch" />
    <option value="14 inch" />
    <option value="15.6 inch" />
    <option value="16 inch" />
    <option value="17.3 inch" />
  </datalist>
  {formik.touched.display && formik.errors.display && (
    <div className="error">{formik.errors.display}</div>
  )}
</div>



        {/* Status */}
        <div className="form-group">
          <select
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="">Select Status</option>
            <option value="true">Available</option>
            <option value="false">Out of Stock</option>
          </select>
          {formik.touched.status && formik.errors.status && (
            <div className="error">{formik.errors.status}</div>
          )}
        </div>

{/* Stock - conditional */}
{formik.values.status === 'true' && (
  <div className="form-group nostock-group">
    {editLaptop ? (
      <div className="increment-decrement">
        <button
          type="button"
          onClick={() => {
            const current = Number(formik.values.nostock) || 0;
            if (current > 0) {
              formik.setFieldValue('nostock', current - 1);
            }
          }}
          aria-label="Decrease stock"
        >
          -
        </button>
        <input
          type="number"
          name="nostock"
          value={formik.values.nostock}
          onChange={(e) => {
            let val = e.target.value;
            // Allow empty input for typing, else clamp between 0 and 100
            if (val === '') {
              formik.setFieldValue('nostock', '');
            } else {
              val = Math.max(0, Math.min(100, Number(val)));
              formik.setFieldValue('nostock', val);
            }
          }}
          onBlur={formik.handleBlur}
          style={{ width: '60px', textAlign: 'center' }}
          min={0}
          max={100}
        />
        <button
          type="button"
          onClick={() => {
            const current = Number(formik.values.nostock) || 0;
            if (current < 100) {
              formik.setFieldValue('nostock', current + 1);
            }
          }}
          aria-label="Increase stock"
        >
          +
        </button>
      </div>
    ) : (
      <input
        type="number"
        name="nostock"
        placeholder="No of Stock"
        value={formik.values.nostock}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        min={0}
        max={100}
      />
    )}
    {formik.touched.nostock && formik.errors.nostock && (
      <div className="error">{formik.errors.nostock}</div>
    )}
  </div>
)}



        {/* Submit */}
<div className='submitbutton'>
  <button
    type="submit"
    className='add-button'
    disabled={lapCodeStatus === 'exists' || lapCodeStatus === 'invalid'}
  >
    {editLaptop ? 'Update Laptop' : 'Add'}
  </button>

  {editLaptop && (
    <button
      type="button"
      className="close-button"
      onClick={() => window.location.reload()}
    >
      ✖ Close
    </button>
  )}
</div>

      </form>
    </div>
  );
}

export default AddLaptops;
