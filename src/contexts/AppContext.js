import React, { createContext, Component } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    screen: 'main',
    settingsScreen: 'main',
    navigationWindow: null,
}

  setScreen = (newScreen) => {
    this.setState({ screen: newScreen})
  }
  
  setSettingsScreen = (newScreen) => {
    this.setState({ settingsScreen: newScreen})
  }
  
  setNavigationWindow = (newWindow) => {
    this.setState({ navigationWindow: newWindow })
  }





  render() {
    return (
      <AppContext.Provider value={{
        ...this.state,
        setScreen: this.setScreen,
        setSettingsScreen: this.setSettingsScreen,
        setNavigationWindow: this.setNavigationWindow
      }}>
      {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider;
