import React from 'react';

import '../styles/MainMenu.css'

const MainMenu = () => {
  
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button style={{ height: 80, flexGrow: 1, width: '100%' }}><h2>Drinks</h2></button>
        <button style={{ height: 80, flexGrow: 1, width: '100%' }}><h2>Food</h2></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <button style={{ height: 80, flexGrow: 1, width: '100%' }}><h2>Settings</h2></button>
        <button style={{ height: 80, flexGrow: 1, width: '100%' }}><h2>PLU</h2></button>
      </div>
    </div>
  )
}

export default MainMenu;