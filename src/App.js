import React from "react";
import Login from "./Component/Login/Login";
import Product from "./Component/Screen/Product/Product";
import Home from "./Component/Home/Home";
import Banks from "./Component/Screen/Bank/Bank";
import Deposit from "./Component/Screen/Deposit/Deposit";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          <Route path="/Product" element={<Product />}></Route>
          <Route path="/Banks" element={<Banks />}></Route>
          <Route path="/Deposit" element={<Deposit />}></Route>
        </Routes>
    </>
  );
}

export default App;
