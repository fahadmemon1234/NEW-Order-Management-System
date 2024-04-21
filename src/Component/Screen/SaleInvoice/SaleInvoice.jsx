import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
// ---------------------------------------------------

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

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

function SaleInvoice() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    debugger;
    if (loggedInUID) {
      const productRef = ref(db, "SaleInvoice");

      const fetchData = () => {
        onValue(productRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            debugger;
            const dataArray = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
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

  const startIndexs = 1;
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

  const navigate = useNavigate();

  const handleReturn = async (item) => {
    navigate(`/Return?ID=${item.SaleID}`, {
      state: { item: item },
    });
  };

  return (
    <>
      <Main>
        <div className="card">
          <div className="card-body">
            {/* Headng and btn */}
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Sale Invoice</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  {/* <AddCustomers /> */}

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
                          <th className="text-900 sort" data-sort="CodeID">
                            Invoice ID
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="CustomerName"
                          >
                            Invoice Date
                          </th>
                          <th className="text-900 sort" data-sort="FullName">
                            Customer Name
                          </th>
                          <th className="text-900 sort" data-sort="PhoneNumber">
                            Status
                          </th>
                          <th className="text-900 sort" data-sort="City">
                            TotalAmount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {visibleItems.slice(0, rowsToShow).map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex" }}>
                                <button
                                  type="button"
                                  className="btn btn-warning"
                                  style={{ marginRight: "10px" }}
                                  onClick={() => handleReturn(item)}
                                >
                                  Return
                                </button>
                              </div>
                            </td>
                            <td className="tdchild">{item.InvoiceID}</td>
                            <td className="tdchild">{item.createdDate}</td>
                            <td className="tdchild">{item.customer}</td>
                            <td className="tdchild">{item.status}</td>
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
          </div>
        </div>
      </Main>
    </>
  );
}

export default SaleInvoice;
