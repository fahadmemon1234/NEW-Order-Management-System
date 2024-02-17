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
import { Route, Routes, Navigate } from "react-router-dom";
import CodeType from "./Component/Screen/CodeType/CodeType";
import Code from "./Component/Screen/Code/Code";
import Deliever from "./Component/Screen/SaleOrder/DelieverySaleOrder";

function App() {
  const userLoggedIn = localStorage.getItem("userlogin") === "true";

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="*" element={<Navigate to="/" />} />
        {/* <Route path="/Home" element={<Home />}></Route> */}

        {/* ----------Product--------------------------- */}

        {/* <Route path="/Product" element={<Product />}></Route> */}

        {/* ----------Banking--------------------------- */}

        {/* <Route path="/Banks" element={<Banks />}></Route>
        <Route path="/Deposit" element={<Deposit />}></Route>
        <Route path="/WithDraw" element={<WithDraw />}></Route> */}

        {/* ----------Sales--------------------------- */}

        {/* <Route path="/Customers" element={<Customers />}></Route>
        <Route path="/SaleOrder" element={<SaleOrder />}></Route>
        <Route path="/AddSaleOrder" element={<AddSaleOrder />}></Route>
        <Route path="/PrintReceipt" element={<PrintReceipt />}></Route> */}

        {/* ----------Manage--------------------------- */}
        {/* <Route path="/Manage" element={<Code />}></Route> */}

        {/* ----------Settings--------------------------- */}
        {/* <Route path="/CodeType" element={<CodeType />}></Route> */}

        <Route
          path="/Home"
          element={userLoggedIn ? <Home /> : <Navigate to="/" />}
        />

        {/* ----------Product--------------------------- */}
        <Route
          path="/Product"
          element={userLoggedIn ? <Product /> : <Navigate to="/" />}
        />

        {/* ----------Banking--------------------------- */}
        <Route
          path="/Banks"
          element={userLoggedIn ? <Banks /> : <Navigate to="/" />}
        />
        <Route
          path="/Deposit"
          element={userLoggedIn ? <Deposit /> : <Navigate to="/" />}
        />
        <Route
          path="/WithDraw"
          element={userLoggedIn ? <WithDraw /> : <Navigate to="/" />}
        />

        {/* ----------Sales--------------------------- */}
        <Route
          path="/Customers"
          element={userLoggedIn ? <Customers /> : <Navigate to="/" />}
        />
        <Route
          path="/SaleOrder"
          element={userLoggedIn ? <SaleOrder /> : <Navigate to="/" />}
        />
        <Route
          path="/AddSaleOrder"
          element={userLoggedIn ? <AddSaleOrder /> : <Navigate to="/" />}
        />
        <Route
          path="/PrintReceipt"
          element={userLoggedIn ? <PrintReceipt /> : <Navigate to="/" />}
        />

        <Route
          path="/Manage"
          element={userLoggedIn ? <Code /> : <Navigate to="/" />}
        />

        {/* ----------Manage--------------------------- */}
        <Route
          path="/Deliever"
          element={userLoggedIn ? <Deliever /> : <Navigate to="/" />}
        />

        {/* ----------Settings--------------------------- */}
        <Route
          path="/CodeType"
          element={userLoggedIn ? <CodeType /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;
