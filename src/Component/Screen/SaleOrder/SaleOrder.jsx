import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
// ---------------------------------------------------

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import PrintReceipts from "./PrintReceipt";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "../../Config/firebase";

import { useNavigate } from "react-router-dom";
// ---------------------------------------------------

//Modal Css
// ---------------------------------------------------
import "../../../assets/Css/Model.css";
// ----------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

const SaleOrder = ({ setPrintContent }) => {
  const navigate = useNavigate();

  const NextPage = () => {
    localStorage.removeItem("ID");
    localStorage.removeItem("customer");
    localStorage.removeItem("orderDate");
    localStorage.removeItem("name");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("salesMan");
    localStorage.removeItem("isSaveOrderVisible");
    localStorage.removeItem("ItemName");
    localStorage.removeItem("EditID");
    localStorage.removeItem("EdititemName");
    localStorage.removeItem("EditQuantity");
    localStorage.removeItem("EditMeasurement");
    localStorage.removeItem("EditSalePrice");
    localStorage.removeItem("EditDescription");
    localStorage.removeItem("EditTotal");
    localStorage.removeItem("EditStock");
    localStorage.removeItem("EditCostPrice");
    localStorage.removeItem("ProductID");
    localStorage.removeItem("AddItemSection");
    // Navigate to the new page
    navigate("/AddSaleOrder");
  };

  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    debugger;
    if (loggedInUID) {
      // Reference to the 'SaleOrder' node in Firebase Realtime Database
      const productRef = ref(db, "SaleOrder");

      // Attach an event listener for data changes
      const fetchData = () => {
        onValue(productRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            // Convert the object of products into an array
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID) // Filter data based on UID
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
  }, [loggedInUID]);

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

  const openPrintWindow = (item) => {
    debugger;

    localStorage.setItem("ID", item.id);
    localStorage.setItem("Customer", item.customer);
    localStorage.setItem("InvoiceDate", item.orderDate);

    localStorage.setItem("ItemName", item.itemName);
    localStorage.setItem("Quantity", item.quantity);
    localStorage.setItem("Price", item.salePrice);
    localStorage.setItem("Total", item.totalPrice);

    const printWindow = window.open("/PrintReceipt", "_blank");

    // Ensure the window has loaded before triggering print
    printWindow.onload = () => {
      printWindow.print();
    };
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

        <div className="card">
          <div className="card-body">
            {/* Headng and btn */}
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Sale Order</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  {/* <AddSaleOrder /> */}
                  <Button
                    variant="primary"
                    onClick={NextPage}
                    style={{ float: "right" }}
                  >
                    Add Sale Order
                  </Button>

                  <br />
                  <br />

                  <div className="input-group rounded">
                    <label
                      style={{
                        fontSize: 15,
                        textAlign: "center",
                        margin: "auto",
                        marginRight: 5 + "px",
                      }}
                    >
                      Search:{" "}
                    </label>
                    <input
                      type="search"
                      className="form-control rounded"
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="search-addon"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------------------------------Table------------------------------------------ */}

            <br />
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div
                  id="tableExample"
                  data-list='{"valueNames":["name","email","age"],"page":5,"pagination":true}'
                >
                  <div className="table-responsive scrollbar">
                    <table className="table table-bordered table-striped fs-10 mb-0">
                      <thead className="bg-200">
                        <tr>
                          <th className="text-900 sort" data-sort="Action">
                            Action
                          </th>
                          <th className="text-900 sort" data-sort="ItemName">
                            SaleOrder Date
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="ItemQuantity"
                          >
                            Customer Name
                          </th>
                          <th className="text-900 sort" data-sort="ItemCost">
                            Status
                          </th>
                          <th className="text-900 sort" data-sort="SalePrice">
                            CreatedDate
                          </th>
                          <th className="text-900 sort" data-sort="Measurement">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {visibleItems.slice(0, rowsToShow).map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex" }}>
                                {item.status === "New" && (
                                  <>
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      style={{ marginRight: "10px" }}
                                      // onClick={() => handleShow(item)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      // onClick={() => handleDelete(item.id)}
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}

                                {item.status === "Order Delivered" && (
                                  <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={() => openPrintWindow(item)}
                                  >
                                    Print
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="tdchild">{item.orderDate}</td>
                            <td className="tdchild">{item.customer}</td>
                            <td className="tdchild">{item.status}</td>
                            <td className="tdchild">{item.createdDate}</td>
                            <td className="tdchild">{item.Payment}</td>
                            {/* Add more table data cells as needed */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-items-center mt-3">
                    <div className="pagination d-none"></div>
                    <div className="col">
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
                    </div>
                    <div className="col-auto d-flex">
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
                        style={{ backgroundColor: "#2c7be5", color: "white" }}
                        data-list-pagination="next"
                        onClick={handleNextClick}
                        disabled={currentPage === totalPages}
                      >
                        <span>Next</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* End Card */}
          </div>
        </div>
      </Main>
    </>
  );
};

export default SaleOrder;
