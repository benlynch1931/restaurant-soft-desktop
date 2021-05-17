import React, { useContext } from 'react';

import MainMenu from '../screens/MainMenu.js';
import PLU from '../screens/PLU.js'
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
  }
}

export default ScreenController;