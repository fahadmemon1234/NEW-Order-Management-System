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
import $ from "jquery";
import { useNavigate } from "react-router-dom";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import {
  ref,
  get,
  onValue,
  update,
  remove,
  push,
  set,
} from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddCustModal from "./AddCustModal";
import AddProductModal from "./AddProduct";
// --------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function Deliever() {
  const [OrderID, setOrderID] = useState("");
  const [CustomerName, setCustomerName] = useState("");
  const [SaleOrderDate, setSaleOrderDate] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ID = searchParams.get("ID");

  useEffect(() => {
    // Retrieve items from localStorage
    const id = localStorage.getItem("ID");
    const customer = localStorage.getItem("customer");
    const orderDate = localStorage.getItem("orderDate");
    const name = localStorage.getItem("name");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const paymentMethod = localStorage.getItem("paymentMethod");
    const salesMan = localStorage.getItem("salesMan");

    setOrderID(ID);
    setCustomerName(customer);
    setSaleOrderDate(orderDate);
  }, []);

  //-------------------------------Table Data Show----------------------

  const loggedInUID = localStorage.getItem("uid");

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const DepositRef = ref(db, "SaleOrderItem");

      // Attach an event listener for data changes
      const fetchData = async () => {
        onValue(DepositRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert the object of products into an array
            const dataArray = Object.keys(data)
              .filter(
                (key) =>
                  data[key].uid === loggedInUID && data[key].saleOrderID === ID
              ) // Filter data based on UID
              .map((key) => ({
                id: key,
                ...data[key],
              }));

            setTableData(dataArray);
          }
        });
      };

      fetchData();
    } else {
      console.error("No user is currently logged in.");
      // Handle the case where no user is logged in, perhaps by redirecting to the login page.
    }
  }, [loggedInUID, ID]);

  const sortedTableData = tableData.sort((a, b) => b.id - a.id);
  const sortedDataDescending = [...sortedTableData].sort((a, b) =>
    b.id.localeCompare(a.id)
  );

  //   RowDropDown Selection

  const [rowsToShow, setRowsToShow] = useState(5);

  const handleSelectChange = (event) => {
    setRowsToShow(parseInt(event.target.value, 10));
  };

  // Rows count and show
  // const totalItems = 8; // Replace with the actual total number of items
  const startIndexs = 1;
  // const endIndexs = Math.min(startIndexs + rowsToShow - 1, totalItems);
  const rowCount = sortedDataDescending.length; // Add this line to get the row count
  const paginationText = `${startIndexs} to ${rowsToShow} of ${rowCount}`;

  const [currentPage, setCurrentPage] = useState(1);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    const totalPages = Math.ceil(sortedDataDescending.length / rowsToShow);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * rowsToShow;
  const endIndex = Math.min(
    startIndex + rowsToShow,
    sortedDataDescending.length
  );
  const visibleItems = sortedDataDescending.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedDataDescending.length / rowsToShow);

  const FinalPrice = visibleItems.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );

  //  ---------------Total---------
  const [shipQuantities, setShipQuantities] = useState({}); // State to manage ship quantities for each item

  const handleShipQuantityChange = (itemId, e, item) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      if (value <= item.quantity) {
        setShipQuantities((prevState) => ({
          ...prevState,
          [itemId]: value, // Update ship quantity for the specific item
        }));
      } else {
        // Display error toast if ship quantity exceeds available quantity
        toast.error("Ship quantity cannot exceed the available quantity", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      // Handle invalid input here
      // For now, just set the ship quantity to 0
      setShipQuantities((prevState) => ({
        ...prevState,
        [itemId]: 0, // Set ship quantity to 0 for the specific item
      }));
      // Show toast error for invalid input
    }
  };

  const calculateTotalPrice = (item) => {
    const price = item.totalPrice;
    const shipQuantity = shipQuantities[item.id] || 0; // Get ship quantity for the specific item, default to 0
    return price * shipQuantity;
  };

  const [TransportCharges, setTransportCharges] = useState("");
  const [LabourCharges, setLabourCharges] = useState("");
  const [Discount, setDiscount] = useState("");

  const calculateTotal = () => {
    let total = 0;
    for (const itemId in shipQuantities) {
      const item = visibleItems.find((item) => item.id === itemId);
      if (item) {
        total += calculateTotalPrice(item);
      }
    }

    // Use state variables for transport charges, labour charges, and discount
    const transportChargesValue = parseFloat(TransportCharges) || 0;
    const labourChargesValue = parseFloat(LabourCharges) || 0;
    const discountValue = parseFloat(Discount) || 0;

    // Subtract transport charges, labour charges, and discount from the total
    total -= transportChargesValue;
    total -= labourChargesValue;
    total -= discountValue;

    return total;
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
                  <h1>Delievery Sale Order</h1>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-sm-4 col-lg-4">
                  <label className="form-label" htmlFor="OrderID">
                    Order ID:
                  </label>
                  <input
                    type="text"
                    id="txtOrderID"
                    className="form-control"
                    value={OrderID}
                    readOnly
                  />
                </div>

                <div className="col-md-4 col-sm-4 col-lg-4">
                  <label className="form-label" htmlFor="CustomerName">
                    Customer Name:
                  </label>
                  <input
                    type="text"
                    id="txtCustomerName"
                    className="form-control"
                    value={CustomerName}
                    readOnly
                  />
                </div>

                <div className="col-md-4 col-sm-4 col-lg-4">
                  <label className="form-label" htmlFor="SaleOrderDate">
                    Sale Order Date:
                  </label>
                  <input
                    type="date"
                    id="txtSaleOrderDate"
                    className="form-control"
                    value={SaleOrderDate}
                    readOnly
                  />
                </div>
              </div>

              <div className="row" style={{ paddingTop: "60px" }}>
                <div className="col-md-12 col-lg-12 col-sm-12">
                  <div
                    id="tableExample"
                    data-list='{"valueNames":["name","email","age"],"page":5,"pagination":true}'
                  >
                    <div className="table-responsive scrollbar">
                      <table className="table table-bordered table-striped fs-10 mb-0">
                        <thead className="bg-200">
                          <tr>
                            <th className="text-900 sort" data-sort="ItemName">
                              Item Name
                            </th>
                            <th className="text-900 sort" data-sort="Quantity">
                              Quantity
                            </th>
                            <th
                              className="text-900 sort"
                              data-sort="ShipQuantity"
                              style={{ width: "25%" }}
                            >
                              Ship Quantity
                            </th>
                            <th className="text-900 sort" data-sort="Price">
                              Price
                            </th>
                            <th className="text-900 sort" data-sort="Total">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="list">
                          {visibleItems.slice(0, rowsToShow).map((item) => (
                            <tr key={item.id}>
                              <td className="tdchild">{item.itemName}</td>
                              <td className="tdchild">{item.quantity}</td>
                              <td className="tdchild">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={shipQuantities[item.id] || ""} // Get ship quantity for the specific item
                                  onChange={(e) =>
                                    handleShipQuantityChange(item.id, e, item)
                                  } // Pass the item id to handleShipQuantityChange
                                />
                              </td>
                              <td className="tdchild">{item.totalPrice}</td>
                              <td className="tdchild">
                                {calculateTotalPrice(item)}
                              </td>
                              {/* Add more table data cells as needed */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="pagination d-none"></div>
                      <div className="col-md-9 col-sm-9 col-lg-9">
                        <div
                          className="d-flex align-items-center fs--1"
                          style={{ fontSize: "14px" }}
                        >
                          <p className="mb-0">
                            <span className="d-none d-sm-inline-block me-2">
                              {paginationText}
                            </span>
                          </p>
                          <p className="mb-0 mx-2">Rows per page:</p>
                          <select
                            className="w-auto form-select form-select-sm"
                            defaultValue={rowsToShow}
                            onChange={handleSelectChange}
                          >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                          </select>
                        </div>
                        <div style={{ paddingTop: "10px" }}>
                          <button
                            className="btn btn-sm btn-warning"
                            type="button"
                            data-list-pagination="prev"
                            onClick={handlePrevClick}
                            disabled={currentPage === 1}
                          >
                            <span>Previous</span>
                          </button>
                          <button
                            className="btn btn-sm btn-primary px-4 ms-2"
                            type="button"
                            style={{
                              backgroundColor: "#2c7be5",
                              color: "white",
                            }}
                            data-list-pagination="next"
                            onClick={handleNextClick}
                            disabled={currentPage === totalPages}
                          >
                            <span>Next</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-lg-3">
                        <div
                          className="mb-3"
                          style={{ paddingTop: "10px" }}
                          id="DeliveredDate"
                        >
                          <label
                            htmlFor="DeliveredDate"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Delivered Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="DeliveredDate"
                            value={"03/04/2023"}
                            id="Payment"
                            placeholder="Delivered Date"
                          />
                        </div>

                        <div
                          className="mb-3"
                          style={{ paddingTop: "10px" }}
                          id="TransportCharges"
                        >
                          <label
                            htmlFor="TransportCharges"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Transport Charges
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="TransportCharges"
                            value={TransportCharges}
                            onChange={(e) =>
                              setTransportCharges(e.target.value)
                            }
                            id="TransportCharges"
                            placeholder="Transport Charges"
                          />
                        </div>

                        <div
                          className="mb-3"
                          style={{ paddingTop: "10px" }}
                          id="LabourCharges"
                        >
                          <label
                            htmlFor="LabourCharges"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Labour Charges
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="LabourCharges"
                            value={LabourCharges}
                            onChange={(e) => setLabourCharges(e.target.value)}
                            id="LabourCharges"
                            placeholder="Labour Charges"
                          />
                        </div>

                        <div
                          className="mb-3"
                          style={{ paddingTop: "10px" }}
                          id="Discount"
                        >
                          <label
                            htmlFor="Discount"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Discount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="Discount"
                            value={Discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            id="Discount"
                            placeholder="Discount"
                          />
                        </div>

                        <div
                          className="mb-3"
                          style={{ paddingTop: "10px" }}
                          id="Total"
                        >
                          <label
                            htmlFor="Total"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Total
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="Total"
                            value={calculateTotal()}
                            id="Total"
                            readOnly
                            placeholder="Total"
                          />
                        </div>

                        <Button
                          variant="primary"
                          style={{ marginTop: 10 + "px" }}
                          id="btnSaveClose"
                        >
                          Delieverd
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------- */}
            </div>
          </div>
        </div>
      </Main>
    </>
  );
}

export default Deliever;
