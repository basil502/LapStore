import React from 'react';
import { Edit3, Trash2 } from 'lucide-react'; // Replace with icons you like
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
        <p>Model No  : {lap_code}</p>
        <p>Processor: {processor}</p>
        <p className="price">₹{price}</p>
        {(status === false || status === 'false' || status === 'out of stock') && (
          <h4 className="stock">Out of Stock</h4>
        )}
      </div>
<div className="buttons" onClick={(e) => e.stopPropagation()}>
  <button type="button" onClick={onEdit} className="icon-button">
    <Edit3 size={20} strokeWidth={2} />
  </button>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onDelete(lap_id);
    }}
    className="icon-button"
  >
    <Trash2 size={20} strokeWidth={2} />
  </button>
</div>

    </div>
  );
}

export default LaptopCard;
