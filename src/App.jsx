import { useState } from "react";

import { RouterProvider } from "react-router-dom";
import router from "./routes/route";

import { Toaster, toast } from "react-hot-toast";
function App() {


  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
