import React from 'react';

import '../styles/MainMenu.css'

const MainMenu = () => {
  
  return (
    <div>
      <div className="menu-rows">
        <button className="menu-buttons"><h2>Drinks</h2></button>
        <button className="menu-buttons"><h2>Food</h2></button>
      </div>
      <div className="menu-rows">
        <button className="menu-buttons"><h2>Settings</h2></button>
        <button className="menu-buttons"><h2>PLU</h2></button>
      </div>
    </div>
  )
}

export default MainMenu;