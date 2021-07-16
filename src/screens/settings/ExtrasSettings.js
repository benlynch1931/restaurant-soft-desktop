import React, { useState, useContext, useEffect } from 'react';

import { AppContext } from '../../contexts/AppContext.js'

import '../../styles/ExtrasSettings.css'

const DOMAIN = '192.168.1.213'


const ExtrasSettings = () => {
  
  const { setSettingsScreen, setScreen } = useContext(AppContext);
  
  const [extras, setExtras] = useState([])
  const [specificDepartmentItem, setSpecificDepartmentItem] = useState(null)
  const [specificDepartmentIndex, setSpecificDepartmentIndex] = useState(null)
  const [displayDepartmentItem, setDisplayDepartmentItem] = useState('none')
  const [displayGroups, setDisplayGroups] = useState('none')
  const [coloursOptions, setColoursOptions] = useState([])
  const [displayBackgroundColorOptions, setDisplayBackgroundColorOptions] = useState('none')
  const [displayTextColorOptions, setDisplayTextColorOptions] = useState('none')
  const [groupsOptions, setGroupsOptions] = useState([])
  const [departmentUpdated, setDepartmentUpdated] = useState(false)
  
  useEffect(() => {
    fetchExtras()
  }, [])
  
  const fetchModifications = () => {
    fetch(`http://${DOMAIN}:6030/api/modifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })  
    .then(res => res.json())
    .then(data => {
      // setModifications(data.modifications)
    })
  }
  
  const fetchExtras = () => {
    fetch(`http://${DOMAIN}:6030/api/extras`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })  
    .then(res => res.json())
    .then(data => {
      setExtras(data.extras)
    })
  }
  
  const renderExtras = () => {
    let rendering = []
    
    extras.forEach((item, idx) => {
      rendering.push(
        <li id={`container ${idx}`}>
        <button style={{ width: '100%', display: 'flex', flexDirection: 'row' }} onClick={() => { /*getSpecificDepartment(idx); setDisplayDepartmentItem('block')*/ }}>
          <h2 className='item-extra'>{item.id}</h2>
          <h2>{item.modification_type}</h2>
        </button>
        </li>
      )
    });
    return rendering;
  }
  
  
  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
      <div className='view-modifications-item' style={{ display: 'none' }}>
        <button className='close-view-modifications-item' onClick={() => {  }}>X</button>
        { /*renderSpecificDepartmentItem()*/ }
      </div>
      
      <div className='modifications-navbar'>
        <h1 className='modifications-navbar-title'>Extras</h1>
        <button className='modifications-back-button' onClick={() => { setSettingsScreen('main') }}>
          <h1>Back</h1>
        </button>
      </div>
      <ul className='modifications-list'>
        { renderExtras() }
      </ul>

    </div>
  )
}

export default ExtrasSettings;