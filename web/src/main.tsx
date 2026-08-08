import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { ManagePage } from "./ManagePage";
import { SuccessPage } from "./SuccessPage";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/manage/:slug/:token" element={<ManagePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
