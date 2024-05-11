import React, { useState, useEffect } from "react";

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

// Add Modal
// ---------------------------------------------------
// import AddCustModal from "./AddCustModal";
// import AddProductModal from "./AddProduct";
// --------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

const AddEditPurchaseOrder = () => {
  const [paymentMethod, setPaymentMethod] = useState("rdoCash");

  const [isSaveOrderVisible, setSaveOrderVisible] = useState(true);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const [CounterSale, setCounterSale] = useState("Counter Sale");
  const [VendorName, setVendorName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [orderDate, setOrderDate] = useState("");

  const [vendorNameSelect, setVendorNameSelect] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");

  const loggedInUID = localStorage.getItem("uid");

  const [VendorID, setVendorID] = useState(localStorage.getItem("VendorID"));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ccc",
      borderRadius: "4px",
      minHeight: "38px",
    }),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loggedInUID) {
          const dataRef = ref(db, "Vendor");
          const snapshot = await get(dataRef);

          if (snapshot.exists()) {
            const data = snapshot.val();

            // Filter data based on the loggedInUID

            const filteredData = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
              }, {});

            // Convert the filtered data object into an array of options
            const options = Object.keys(filteredData).map((key) => ({
              Id: key,
              value: filteredData[key].vendorName,
              label: filteredData[key].vendorName,
            }));

            // Add the "Select Customer" option to the beginning of the array
            setVendorNameSelect([
              {
                value: "0",
                label: "Select Vendor",
                disabled: true,
                selected: true,
              },
              ...options,
            ]);
          } else {
            console.error("Data doesn't exist in the 'Customer' node.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, [db, loggedInUID]);

  return (
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
                <h1>Purchase Order</h1>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    id="rdoCash"
                    type="radio"
                    name="paymentMethod"
                    value="rdoCash"
                    checked={paymentMethod === "rdoCash"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="rdoCash">
                    Cash
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    id="rdoCredit"
                    type="radio"
                    name="paymentMethod"
                    value="rdoCredit"
                    checked={paymentMethod === "rdoCredit"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="rdoCredit">
                    Credit
                  </label>
                </div>

                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    id="rdoCashCredit"
                    type="radio"
                    name="paymentMethod"
                    value="rdoCashCredit"
                    checked={paymentMethod === "rdoCashCredit"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label className="form-check-label" htmlFor="rdoCashCredit">
                    Cash/Credit
                  </label>
                </div>
              </div>

              <div
                className="col-md-6 col-lg-6 col-sm-6"
                style={{ display: "flex", justifyContent: "end" }}
              >
                <h3>PO #</h3>
              </div>
            </div>

            {isSaveOrderVisible && (
              <div id="SaveOrder">
                {paymentMethod === "rdoCash" && (
                  <div className="Cash">
                    <div className="row">
                      <div className="col-md-6 col-lg-6 col-sm-6">
                        <label className="form-label" htmlFor="Vendor">
                          Vendor
                        </label>
                        <input
                          type="text"
                          id="txtVendor"
                          className="form-control"
                          readOnly
                          value={CounterSale}
                          onChange={() => setCounterSale()}
                        ></input>
                      </div>

                      <div className="col-md-6 col-lg-6 col-sm-6">
                        <label className="form-label" htmlFor="OrderDate">
                          Order Date
                        </label>
                        <input
                          type="date"
                          id="txtOrderDate"
                          className="form-control"
                          value={orderDate}
                          onChange={(e) => setOrderDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <br />

                    <div className="row">
                      <div className="col-md-6 col-lg-6 col-sm-6">
                        <label className="form-label" htmlFor="VendorName">
                          Vendor Name
                        </label>
                        <input
                          type="text"
                          id="txtVendorName"
                          className="form-control"
                          placeholder="Enter Vendor Name"
                          value={VendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                        ></input>
                      </div>

                      <div className="col-md-6 col-lg-6 col-sm-6">
                        <label className="form-label" htmlFor="PhoneNumber">
                          Phone Number
                        </label>

                        <InputMask
                          className="form-control"
                          name="PhoneNo"
                          id="txtPhoneNo"
                          mask="999-9999999"
                          placeholder="+92 999-9999999"
                          value={PhoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "rdoCredit" && (
                  <div className="Credit">
                    <div className="row">
                      <div className="col-md-6 col-lg-6 col-sm-6">
                        <label className="form-label" htmlFor="SelectVendor">
                          Vendor
                        </label>

                        <Select
                          id="txtVendorCredit"
                          styles={{
                            ...customStyles,
                            menu: (provided) => ({
                              ...provided,
                              overflowY: "auto", // Add scrollbar when needed
                              maxHeight: "160px", // Set the maximum height here
                            }),
                          }}
                          options={vendorNameSelect}
                          value={vendorNameSelect.find(
                            (option) => option.value === VendorID
                          )}
                          placeholder="Select Vendor"
                          onChange={(selectedOption) => {
                            setSelectedVendor(selectedOption);
                            setVendorID(selectedOption.Id);
                            localStorage.setItem("VendorID", selectedOption.Id);
                          }}
                          isSearchable={true}
                        />

                        <input type="hidden" id="VendorID" value={VendorID} />

                        {/* <AddCustModal /> */}
                      </div>

                      <div className="col-md-6 col-lg-6 col-sm-6">
                        <label className="form-label" htmlFor="OrderDate">
                          Order Date
                        </label>
                        <input
                          type="date"
                          id="txtOrderDate"
                          className="form-control"
                          value={orderDate}
                          onChange={(e) => setOrderDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <br />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AddEditPurchaseOrder;
