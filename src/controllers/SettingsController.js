import React, { useContext } from 'react';

import MainSettings from '../screens/settings/MainSettings.js';
import GroupsSettings from '../screens/settings/GroupsSettings.js'

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
  } else if (settingsScreen == 'groups') {
    return (
      <GroupsSettings></GroupsSettings>
    )
  } else if (settingsScreen == 'departments') {
    return (
      null
    )
  }
}

export default SettingsController;