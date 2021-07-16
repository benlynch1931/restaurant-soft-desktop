import React, { useContext } from 'react';

import MainMenu from '../screens/MainMenu.js';
import BarScreen from '../screens/BarScreen.js';
import KitchenScreen from '../screens/KitchenScreen.js';
import PLU from '../screens/PLU.js'
import SettingsController from './SettingsController.js';
import NavigationWindows from '../components/NavigationWindows.js';

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
    return (
      <SettingsController></SettingsController>
    )
  } else if (screen === 'bar') {
    return (
      <div>
        <NavigationWindows />
        <BarScreen></BarScreen>
      </div>
    )
  } else if (screen === 'kitchen') {
    return (
      <KitchenScreen></KitchenScreen>
    )
  }
}

export default ScreenController;