import logo from './logo.svg';

import AppContextProvider from './contexts/AppContext.js'
import ScreenController from './controllers/ScreenController.js'

function App() {
  return (
    <div className="App">
      <AppContextProvider>
        <ScreenController />
      </AppContextProvider>
    </div>
  );
}

export default App;
