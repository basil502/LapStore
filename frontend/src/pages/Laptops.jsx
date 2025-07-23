import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import AddLaptops from '../components/AddLaptops';
import ViewLap from '../components/ViewLap';
import FilterLap from '../components/Filterlap';
import 'react-toastify/dist/ReactToastify.css'; 
import '../styles/laptops.css';

function Laptops() {
  const [laptops, setLaptops] = useState([]);
  const [editLaptop, setEditLaptop] = useState(null);
  const [originalLaptops, setOriginalLaptops] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLaptop, setSelectedLaptop] = useState(null);  // ✅ for modal

  useEffect(() => {
    axios.get('http://localhost:8086/getAll')
      .then(res => {
        setLaptops(res.data);
        setOriginalLaptops(res.data);
      })
      .catch(err => console.error("Failed to fetch laptops:", err));
  }, []);

  useEffect(() => {
    if (editLaptop) {
      setShowFilter(false);
    }
  }, [editLaptop]);

  const handleSort = (option) => {
    let sorted = [...originalLaptops];
    switch (option) {
      case 'priceLowHigh':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'available':
        sorted = sorted.filter(item => item.status === true || item.status === 'true');
        break;
      case 'unavailable':
        sorted = sorted.filter(item => item.status === false || item.status === 'false' || item.status === 'out of stock');
        break;
      default:
        break;
    }
    setLaptops(sorted);
  };

  const toggleFilter = () => {
    setShowFilter(prev => !prev);
  };

  return (
    <div className="laptops">
      <Header onSort={handleSort} onToggleFilter={toggleFilter} />

      <div className='addlap'>
        {showFilter ? (
          <FilterLap 
            setLaptops={setLaptops}
            setOriginalLaptops={setOriginalLaptops}
          />
        ) : (
          <AddLaptops
            laptops={laptops}
            setLaptops={setLaptops}
            editLaptop={editLaptop}
            setEditLaptop={setEditLaptop}
          />
        )}
      </div>

      <div className='viewlap'>
        <ViewLap
          laptops={laptops}
          setLaptops={setLaptops}
          setEditLaptop={setEditLaptop}
          selectedLaptop={selectedLaptop}
          setSelectedLaptop={setSelectedLaptop}
        />
      </div>
    </div>
  );
}

export default Laptops;
