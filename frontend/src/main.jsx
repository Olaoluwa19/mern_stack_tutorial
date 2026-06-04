import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "./app/store.jsx";
import { Provider } from "react-redux";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (import.meta.env.PROD) {
  disableReactDevTools();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
