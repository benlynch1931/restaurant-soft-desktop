import React, { useContext } from 'react';

import { AppContext } from '../../contexts/AppContext.js'
import '../../styles/MainSettings.css'

const MainSettings = () => {
  
  const { setSettingsScreen, setScreen } = useContext(AppContext);
  
  return (
    <div>
      <div className="settings-menu-rows">
        <button className="settings-menu-buttons" onClick={() => { setSettingsScreen('groups') }}><h2>Groups</h2></button>
        <button className="settings-menu-buttons" onClick={() => { setSettingsScreen('departments') }}><h2>Departments</h2></button>
      </div>
      <div className="settings-menu-rows">
        <button className="settings-menu-buttons" onClick={() => { setSettingsScreen('printing') }}><h2>Printing</h2></button>
        <button className="settings-menu-buttons" onClick={() => { setSettingsScreen('stock') }}><h2>Stock</h2></button>
      </div>
      <div className="settings-menu-rows">
        <button className="settings-menu-buttons" onClick={() => { setScreen('main') }}><h2>BACK</h2></button>
        {/*<button className="settings-menu-buttons" onClick={() => { setScreen('main') }}><h2>BACK</h2></button>*/}
      </div>
    </div>
  )
}


export default MainSettings;