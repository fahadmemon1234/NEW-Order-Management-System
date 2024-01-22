import React, { useState, useEffect } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import InputMask from "react-input-mask";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, get, onValue, update, remove, push } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddCustModal from "./AddCustModal";
// --------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function AddSaleOrder() {
  const [paymentMethod, setPaymentMethod] = useState("rdoCash");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const [customerName, setCustomerName] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loggedInUID) {
          const dataRef = ref(db, "Customer");
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
              value: key,
              label: filteredData[key].customerName,
            }));

            // Add the "Select Customer" option to the beginning of the array
            setCustomerName([
              {
                value: "0",
                label: "Select Customer",
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
  }, [db, loggedInUID]);

  // Get the current date in the format "YYYY-MM-DD"
  const currentDate = new Date().toISOString().split("T")[0];

  // Initialize the state with the current date
  const [orderDate, setOrderDate] = useState(currentDate);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ccc",
      borderRadius: "4px",
      minHeight: "38px",
    }),
  };

  const [CounterSale, setCounterSale] = useState("Counter Sale");
  const [Name, setName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [SalesMan, setSalesMan] = useState("Zohaib Memon");

  const handleSaveOrder = () => {
    debugger;
    try {
      const loggedInUID = localStorage.getItem("uid");

      if (paymentMethod === "rdoCash") {
        const SaleOrderRef = ref(db, "SaleOrder");
        const newSaleOrder = {
          uid: loggedInUID,
          customer: CounterSale,
          orderDate: orderDate,
          name: Name,
          phoneNumber: PhoneNumber,
          paymentMethod: "rdoCash",
        };
        push(SaleOrderRef, newSaleOrder);
      } else if (paymentMethod === "rdoCredit") {
        const SaleOrderRef = ref(db, "SaleOrder");
        const newSaleOrder = {
          uid: loggedInUID,
          customer: selectedCustomer,
          orderDate: orderDate,
          salesMan: SalesMan,
          paymentMethod: "rdoCredit",
        };
        push(SaleOrderRef, newSaleOrder);
      } else {
        const SaleOrderRef = ref(db, "SaleOrder");
        const newSaleOrder = {
          uid: loggedInUID,
          customer: selectedCustomer,
          orderDate: orderDate,
          name: Name,
          paymentMethod: "rdoCashCredit",
          phoneNumber: PhoneNumber,
        };
        push(SaleOrderRef, newSaleOrder);
      }

      toast.success("Sale Order Added Successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      toast.error("Error adding SaleOrder: " + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Error adding SaleOrder:", error);
    }
  };

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
                  <h1>Sale Order</h1>
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
                  <h3>SO #</h3>
                </div>
              </div>

              {/* input field Cash */}

              {paymentMethod === "rdoCash" && (
                <div className="Cash">
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6">
                      <label className="form-label" htmlFor="SelectCustomer">
                        Select Customer
                      </label>
                      <input
                        type="text"
                        id="txtCustomerCash"
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
                      <label className="form-label" htmlFor="Name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="txtName"
                        className="form-control"
                        placeholder="Enter Name"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
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

                      {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 20 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                    </div>
                  </div>
                </div>
              )}

              {/* input field Credit */}

              {paymentMethod === "rdoCredit" && (
                <div className="Credit">
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6">
                      <label className="form-label" htmlFor="SelectCustomer">
                        Select Customer
                      </label>

                      <Select
                        id="txtCustomerCredit"
                        styles={{
                          ...customStyles,
                          menu: (provided) => ({
                            ...provided,
                            overflowY: "auto", // Add scrollbar when needed
                            maxHeight: "160px", // Set the maximum height here
                          }),
                        }}
                        options={customerName}
                        value={selectedCustomer}
                        placeholder="Select Customer"
                        onChange={(selectedOption) =>
                          setSelectedCustomer(selectedOption)
                        }
                        isSearchable={true}
                      />

                      {/* <a
                        href="#"
                        style={{ float: "right", fontSize: 13 + "px" }}
                       
                      >
                        Add Customer
                      </a> */}
                      <AddCustModal />
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
                      <label className="form-label" htmlFor="SalesMan">
                        SalesMan
                      </label>
                      {/* <input
                  type="text"
                  id="txtName"
                  className="form-control"
                  placeholder="Enter Name"
                ></input> */}

                      <Select
                        id="txtSalesMan"
                        options={[
                          { value: "Fahad Memon", label: "Fahad Memon" },
                          { value: "Zohaib Memon", label: "Zohaib Memon" },
                          // Add more static names as needed
                        ]}
                        value={SalesMan} // Set the desired pre-selected value here
                        placeholder="Select SalesMan"
                        isSearchable={true}
                        onChange={(e) => setSalesMan(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 col-lg-6 col-sm-6">
                      {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 85 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                    </div>
                  </div>
                </div>
              )}

              {/* input field Cash/Credit */}

              {paymentMethod === "rdoCashCredit" && (
                <div className="Cash/Credit">
                  <div className="row">
                    <div className="col-md-6 col-lg-6 col-sm-6">
                      <label className="form-label" htmlFor="SelectCustomer">
                        Select Customer
                      </label>
                      <Select
                        id="txtCustomerCashCredit"
                        options={customerName}
                        styles={{
                          ...customStyles,
                          menu: (provided) => ({
                            ...provided,
                            overflowY: "auto", // Add scrollbar when needed
                            maxHeight: "160px", // Set the maximum height here
                          }),
                        }}
                        value={selectedCustomer}
                        placeholder="Select Customer"
                        onChange={(selectedOption) =>
                          setSelectedCustomer(selectedOption)
                        }
                        isSearchable={true}
                      />
                      {/* <a
                        href="#"
                        style={{ float: "right", fontSize: 13 + "px" }}
                      >
                        Add Customer
                      </a> */}
                      <AddCustModal />
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
                      <label className="form-label" htmlFor="Name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="txtName"
                        className="form-control"
                        placeholder="Enter Name"
                        value={Name}
                        onChange={(e) => setName(e.target.value)}
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

                      {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 20 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                    </div>
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                style={{ float: "right", marginTop: 20 + "px" }}
                onClick={handleSaveOrder}
              >
                Save Order
              </Button>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

export default AddSaleOrder;
