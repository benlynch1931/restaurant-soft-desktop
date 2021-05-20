import React, { useContext } from 'react';

import MainMenu from '../screens/MainMenu.js';
import PLU from '../screens/PLU.js'
import { AppContext } from '../contexts/AppContext.js'


const SettingsController = () => {
  
  const { settingsScreen } = useContext(AppContext);
  
  
  if (settingsScreen == 'main') {
    return (
      <MainSettings></MainSettings>
    )
  } else if (settingsScreen == 'stock') {
    return (
      null
    )
  } else if (settingsScreen == 'printing') {
    return (
      null
    )
  } else if (settingsScreen == 'group-departments') {
    return (
      null
    )
  }
}

export default SettingsController;