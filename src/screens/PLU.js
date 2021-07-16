import React, { useState, useEffect, useContext } from 'react';

import Keyboard from 'react-simple-keyboard';

import '../styles/PLU.css';
import { AppContext } from '../contexts/AppContext.js'

const Pool = require('pg').Pool

const DOMAIN = "192.168.1.213"

const PLU = () => {
  
  const { setScreen } = useContext(AppContext);
  
  const [pluItems, setPluItems] = useState([])
  const [specificPluItem, setSpecificPluItem] = useState(null)
  const [pluItemUpdated, setPluItemUpdated] = useState(false)
  const [specificPluIndex, setSpecificPluIndex] = useState(null)
  const [displayPLUItem, setDisplayPLUItem] = useState('none')
  const [displayBackgroundColorOptions, setDisplayBackgroundColorOptions] = useState('none')
  const [displayTextColorOptions, setDisplayTextColorOptions] = useState('none')
  const [displayDepartments, setDisplayDepartments] = useState('none')
  const [coloursOptions, setColoursOptions] = useState([])
  const [departmentsOptions, setDepartmentsOptions] = useState([])
  
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });
  
  const getSpecificPLUItem = (pluIndex) => {
    const pluItem = pluItems[pluIndex]
    setSpecificPluIndex(pluIndex)
    setSpecificPluItem(pluItem)
    fetchColours()
    fetchDepartments()
  }
  
  const pluItemValueChange = (key, event, index) => {
    delete specificPluItem[key]
    setSpecificPluItem({ ...specificPluItem, [key]: event.target.value })
    
    // ------------------------------------------
    // When updating a specific value, i.e. the title, the title value would NOT appear in the object of the PLU item
    // The lines below fix that by adding it in and updating the state.
    // ------------------------------------------
    
    updateObjectInStateArray(key, event.target.value, index)
  }
  
  const pluItemBooleanChange = (key, value, index) => {
    let newValue = !value
    delete specificPluItem[key]
    setSpecificPluItem({ ...specificPluItem, [key]: newValue })
    
    // get object that needs the value added to
    updateObjectInStateArray(key, newValue, index)
  }
  
  const updateObjectInStateArray = (key, newValue, index) => {
    setPluItemUpdated(true)
    // get object that needs the value added to
    let pluItemToUpdate = pluItems[index]
    pluItemToUpdate = { ...pluItemToUpdate, [key]: newValue }
    // get whole PLU list
    let pluListToUpdate = pluItems
    // update specific object with new value
    pluListToUpdate[index] = pluItemToUpdate
    // update state with pluList including all values
    setPluItems(pluListToUpdate)
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
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('title', event, specificPluIndex) }} value={specificPluItem.title}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Group</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('group', event, specificPluIndex) }} value={specificPluItem.group}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Department</h3>
              <div className='edit-plu-item__list-department-div'>
              <button className='edit-plu-item__list-department-button' onClick={(event) => { setDisplayDepartments(displayDepartments == 'block' ? 'none' : 'block') }}>{ specificPluItem.department.name }</button>
                <div className='edit-plu-item__list-department-dropdown' style={{ display: displayDepartments }}>
                  <ul style={{ width: '90%', marginLeft: '5%' }}>
                    { renderDepartmentsList() }
                  </ul>
                </div>
              </div>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>First Price</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('first_price', event, specificPluIndex) }} value={specificPluItem.first_price}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Second Price</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('second_price', event, specificPluIndex) }} value={specificPluItem.second_price}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>First Quantity</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('first_quantity', event, specificPluIndex) }} value={specificPluItem.first_quantity}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Second Quantity</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('second_quantity', event, specificPluIndex) }} value={specificPluItem.second_quantity}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Second Modifier</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('second_modifier', event, specificPluIndex) }} value={specificPluItem.second_modifier}/>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Display On Bar</h3>
              <button className='edit-plu-item__list-input-button' onClick={(event) => { pluItemBooleanChange('display_bar', specificPluItem.display_bar, specificPluIndex) }}>{ renderYesNo(specificPluItem.display_bar) }</button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Display on Kitchen</h3>
              <button className='edit-plu-item__list-input-button' onClick={(event) => { pluItemBooleanChange('display_kitchen', specificPluItem.display_kitchen, specificPluIndex) }}>{ renderYesNo(specificPluItem.display_kitchen) }</button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Stock Controlled?</h3>
              <button className='edit-plu-item__list-input-button' onClick={(event) => { pluItemBooleanChange('stock_controlled', specificPluItem.stock_controlled, specificPluIndex) }}>{ renderYesNo(specificPluItem.stock_controlled) }</button>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Stock Count</h3>
              <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('stock_count', event, specificPluIndex) }} value={specificPluItem.stock_count}/>
            </li>
            
            { displayDrinkAndFoodInfo() }
            
            
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Background Colour</h3>
              <div className='edit-plu-item__list-colour-div'>
              <button className='edit-plu-item__list-colour-button' onClick={(event) => { setDisplayBackgroundColorOptions(displayBackgroundColorOptions == 'block' ? 'none' : 'block') }} style={{ backgroundColor: specificPluItem.background }}></button>
                <div className='edit-plu-item__list-colour-dropdown' style={{ display: displayBackgroundColorOptions }}>
                  <table>
                    <tbody>
                      { renderColourOptions('background') }
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
            
            <li className='edit-plu-item__list-item'>
              <h3 className='edit-plu-item__list-label'>Text Colour</h3>
              <div className='edit-plu-item__list-colour-div'>
              <button className='edit-plu-item__list-colour-button' onClick={(event) => { setDisplayTextColorOptions(displayTextColorOptions == 'block' ? 'none' : 'block') }} style={{ backgroundColor: specificPluItem.text }}></button>
                <div className='edit-plu-item__list-colour-dropdown' style={{ display: displayTextColorOptions }}>
                  <table>
                    <tbody>
                      { renderColourOptions('text') }
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )
    }
  }
  
  const renderDepartmentsList = () => {
    let rendering = []
    
    departmentsOptions.forEach((department, idx) => {
      rendering.push(
        <li>
          <button onClick={() => { setDisplayDepartments('none'); handleNewDepartment(department.name, department.index) }}>{ department.name }</button>
        </li>
      )
    });
  
    return rendering;
  }
  
  const handleNewDepartment = (departmentName, departmentID) => {
    if (departmentID !== specificPluItem.department.index) {
      setPluItemUpdated(true)
      delete specificPluItem['department']
      setSpecificPluItem({ ...specificPluItem, department: { id: departmentID, name: departmentName } })
      
      updateObjectInStateArray('department', { id: departmentID, name: departmentName }, specificPluIndex)
    }
  }
  
  const renderColourOptions = (colourPropertyKey) => {
    let rendering = []
    let colourOptionRoot = Math.ceil(Math.sqrt(coloursOptions.length))
    for (let row=0; row<colourOptionRoot; row++) {
      let rowRender = renderColoursTableColumns(row, colourOptionRoot, colourPropertyKey)
      rendering.push(<tr>{rowRender}</tr>)
    }
    return rendering
  }
  
  const renderColoursTableColumns = (row, colourOptionRoot, colourPropertyKey) => {
    let columnRendering = [];
    for (let col=0; col<colourOptionRoot; col++) {
      let backgroundColor = coloursOptions[(row*colourOptionRoot)+col].colour
      let borderColor = isCurrentColour(coloursOptions[(row*colourOptionRoot)+col].colour, colourPropertyKey)
      if ((row * colourOptionRoot) + col <= coloursOptions.length) {
        columnRendering.push(<td className='colour-option-cell' style={{ width: `${100 / colourOptionRoot}%`, height: 219/colourOptionRoot, border: borderColor }}><button className='colour-option-button' onClick={() => { setDisplayBackgroundColorOptions('none'); handleNewColour(backgroundColor, colourPropertyKey) }} style={{ backgroundColor: backgroundColor, border: borderColor }}></button></td>)
      } else {
        columnRendering.push(<td className='colour-option-cell' style={{ width: `${100 / colourOptionRoot}%`, height: 219/colourOptionRoot }}></td>)
      }
    }
    return columnRendering;
  }
  
  const handleNewColour = (colour, key) => {
    if (colour !== specificPluItem[key]) {
      setPluItemUpdated(true)
      delete specificPluItem[key]
      setSpecificPluItem({ ...specificPluItem, [key]: colour })
      
      updateObjectInStateArray(key, colour, specificPluIndex)
    }
  }
  
  const isCurrentColour = (optionColour, key) => {
    if (optionColour === specificPluItem[key]) {
      return '2px solid #FF0000'
    }
    return '2px solid rgb(118, 118, 118)'
  }
  
  const fetchColours = () => {
    fetch(`http://${DOMAIN}:6030/api/colours`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      setColoursOptions(data.colours)
    })
  }
  
  const fetchDepartments = () => {
    fetch(`http://${DOMAIN}:6030/api/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      setDepartmentsOptions(data.departments)
    })
  }
  
  const renderYesNo = (booleanValue) => {
    return booleanValue ? "YES" : "NO"
  }
  
  const displayDrinkAndFoodInfo = () => {
    let rendering = []
      rendering.push(
        <li className='edit-plu-item__list-item'>
          <h3>ABV</h3>
          <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('alcoholic_percentage', event, specificPluIndex) }} value={specificPluItem.alcoholic_percentage}/>
        </li>
      )
      rendering.push(
        <li className='edit-plu-item__list-item'>
          <h3>Brewery/Manufacturer</h3>
          <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('brewery', event, specificPluIndex) }} value={specificPluItem.brewery}/>
        </li>
      )
      rendering.push(
        <li className='edit-plu-item__list-item'>
          <h3>Description</h3>
          <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('description', event, specificPluIndex) }} value={specificPluItem.description}/>
        </li>
      )
      rendering.push(
        <li className='edit-plu-item__list-item'>
          <h3>Allergens</h3>
          <input className='edit-plu-item__list-input' onChange={(event) => { pluItemValueChange('allergens', event, specificPluIndex) }} value={specificPluItem.allergens}/>
        </li>
      )
    return rendering;
  }
  
  
  const getPLUItems = () => {
    fetch(`http://${DOMAIN}:6030/api/plus?terminal=true`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      let formattedPLU = []
      data.plu_items.forEach((item) => {
        // Make all decimal numbers have 2 places
        const formattedItem = formatPLUItem(item)
        formattedPLU.push(formattedItem)
      });
      setPluItems(formattedPLU)
    })
  }
  
  const formatPLUItem = (item) => {
    item.first_price = parseFloat(item.first_price).toFixed(2)
    item.second_price = parseFloat(item.second_price).toFixed(2)
    item.first_quantity = parseFloat(item.first_quantity).toFixed(2)
    item.second_quantity = parseFloat(item.second_quantity).toFixed(2)
    return item
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
  
  const closeSpecificPluWindow = () => {
    const pluID = specificPluItem.plu
    renderTrueFalse()
    const pluToSend = preparePluForPut()
    
    if (pluItemUpdated === true) {
      fetch(`http://192.168.1.213:6030/api/plus/${pluID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: pluToSend
      })
      setPluItemUpdated(false)
    }
    
    setDisplayPLUItem('none');
    setSpecificPluItem(null);
    setSpecificPluIndex(null);
  }
  
  const preparePluForPut = () => {
    return JSON.stringify(specificPluItem)
  }
  
  const renderTrueFalse = () => {
    if (specificPluItem.display_bar == 'YES') {
      specificPluItem.display_bar = true
    } else {
      specificPluItem.display_bar = false
    }
    if (specificPluItem.display_kitchen == 'YES') {
      specificPluItem.display_kitchen = true
    } else {
      specificPluItem.display_kitchen = false
    }
  }
  
  useEffect(() => {
    getPLUItems()
  }, [])
  
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div className='view-plu-item' style={{ display: displayPLUItem }}>
        <button className='close-view-plu-item' onClick={() => { closeSpecificPluWindow() }}>X</button>
        { renderSpecificPLUItem() }
      </div>
      
      <div className='plu-navbar'>
        <h1 className='plu-navbar-title'>PLU</h1>
        <button className='plu-back-button' onClick={() => { console.log("Working"); setScreen('main') }}>
          <h1>Back</h1>
        </button>
      </div>
      <ul className='plu-list'>
        { renderPLUItems() }
      </ul>
    </div>
  )
}

export default PLU;