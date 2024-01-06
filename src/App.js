import React from "react";
import Login from "./Component/Login/Login";
import Navbar from "./Component/NavBar/Navbar";
import Home from "./Component/Home/Home";
import { Route,Routes } from "react-router-dom";

function App () {
  return(
    <>
  <Routes>
    <Route path="/" element={<Login/>}></Route>
    <Route path="/Home" element={<Home/>}></Route>
  </Routes>
    </>
  )
}

export default App;