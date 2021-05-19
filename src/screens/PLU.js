import React, { useState } from 'react';

import Keyboard from 'react-simple-keyboard';

import '../styles/PLU.css';
const Pool = require('pg').Pool


const PLU = () => {
  
  const [pluItems, setPluItems] = useState([])
  const [specificPluItem, setSpecificPluItem] = useState(null)
  const [displayPLUItem, setDisplayPLUItem] = useState('none')
  
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });
  
  const getSpecificPLUItem = (pluIndex) => {
    const pluItem = pluItems[pluIndex]
    setSpecificPluItem(pluItem)
  }
  
  const renderSpecificPLUItem = () => {
    if (specificPluItem == null) {
      return null
    } else {
      return (
        <div className='edit-plu-item'>
          <ul className='edit-plu-item__list'>
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>PLU</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.plu }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Title</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.title }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Group</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.group }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Department</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.department }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>First Price</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.first_price }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Second Price</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.second_price }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>First Quantity</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.first_quantity }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Second Quantity</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.second_quantity }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Second Modifier</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.second_modifier }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Display On Bar</h3>
              <button className='edit-plu-item__list-button'><h2>{ renderTrueFalse(specificPluItem.display_bar) }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Display on Kitchen</h3>
              <button className='edit-plu-item__list-button'><h2>{ renderTrueFalse(specificPluItem.display_kitchen) }</h2></button>
            </li>
            
            { displayDrinkOrFoodInfo(specificPluItem.group) }
            
            
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Background Colour</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.background }</h2></button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Text Colour</h3>
              <button className='edit-plu-item__list-button'><h2>{ specificPluItem.text }</h2></button>
            </li>
          </ul>
        </div>
      )
    }
  }
  
  const renderTrueFalse = (booleanValue) => {
    if (booleanValue) {
      return 'YES'
    }
    return 'NO'
  }
  
  const displayDrinkOrFoodInfo = (group) => {
    let rendering = []
    if (group.toLowerCase() == 'drink') {
      rendering.push(
        <li className='edit-plu-item__list-item'>
          <h3>ABV</h3>
          <h3>{ specificPluItem.alcoholic_percentage }%</h3>
        </li>
      )
      rendering.push(<li className='edit-plu-item__list-item'>
          <h3>Brewery/Manufacturer</h3>
          <h3>{ specificPluItem.brewery }</h3>
        </li>
      )
      rendering.push(<li className='edit-plu-item__list-item'>
          <h3>Description</h3>
          <h3>{ specificPluItem.description }</h3>
        </li>
      )
    } else {
      rendering.push(
        <li className='edit-plu-item__list-item'>
          <h3>Allergens</h3>
          <h3>{ specificPluItem.allergens }</h3>
        </li>
      )
    }
    return rendering;
  }
  
  
  const getPLUItems = () => {
    fetch('http://localhost:6030/api/plus', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      let formattedPLU = []
      data.plu_items.forEach((item) => {
        for (var key in item) {
          item[key] = formatPLUItemNumbers(item, key)
        }
        formattedPLU.push(item)
      });
      setPluItems(formattedPLU)
    })
  }
  
  const formatPLUItemNumbers = (item, key) => {
    // if key name is these AND the value of the key doesn't have two decimal places
    if (key == 'first_price' && item[key].split('.')[1].length === 1) {
      return parseFloat(item[key]).toFixed(2)
    }
    if (key == 'second_price' && item[key].split('.')[1].length === 1) {
      return parseFloat(item[key]).toFixed(2)
    }
    if (key == 'first_quantity' && item[key].split('.')[1].length === 1) {
      return parseFloat(item[key]).toFixed(2)
    }
    if (key == 'second_quantity' && item[key].split('.')[1].length === 1) {
      return parseFloat(item[key]).toFixed(2)
    }
    // if you haven't returned yet, just return exactly the same value.
    return item[key]
  }

  
  const renderPLUItems = () => {
    let rendering = []
    
    pluItems.forEach((item, idx) => {
      rendering.push(
        <li id={`container ${idx}`}>
        <button style={{ width: '100%', display: 'flex', flexDirection: 'row' }} onClick={() => { getSpecificPLUItem(idx); setDisplayPLUItem('block') }}>
          <h2 className='item-plu'>{item.plu}</h2>
          <h2>{item.title}</h2>
        </button>
        </li>
      )
    });
    return rendering
  }
  
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div className='view-plu-item' style={{ display: displayPLUItem }}>
        <button className='close-view-plu-item' onClick={() => { setDisplayPLUItem('none'); setSpecificPluItem(null) }}>X</button>
        { renderSpecificPLUItem() }
      </div>
      
      <h1 style={{ textAlign: 'center' }}>PLU</h1>
      <button onClick={() => {getPLUItems()}}>Test</button>
      <ul className='plu-list'>
        { renderPLUItems() }
      </ul>
    </div>
  )
}

export default PLU;