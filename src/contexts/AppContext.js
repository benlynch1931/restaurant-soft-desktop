import React, { createContext, Component } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    screen: 'main'
}

  setScreen = (newScreen) => {
    this.setState({ screen: newScreen})
  }




  render() {
    return (
      <AppContext.Provider value={{
        ...this.state,
        setScreen: this.setScreen,
      }}>
      {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider;
