import React from "react";
import Login from "./Component/Login/Login";
import Product from "./Component/Screen/Product/Product";
import Home from "./Component/Home/Home";
import { Route,Routes } from "react-router-dom";

function App () {
  return(
    <>
  <Routes>
    <Route path="/" element={<Login/>}></Route>
    <Route path="/Home" element={<Home/>}></Route>
    <Route path="/Product" element={<Product/>}></Route>
  </Routes>
    </>
  )
}

export default App;