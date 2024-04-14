import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./components/themeProvider.jsx";
import { BrowserRouter } from "react-router-dom";
import { store} from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <PersistGate persistor={persistor}> */}
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="theme_key">
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    {/* </PersistGate> */}
  </React.StrictMode>
);
