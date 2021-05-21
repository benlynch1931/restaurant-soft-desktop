import React, { useState } from 'react';

import Keyboard from 'react-simple-keyboard';

import '../../styles/DepartmentsSettings.css';
const Pool = require('pg').Pool


const DepartmentsSettings = () => {
  
  const [departments, setDepartments] = useState([])
  const [specificDepartmentItem, setSpecificDepartmentItem] = useState(null)
  const [specificDepartmentIndex, setSpecificDepartmentIndex] = useState(null)
  const [displayDepartmentItem, setDisplayDepartmentItem] = useState('none')
  
  const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
  });
  
  const getSpecificDepartment = (departmentIndex) => {
    const department = departments[departmentIndex]
    setSpecificDepartmentIndex(departmentIndex)
    setSpecificDepartmentItem(department)
  }
  
  const departmentValueChange = (key, event, index) => {
    delete specificDepartmentItem[key]
    setSpecificDepartmentItem({ ...specificDepartmentItem, [key]: event.target.value })
    
    // ------------------------------------------
    // When updating a specific value, i.e. the title, the title value would NOT appear in the object of the PLU item
    // The lines below fix that by adding it in and updating the state.
    // ------------------------------------------
    
    updateObjectInStateArray(key, event.target.value, index)
  }
  
  const departmentBooleanChange = (key, value, index) => {
    console.log('value' + value)
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
              <input className='edit-department-item__list-input' onChange={(event) => { departmentValueChange('department', event, specificDepartmentIndex) }} value={specificDepartmentItem.department}/>
            </li>
            
            <li className='edit-department-item__list-item'>
              <h3 className='edit-department-item__list-label'>Allow Report Printing</h3>
              <button className='edit-department-item__list-input-button' onClick={(event) => { departmentBooleanChange('allow_report_printing', specificDepartmentItem.allow_report_printing, specificDepartmentIndex) }}>{ renderYesNo(specificDepartmentItem.allow_report_printing) }</button>
            </li>
          </ul>

        </div>
      )
    }
  }
  
  const renderYesNo = (booleanValue) => {
    if (booleanValue) {
      return 'YES'
    }
    return 'NO'
  }
  
  const getDepartments = () => {
    fetch('http://localhost:6030/api/departments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(data => {
      setDepartments(data.departments)
      console.log(data.departments)
    })
  }
  
  const renderDepartments = () => {
    let rendering = []
    
    departments.forEach((item, idx) => {
      rendering.push(
        <li id={`container ${idx}`}>
        <button style={{ width: '100%', display: 'flex', flexDirection: 'row' }} onClick={() => { getSpecificDepartment(idx); setDisplayDepartmentItem('block') }}>
          <h2 className='item-department'>{item.index}</h2>
          <h2>{item.department}</h2>
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
    
    fetch(`http://localhost:6030/api/department/${departmentID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: departmentToSend
    })
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
  
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div className='view-department-item' style={{ display: displayDepartmentItem }}>
        <button className='close-view-department-item' onClick={() => { closeSpecificDepartmentWindow() }}>X</button>
        { renderSpecificDepartmentItem() }
      </div>
      
      <h1 style={{ textAlign: 'center' }}>Departments</h1>
      <button onClick={() => {getDepartments()}}>Test</button>
      <ul className='department-list'>
        { renderDepartments() }
      </ul>
    </div>
  )
}

export default DepartmentsSettings;