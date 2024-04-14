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
  const loggedInUID = localStorage.getItem("uid");

  // ----------------Handle Return-------------------

  const [data, setData] = useState("");
  const [saleOrderItemData, setSaleOrderItemData] = useState("");
  const [ProductData, setProductData] = useState("");

  useEffect(() => {
    debugger;
    if (loggedInUID) {
      const SaleOrderRef = ref(db, "SaleOrder");
      const SaleOrderItemRef = ref(db, "SaleOrderItem");
      const ProductRef = ref(db, "Product");

      const fetchSaleOrderData = () => {
        onValue(SaleOrderRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setData(dataArray);
          }
        });
      };

      const fetchSaleOrderItemData = () => {
        onValue(SaleOrderItemRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setSaleOrderItemData(dataArray);
          }
        });
      };

      const fetchProduct = () => {
        onValue(ProductRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .map((key) => ({
                id: key,
                ...data[key],
              }));
            setProductData(dataArray);
          }
        });
      };

      fetchProduct();
      fetchSaleOrderData();
      fetchSaleOrderItemData();
    } else {
      console.error("No user is currently logged in.");
    }
  }, [loggedInUID]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ID = searchParams.get("ID");

  const [CustomerNames, setCustomerName] = useState("");
  const [SaleOrderDate, setSaleOrderDate] = useState("");

  useEffect(() => {
    if (Array.isArray(data)) {
      const saleIds = data.map((item) => item.id);

      if (saleIds.includes(ID)) {
        const indexCustomerName = saleIds.indexOf(ID);
        const matchingItem = data[indexCustomerName];
        setCustomerName(matchingItem.customer);
        setSaleOrderDate(matchingItem.orderDate);
      }
    }
  }, [ID, data]);

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
                    value={ID}
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
                    value={CustomerNames}
                    readOnly
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
                    value={SaleOrderDate}
                    readOnly
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
