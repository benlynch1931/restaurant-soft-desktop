import React, { useState, useEffect, useContext } from 'react';

import Keyboard from 'react-simple-keyboard';

import { AppContext } from '../../contexts/AppContext.js'

import '../../styles/DepartmentsSettings.css';
const Pool = require('pg').Pool


const DepartmentsSettings = () => {
  
  const { setSettingsScreen, setScreen } = useContext(AppContext);
  
  const [departments, setDepartments] = useState([])
  const [specificDepartmentItem, setSpecificDepartmentItem] = useState(null)
  const [specificDepartmentIndex, setSpecificDepartmentIndex] = useState(null)
  const [displayDepartmentItem, setDisplayDepartmentItem] = useState('none')
  const [displayGroups, setDisplayGroups] = useState('none')
  const [coloursOptions, setColoursOptions] = useState([])
  const [displayBackgroundColorOptions, setDisplayBackgroundColorOptions] = useState('none')
  const [displayTextColorOptions, setDisplayTextColorOptions] = useState('none')
  const [groupsOptions, setGroupsOptions] = useState([])
  const [departmentUpdated, setDepartmentUpdated] = useState(false)
  
  
  const getSpecificDepartment = (departmentIndex) => {
    const department = departments[departmentIndex]
    setSpecificDepartmentIndex(departmentIndex)
    setSpecificDepartmentItem(department)
    fetchColours()
    fetchGroups()
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
    if (colour !== specificDepartmentItem[key]) {
      setDepartmentUpdated(true)
      delete specificDepartmentItem[key]
      setSpecificDepartmentItem({ ...specificDepartmentItem, [key]: colour })
      
      updateObjectInStateArray(key, colour, specificDepartmentIndex)
    }
  }
  
  const isCurrentColour = (optionColour, key) => {
    if (optionColour === specificDepartmentItem[key]) {
      return '2px solid #FF0000'
    }
    return '2px solid rgb(118, 118, 118)'
  }
  
  const departmentValueChange = (key, event, index) => {
    delete specificDepartmentItem[key]
    setSpecificDepartmentItem({ ...specificDepartmentItem, [key]: event.target.value })
    setDepartmentUpdated(true)
    // ------------------------------------------
    // When updating a specific value, i.e. the title, the title value would NOT appear in the object of the PLU item
    // The lines below fix that by adding it in and updating the state.
    // ------------------------------------------
    
    updateObjectInStateArray(key, event.target.value, index)
  }
  
  const departmentBooleanChange = (key, value, index) => {
    setDepartmentUpdated(true)
    let newValue = !value
    delete specificDepartmentItem[key]
    setSpecificDepartmentItem({ ...specificDepartmentItem, [key]: newValue })
    
    updateObjectInStateArray(key, newValue, index)
  }
  
  const updateObjectInStateArray = (key, newValue, index) => {
    // get object that needs the value added to
    let departmentToUpdate = departments[index]
    departmentToUpdate = { ...departmentToUpdate, [key]: newValue }
    // get whole PLU list
    let departmentListToUpdate = departments
    // update specific object with new value
    departmentListToUpdate[index] = departmentToUpdate
    // update state with pluList including all values
    setDepartments(departmentListToUpdate)
  }
  
  const renderSpecificDepartmentItem = () => {
    if (specificDepartmentItem == null) {
      return null
    } else {
      return (
        <div className='edit-department-item'>
          <ul className='edit-department-item__list'>
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Index</h3>
              <button className='edit-department-item__list-button'><h2>{ specificDepartmentItem.index }</h2></button>
            </li>
            
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Department</h3>
              <input className='edit-department-item__list-input' onChange={(event) => { departmentValueChange('name', event, specificDepartmentIndex) }} value={specificDepartmentItem.name}/>
            </li>
            
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Group</h3>
              <div className='edit-department-item__list-group-div'>
              <button className='edit-department-item__list-group-button' onClick={(event) => { setDisplayGroups(displayGroups == 'block' ? 'none' : 'block') }}>{ specificDepartmentItem.group.name }</button>
                <div className='edit-department-item__list-group-dropdown' style={{ display: displayGroups }}>
                  <ul style={{ width: '90%', marginLeft: 0, padding: 0 }}>
                    { renderGroupsList() }
                  </ul>
                </div>
              </div>
            </li>
            
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Allow Report Printing</h3>
              <button className='edit-department-item__list-input-button' onClick={(event) => { departmentBooleanChange('allow_report_printing', specificDepartmentItem.allow_report_printing, specificDepartmentIndex) }}>{ renderYesNo(specificDepartmentItem.allow_report_printing) }</button>
            </li>
            
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Background Colour</h3>
              <div className='edit-department-item__list-colour-div'>
              <button className='edit-department-item__list-colour-button' onClick={(event) => { setDisplayBackgroundColorOptions(displayBackgroundColorOptions == 'block' ? 'none' : 'block') }} style={{ backgroundColor: specificDepartmentItem.background }}></button>
                <div className='edit-department-item__list-colour-dropdown' style={{ display: displayBackgroundColorOptions }}>
                  <table>
                    <tbody>
                      { renderColourOptions('background') }
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
            
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Text Colour</h3>
              <div className='edit-department-item__list-colour-div'>
              <button className='edit-department-item__list-colour-button' onClick={(event) => { setDisplayTextColorOptions(displayTextColorOptions == 'block' ? 'none' : 'block') }} style={{ backgroundColor: specificDepartmentItem.text }}></button>
                <div className='edit-department-item__list-colour-dropdown' style={{ display: displayTextColorOptions }}>
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
  
  const renderGroupsList = () => {
    let rendering = []
    console.log(groupsOptions)
    
    groupsOptions.forEach((group, idx) => {
      rendering.push(
        <li>
          <button onClick={() => { setDisplayGroups('none'); handleNewGroup(group.name, group.index) }}>{ group.group }</button>
        </li>
      )
    });
  
    return rendering;
  }
  
  const handleNewGroup = (groupName, groupID) => {
    if (groupID !== specificDepartmentItem.group.index) {
      // setPluItemUpdated(true)
      delete specificDepartmentItem['group']
      setSpecificDepartmentItem({ ...specificDepartmentItem, group: { id: groupID, name: groupName } })
      
      updateObjectInStateArray('group', { id: groupID, name: groupName }, specificDepartmentIndex)
    }
  }
  
  const fetchGroups = () => {
    fetch('http://192.168.1.213:6030/api/groups', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      setGroupsOptions(data.groups)
    })
  }
  
  const renderYesNo = (booleanValue) => {
    if (booleanValue) {
      return 'YES'
    }
    return 'NO'
  }
  
  const getDepartments = () => {
    fetch('http://192.168.1.213:6030/api/departments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      setDepartments(data.departments)
    })
  }
  
  const renderDepartments = () => {
    let rendering = []
    
    departments.forEach((item, idx) => {
      rendering.push(
        <li id={`container ${idx}`}>
        <button style={{ width: '100%', display: 'flex', flexDirection: 'row' }} onClick={() => { getSpecificDepartment(idx); setDisplayDepartmentItem('block') }}>
          <h2 className='item-department'>{item.index}</h2>
          <h2>{item.name}</h2>
        </button>
        </li>
      )
    });
    return rendering
  }
  
  const closeSpecificDepartmentWindow = () => {
    const departmentID = specificDepartmentItem.index
    renderTrueFalse()
    const departmentToSend = prepareDepartmentForPut()
    
    if (departmentUpdated === true) {
      fetch(`http://192.168.1.213:6030/api/departments/${departmentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: departmentToSend
      })
      setDepartmentUpdated(false)
    }
    
    setDisplayDepartmentItem('none');
    setSpecificDepartmentItem(null);
    setSpecificDepartmentIndex(null);
  }
  
  const prepareDepartmentForPut = () => {
    return JSON.stringify(specificDepartmentItem)
  }
  
  const renderTrueFalse = () => {
    if (specificDepartmentItem.allow_report_printing == 'YES') {
      specificDepartmentItem.allow_report_printing = true
    } else {
      specificDepartmentItem.allow_report_printing = false
    }
  }
  
  useEffect(() => {
    getDepartments()
  }, [])
  
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div className='view-department-item' style={{ display: displayDepartmentItem }}>
        <button className='close-view-department-item' onClick={() => { closeSpecificDepartmentWindow() }}>X</button>
        { renderSpecificDepartmentItem() }
      </div>
      
      <h1 style={{ textAlign: 'center' }}>Departments</h1>
      <ul className='department-list'>
        { renderDepartments() }
      </ul>
      <div className="settings-menu-rows">
        <button className="settings-menu-buttons" onClick={() => { setSettingsScreen('main') }}><h2>BACK</h2></button>
      </div>
    </div>
  )
}

export default DepartmentsSettings;