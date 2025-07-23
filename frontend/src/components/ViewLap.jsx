import React, { useState } from 'react';
import axios from 'axios';
import LaptopCard from './LaptopCard';
import LaptopDetailsModal from './LaptopDetailsModal';
import '../styles/viewLap.css';

function ViewLap({ laptops, setLaptops, setEditLaptop }) {
const [selectedLaptop, setSelectedLaptop] = useState(null);
  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this laptop?');
    if (!confirm) return;


    try { 
      await axios.delete(`http://localhost:8086/delete/${id}`);
      const updated = await axios.get('http://localhost:8086/getAll');

      if (Array.isArray(updated.data) && updated.data.length > 0) {
        setLaptops(updated.data);
      } else {
        setLaptops([]); 
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="laptop-cards-container">
      {laptops.length === 0 ? (
        <p className="no-data-message">No Data Found</p>
      ) : (
        laptops.map((laptop) => (
          <LaptopCard
            key={laptop.lap_id}
            laptop={laptop}
            onDelete={handleDelete}
            onEdit={() => setEditLaptop(laptop)}
            onClick={() => setSelectedLaptop(laptop)}
          />
        ))
      )}

      {/* Show modal if a laptop is selected */}
      {selectedLaptop && (
        <LaptopDetailsModal
          laptop={selectedLaptop}
          onClose={() => setSelectedLaptop(null)}
        />
      )}
    </div>
  );
}


export default ViewLap;
