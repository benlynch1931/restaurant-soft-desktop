import React, { createContext, Component } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    screen: 'main',
    settingsScreen: 'main'
}

  setScreen = (newScreen) => {
    this.setState({ screen: newScreen})
  }
  
  setSettingsScreen = (newScreen) => {
    this.setState({ screen: newScreen})
  }





  render() {
    return (
      <AppContext.Provider value={{
        ...this.state,
        setScreen: this.setScreen,
        setSettingsScreen: this.setSettingsScreen
      }}>
      {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider;
