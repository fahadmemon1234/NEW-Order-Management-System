import React from "react";
import Login from "./Component/Login/Login";
import Product from "./Component/Screen/Product/Product";
import Home from "./Component/Home/Home";
import Banks from "./Component/Screen/Bank/Bank";
import Deposit from "./Component/Screen/Deposit/Deposit";
import WithDraw from "./Component/Screen/WithDraw/WithDraw";
import Customers from "./Component/Screen/Customers/Customers";
import SaleOrder from "./Component/Screen/SaleOrder/SaleOrder";
import AddSaleOrder from "./Component/Screen/SaleOrder/AddSaleOrder";
import PrintReceipt from "./Component/Screen/SaleOrder/PrintReceipt";
import { Route, Routes } from "react-router-dom";
import CodeType from "./Component/Screen/CodeType/CodeType";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/Home" element={<Home />}></Route>

        {/* ----------Product--------------------------- */}

        <Route path="/Product" element={<Product />}></Route>

        {/* ----------Banking--------------------------- */}

        <Route path="/Banks" element={<Banks />}></Route>
        <Route path="/Deposit" element={<Deposit />}></Route>
        <Route path="/WithDraw" element={<WithDraw />}></Route>

        {/* ----------Sales--------------------------- */}

        <Route path="/Customers" element={<Customers />}></Route>
        <Route path="/SaleOrder" element={<SaleOrder />}></Route>
        <Route path="/AddSaleOrder" element={<AddSaleOrder />}></Route>
        <Route path="/PrintReceipt" element={<PrintReceipt />}></Route>


         {/* ----------Settings--------------------------- */}
         <Route path="/CodeType" element={<CodeType />}></Route>
      </Routes>
    </>
  );
}

export default App;
