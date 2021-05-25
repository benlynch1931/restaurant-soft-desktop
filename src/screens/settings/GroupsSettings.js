import React, { useState, useEffect } from 'react';

import Keyboard from 'react-simple-keyboard';

import '../../styles/GroupsSettings.css';
const Pool = require('pg').Pool


const GroupsSettings = () => {
  
  const [groups, setGroups] = useState([])
  const [specificGroupItem, setSpecificGroupItem] = useState(null)
  const [specificGroupIndex, setSpecificGroupIndex] = useState(null)
  const [displayGroupItem, setDisplayGroupItem] = useState('none')
  const [coloursOptions, setColoursOptions] = useState([])
  const [displayBackgroundColorOptions, setDisplayBackgroundColorOptions] = useState('none')
  const [displayTextColorOptions, setDisplayTextColorOptions] = useState('none')
  const [groupUpdated, setGroupUpdated] = useState(false)
  
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });
  
  const getSpecificGroup = (groupIndex) => {
    const group = groups[groupIndex]
    setSpecificGroupIndex(groupIndex)
    setSpecificGroupItem(group)
  }
  
  const groupValueChange = (key, event, index) => {
    delete specificGroupItem[key]
    setSpecificGroupItem({ ...specificGroupItem, [key]: event.target.value })
    
    // ------------------------------------------
    // When updating a specific value, i.e. the title, the title value would NOT appear in the object of the PLU item
    // The lines below fix that by adding it in and updating the state.
    // ------------------------------------------
    
    updateObjectInStateArray(key, event.target.value, index)
  }
  
  const groupBooleanChange = (key, value, index) => {
    console.log('value' + value)
    let newValue = !value
    delete specificGroupItem[key]
    setSpecificGroupItem({ ...specificGroupItem, [key]: newValue })
    
    updateObjectInStateArray(key, newValue, index)
  }
  
  
  const updateObjectInStateArray = (key, newValue, index) => {
    // get object that needs the value added to
    let groupToUpdate = groups[index]
    groupToUpdate = { ...groupToUpdate, [key]: newValue }
    // get whole PLU list
    let groupListToUpdate = groups
    // update specific object with new value
    groupListToUpdate[index] = groupToUpdate
    // update state with pluList including all values
    setGroups(groupListToUpdate)
  }
  
  const renderSpecificGroupItem = () => {
    if (specificGroupItem == null) {
      return null
    } else {
      return (
        <div className='edit-group-item'>
          <ul className='edit-group-item__list'>
            <li className='edit-group-item__list-item'>
              <h3 className='edit-group-item__list-label'>Index</h3>
              <button className='edit-group-item__list-button'><h2>{ specificGroupItem.index }</h2></button>
            </li>
            
            <li className='edit-group-item__list-item'>
              <h3 className='edit-group-item__list-label'>Group</h3>
              <input className='edit-group-item__list-input' onChange={(event) => { groupValueChange('group', event, specificGroupIndex) }} value={specificGroupItem.group}/>
            </li>
            
            <li className='edit-group-item__list-item'>
              <h3 className='edit-group-item__list-label'>Allow Report Printing</h3>
              <button className='edit-group-item__list-input-button' onClick={(event) => { groupBooleanChange('allow_report_printing', specificGroupItem.allow_report_printing, specificGroupIndex) }}>{ renderYesNo(specificGroupItem.allow_report_printing) }</button>
            </li>
            
            <li className='edit-group-item__list-item'>
              <h3 className='edit-group-item__list-label'>Background Colour</h3>
              <div className='edit-group-item__list-colour-div'>
              <button className='edit-group-item__list-colour-button' onClick={(event) => { setDisplayBackgroundColorOptions(displayBackgroundColorOptions == 'block' ? 'none' : 'block') }} style={{ backgroundColor: specificGroupItem.background }}></button>
                <div className='edit-group-item__list-colour-dropdown' style={{ display: displayBackgroundColorOptions }}>
                  <table>
                    <tbody>
                      { renderColourOptions('background') }
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
            
            <li className='edit-group-item__list-item'>
              <h3 className='edit-group-item__list-label'>Text Colour</h3>
              <div className='edit-group-item__list-colour-div'>
              <button className='edit-group-item__list-colour-button' onClick={(event) => { setDisplayTextColorOptions(displayTextColorOptions == 'block' ? 'none' : 'block') }} style={{ backgroundColor: specificGroupItem.text }}></button>
                <div className='edit-group-item__list-colour-dropdown' style={{ display: displayTextColorOptions }}>
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
  
  const fetchColours = () => {
    fetch('http://192.168.1.213:6030/api/colours', {
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
    if (colour !== specificGroupItem[key]) {
      setGroupUpdated(true)
      delete specificGroupItem[key]
      setSpecificGroupItem({ ...specificGroupItem, [key]: colour })
      
      updateObjectInStateArray(key, colour, specificGroupIndex)
    }
  }
  
  const isCurrentColour = (optionColour, key) => {
    if (optionColour === specificGroupItem[key]) {
      return '2px solid #FF0000'
    }
    return '2px solid rgb(118, 118, 118)'
  }
  
  const renderYesNo = (booleanValue) => {
    if (booleanValue) {
      return 'YES'
    }
    return 'NO'
  }
  
  const getGroups = () => {
    fetch('http://192.168.1.213:6030/api/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      setGroups(data.groups)
    })
  }
  
  const renderGroups = () => {
    let rendering = []
    
    groups.forEach((item, idx) => {
      rendering.push(
        <li id={`container ${idx}`}>
        <button style={{ width: '100%', display: 'flex', flexDirection: 'row' }} onClick={() => { getSpecificGroup(idx); setDisplayGroupItem('block') }}>
          <h2 className='item-group'>{item.index}</h2>
          <h2>{item.group}</h2>
        </button>
        </li>
      )
    });
    return rendering
  }
  
  const closeSpecificGroupWindow = () => {
    const groupID = specificGroupItem.plu
    renderTrueFalse()
    const groupToSend = prepareGroupForPut()
    
    
    fetch(`http://192.168.1.213:6030/api/groups/${groupID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: groupToSend
    })
    setDisplayGroupItem('none');
    setSpecificGroupItem(null);
    setSpecificGroupIndex(null);
  }
  
  const prepareGroupForPut = () => {
    return JSON.stringify(specificGroupItem)
  }
  
  const renderTrueFalse = () => {
    if (specificGroupItem.allow_report_printing == 'YES') {
      specificGroupItem.allow_report_printing = true
    } else {
      specificGroupItem.allow_report_printing = false
    }
  }
  
  useEffect(() => {
    getGroups()
  }, [])
  
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div className='view-group-item' style={{ display: displayGroupItem }}>
        <button className='close-view-group-item' onClick={() => { closeSpecificGroupWindow() }}>X</button>
        { renderSpecificGroupItem() }
      </div>
      
      <h1 style={{ textAlign: 'center' }}>Groups</h1>
      <ul className='group-list'>
        { renderGroups() }
      </ul>
    </div>
  )
}

export default GroupsSettings;