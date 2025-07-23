import React from 'react';
import iconEdit from '../assets/iconEdit.svg';
import iconDelete from '../assets/iconDelete.gif';
import '../styles/laptopCard.css';

function LaptopCard({ laptop, onDelete, onEdit, onClick }) {
  const {
    model_name,
    processor,
    lap_code,
    price,
    status,
    company,
    lap_id,
  } = laptop;

  return (
    <div className="laptop-card" onClick={onClick}>  {/* ✅ Added onClick here */}
      <div>
        <h3>{model_name}</h3>
        {company?.cmpny_name && <p className="company">{company.cmpny_name}</p>}
        <p>LapCode  : {lap_code}</p>
        <p>Processor: {processor}</p>
        <p className="price">₹{price}</p>
        {(status === false || status === 'false' || status === 'out of stock') && (
          <h4 className="stock">Out of Stock</h4>
        )}
      </div>
      <div className="buttons" onClick={(e) => e.stopPropagation()}> {/* ✅ Prevent click bubbling */}
        <button type="button" onClick={onEdit} className="icon-button">
          <img src={iconEdit} alt="Edit" className="icon" />
        </button>
        <button type="button" onClick={(e) => {
          e.stopPropagation(); // ✅ Prevent card click when delete is clicked
          onDelete(lap_id);
        }} className="icon-button">
          <img src={iconDelete} alt="Delete" className="icon" />
        </button>
      </div>
    </div>
  );
}

export default LaptopCard;
