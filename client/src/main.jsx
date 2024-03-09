import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/themeProvider.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import {ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({});
ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false}/>  
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  </PersistGate>
);
