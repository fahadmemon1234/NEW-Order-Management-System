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
import AddCustomerPayment from "./AddCustomerPayment";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function CustomerPayment() {
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
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Customer Payment</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddCustomerPayment />

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
                          <th className="text-900 sort" data-sort="PaymentID">
                            Payment ID
                          </th>
                          <th className="text-900 sort" data-sort="Date">
                            Date
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="CustomerName"
                          >
                            Customer Name
                          </th>
                          <th className="text-900 sort" data-sort="PaymentType">
                            Payment Type
                          </th>
                          <th className="text-900 sort" data-sort="BankName">
                            Bank Name
                          </th>
                          <th className="text-900 sort" data-sort="ChequeNo">
                            Cheque No
                          </th>
                          <th className="text-900 sort" data-sort=" Amount">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        <tr>
                          <td>
                            <div style={{ display: "flex" }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ marginRight: "10px" }}
                                //   onClick={() => handleShow(item)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                //   onClick={() => handleDelete(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                          <td className="tdchild"></td>
                          <td className="tdchild"></td>
                          <td className="tdchild"></td>
                          <td className="tdchild"></td>
                          <td className="tdchild"></td>
                          <td className="tdchild"></td>
                          <td className="tdchild"></td>
                          {/* Add more table data cells as needed */}
                        </tr>
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
                            {/* {paginationText} */}
                          </span>
                        </p>
                        <p className="mb-0 mx-2">Rows per page:</p>
                        <select
                          className="w-auto form-select form-select-sm"
                          //   defaultValue={rowsToShow}
                          //   onChange={handleSelectChange}
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
                        // onClick={handlePrevClick}
                        // disabled={currentPage === 1}
                      >
                        <span>Previous</span>
                      </button>
                      <button
                        className="btn btn-sm btn-primary px-4 ms-2"
                        type="button"
                        style={{ backgroundColor: "#2c7be5", color: "white" }}
                        data-list-pagination="next"
                        // onClick={handleNextClick}
                        // disabled={currentPage === totalPages}
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

export default CustomerPayment;
