import React, { useContext } from 'react';

import { AppContext } from '../contexts/AppContext.js'
import '../styles/MainMenu.css'

const MainMenu = () => {
  
  const { setScreen } = useContext(AppContext);
  
  return (
    <div>
      <div className="menu-rows">
        <button className="menu-buttons"><h2>Drinks</h2></button>
        <button className="menu-buttons"><h2>Food</h2></button>
      </div>
      <div className="menu-rows">
        <button className="menu-buttons"><h2>Settings</h2></button>
        <button className="menu-buttons" onClick={() => { setScreen('plu') }}><h2>PLU</h2></button>
      </div>
    </div>
  )
}

export default MainMenu;