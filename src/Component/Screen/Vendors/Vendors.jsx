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
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddVendor from "./AddVendor";
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


const Vendors = () => {


    const [tableData, setTableData] = useState([]);

    const loggedInUID = localStorage.getItem("uid");
  
    useEffect(() => {
      if (loggedInUID) {
        // Reference to the 'Product' node in Firebase Realtime Database
        const productRef = ref(db, "Vendor");
  
        // Attach an event listener for data changes
        const fetchData = () => {
          onValue(productRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
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
            
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Vendors</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddVendor />

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
                          <th className="text-900 sort" data-sort="vendorName">
                          Vendor Name
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="Phone"
                          >
                            Phone NO
                          </th>
                          <th className="text-900 sort" data-sort="Email">
                          Email
                          </th>
                          <th className="text-900 sort" data-sort="City">
                          City
                          </th>
                          <th className="text-900 sort" data-sort="Address">
                          Address
                          </th>
                          <th className="text-900 sort" data-sort="Balance">
                          Balance
                          </th>
                         
                        </tr>
                      </thead>
                      <tbody className="list">
                        {tableData.map((item) => (
                          <tr key={item.id}>
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
                            <td className="tdchild">{item.vendorName}</td>
                            <td className="tdchild">+92 {item.phoneNo}</td>
                            <td className="tdchild">{item.email}</td>
                            <td className="tdchild">{item.city}</td>
                            <td className="tdchild">{item.addressLine1}</td>
                            <td className="tdchild">Rs: {item.openingBalance}</td>
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
    )
}

export default Vendors