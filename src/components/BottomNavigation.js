import React, { useContext, useState } from 'react';

import { AppContext } from '../contexts/AppContext.js'
import '../styles/BottomNavigation.css'

const BottomNavigation = () => {
  
  const { setNavigationWindow, navigationWindow, setScreen } = useContext(AppContext)
  const [displayBottomNavWindow] = useState('none')
  
  const renderButtonText = (buttonFunctionality) => {
    if (buttonFunctionality === 'tabs') {
      if (navigationWindow === null) {
        return 'View Tabs'
      }
      return 'Close Tab View'
    }
  }
  // renderButtonText('tabs')
  
  const setButtonFunctionality = (buttonText) => {
    // if the button is for 'tabs'
    if (buttonText === 'tabs') {
      // if the window is already showing 'tabs'
      if (navigationWindow === 'tabs') {
        setNavigationWindow(null)
        // if the window is hidden or showing any other window
      } else {
        setNavigationWindow('tabs')
      }
    } else if (buttonText === 'previous orders') {
      if (navigationWindow === 'previous orders') {
        setNavigationWindow(null)
      } else {
        setNavigationWindow('previous orders')
      }
    } else if (buttonText === 'reporting') {
      if (navigationWindow === 'reporting') {
        setNavigationWindow(null)
      } else {
        setNavigationWindow('reporting')
      } 
    } else if (buttonText === 'settings') {
      setScreen('settings')
    }
  }
  
  return (
    <div className="bottomNav-main">
      <div className='nav-list-div'>
        <div className='left-item'><button className='nav-list-button' onClick={() => { setButtonFunctionality('tabs') }}>{ navigationWindow === null ? "View Tabs" : "Close Tab View" }</button></div>
        <div><button className='nav-list-button'>View Previous Orders</button></div>
        <div><button className='nav-list-button'>View Reporting</button></div>
        <div className='right-item'><button className='nav-list-button' onClick={() => { setButtonFunctionality('settings') }}>Settings</button></div>
      </div>
    </div>
  )
}

export default BottomNavigation;