import React, { useEffect, useState } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
// ---------------------------------------------------

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";

import { useNavigate } from "react-router-dom";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
// import AddProduct from "./AddProduct";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update, remove, get } from "firebase/database";
import { db } from "../../Config/firebase";
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

// import AddMeasurment from "./AddMeasurment";
// import AddBrandCode from "./AddBrandCode";


const PurchaseOrder = () => {


  const navigate = useNavigate();

  const NextPage = () => {
    // Navigate to the new page
    navigate("/AddEditPurchaseOrder");
  };



    return(
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
                <h1>Purchase Order</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>

                  <Button
                    variant="primary"
                    onClick={NextPage}
                    style={{ float: "right" }}
                  >
                    Add Purchase Order
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
                    <table
                      className="table table-bordered table-striped fs-10 mb-0"
                      id="Mytable"
                    >
                      <thead className="bg-200">
                        <tr>
                          <th className="text-900 sort" data-sort="Action">
                            Action
                          </th>
                          <th className="text-900 sort" data-sort="PurchaseOrderDate">
                            Purchase Order Date
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="VendorName"
                          >
                            Vendor Name
                          </th>
                          <th className="text-900 sort" data-sort="Status">
                            Status
                          </th>
                          <th className="text-900 sort" data-sort="CreatedDate">
                            Created Date
                          </th>
                          <th className="text-900 sort" data-sort="OrderAmount">
                            Order Amount
                          </th>
                          
                        </tr>
                      </thead>
                      <tbody className="list">
                        {/* {tableData.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div style={{ display: "flex" }}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{ marginRight: "10px" }}
                                  onClick={() => handleShow(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                            <td className="tdchild">{item.itemName}</td>
                            <td className="tdchild">{item.itemQty}</td>
                            <td className="tdchild">{item.itemCost}</td>
                            <td className="tdchild">{item.sellPrice}</td>
                            <td className="tdchild">{item.measurement}</td>
                            <td className="tdchild">{item.brandCode}</td>
                            <td className="tdchild">{item.total}</td>
                            <td className="tdchild">{item.description}</td>
                          </tr>
                        ))} */}
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
    )
}

export default PurchaseOrder;