import React, { useEffect, useState } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";

import { useLocation } from "react-router-dom";
// ---------------------------------------------------

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, get, onValue, update, remove, push } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function Return() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ID = searchParams.get("ID");

  return (
    <>
      <Main>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <div className="card" style={{ border: "1px solid #2c7be5" }}>
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 col-lg-12 col-sm-12">
                  <h1>Return Sale Order</h1>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="ID">
                    Sale Order ID
                  </label>
                  <input
                    type="text"
                    id="txtID"
                    className="form-control"
                    readOnly
                  ></input>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="CustomerName">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    id="txtCustomerName"
                    className="form-control"
                    placeholder="Enter Name"
                  ></input>
                </div>

                <div className="col-lg-4 col-md-4 col-sm-4">
                  <label className="form-label" htmlFor="SaleOrderDate">
                    Sale Order Date
                  </label>
                  <input
                    type="date"
                    id="txtSaleOrderDate"
                    className="form-control"
                    placeholder="Enter Name"
                  ></input>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

export default Return;
