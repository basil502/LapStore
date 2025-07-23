// LaptopDetailsModal.jsx
import React from 'react';
import '../styles/laptopModal.css';

function LaptopDetailsModal({ laptop, onClose }) {
  if (!laptop) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <h2 className="modal-title">{laptop.model_name}</h2>
        <p className="modal-brand">{laptop.company?.cmpny_name}</p>

        <div className="modal-details">
          <p><span>Code:</span> {laptop.lap_code}</p>
          <p><span>Processor:</span> {laptop.processor}</p>
          {laptop.graphicsCard && <p><span>Graphics:</span> {laptop.graphicsCard}</p>}
          {laptop.memory && <p><span>Memory:</span> {laptop.memory}</p>}
          {laptop.display && <p><span>Display:</span> {laptop.display}</p>}
          {laptop.colour && <p><span>Color:</span> {laptop.colour}</p>}
          <p className="modal-price">₹ {laptop.price}</p>
          <p className={`modal-status ${laptop.status ? 'available' : 'out-stock'}`}>
            {laptop.status ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LaptopDetailsModal;
