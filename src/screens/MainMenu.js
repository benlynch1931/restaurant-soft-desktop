import React, { useContext } from 'react';

import { AppContext } from '../contexts/AppContext.js'
import '../styles/MainMenu.css'

const MainMenu = () => {
  
  const { setScreen } = useContext(AppContext);
  
  return (
    <div>
      <div className="menu-rows">
        <button className="menu-buttons" onClick={() => { setScreen('bar') }}><h2>Bar</h2></button>
        <button className="menu-buttons" onClick={() => { setScreen('main') }}><h2>Kitchen</h2></button>
      </div>
      <div className="menu-rows">
        <button className="menu-buttons" onClick={() => { setScreen('settings') }}><h2>Settings</h2></button>
        <button className="menu-buttons" onClick={() => { setScreen('plu') }}><h2>PLU</h2></button>
      </div>
    </div>
  )
}

export default MainMenu;