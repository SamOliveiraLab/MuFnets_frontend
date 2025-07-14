import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Root from "./Root";
import "./App.css";
import OuputPage from "./pages/OuputPage";
import React, { useState } from "react";

// give your context a sensible default shape
export interface SelectedTypeCtx {
  selectedType: "milifluidics" | "hybrid" | "monolayer";
  setSelectedType: (t: SelectedTypeCtx["selectedType"]) => void;
}
export const SelectedTypeContext = React.createContext<SelectedTypeCtx>({
  selectedType: "milifluidics",
  setSelectedType: () => {},
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<HomePage />} />
      <Route path="/output" element={<OuputPage />} />
    </Route>
  )
);

function App() {
    const [selectedType, setSelectedType] = useState<
      "milifluidics" | "hybrid" | "monolayer"
    >("milifluidics");

  return (
    <SelectedTypeContext.Provider value={{ selectedType, setSelectedType }}>
      <RouterProvider router={router} />;
    </SelectedTypeContext.Provider>
  );
}

export default App;
