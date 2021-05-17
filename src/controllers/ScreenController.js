import React, { useContext } from 'react';

import MainMenu from '../screens/MainMenu.js';
import { AppContext } from '../contexts/AppContext.js'


const ScreenController = () => {
  
  const { screen } = useContext(AppContext);
  
  
  if (screen == 'main') {
    return (
      <MainMenu></MainMenu>
    )
  }
}

export default ScreenController;