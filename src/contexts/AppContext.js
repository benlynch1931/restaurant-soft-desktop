import React, { createContext, Component } from 'react';

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    screen: 'main'
}

  setStitchCount = (newSize) => {
    this.setState({ stitchCount: newSize})
  }




  render() {
    return (
      <AppContext.Provider value={{
        ...this.state,
        setStitchCount: this.setStitchCount,
      }}>
      {this.props.children}
      </AppContext.Provider>
    )
  }
}

export default AppContextProvider;
