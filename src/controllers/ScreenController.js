import React, { useContext } from 'react';

import MainMenu from '../screens/MainMenu.js';
import PLU from '../screens/PLU.js'
import SettingsController from './SettingsController.js';

import { AppContext } from '../contexts/AppContext.js'


const ScreenController = () => {
  
  const { screen } = useContext(AppContext);
  
  
  if (screen == 'main') {
    return (
      <MainMenu></MainMenu>
    )
  } else if (screen == 'plu') {
    return (
      <PLU></PLU>
    )
  } else if (screen == 'settings') {
    <SettingsController></SettingsController>
  }
}

export default ScreenController;