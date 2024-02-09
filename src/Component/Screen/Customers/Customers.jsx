import React, { useState, useEffect } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddCustomers from "./AddCustomers";
// --------------------------------------------------


// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import InputMask from 'react-input-mask';
// ---------------------------------------------------

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

function Customers() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const productRef = ref(db, "Customer");

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

  //   ---------------------------------Edit Modal and Populate----------------------------------

  const randomNumber = Math.floor(Math.random() * 100000);
  const [code, setCode] = useState(randomNumber);

  const [CustomerName, setCustomerName] = useState("");
  const [CustomerNameError, setCustomerNameError] = useState("");
  const [FullName, setFullName] = useState("");
  const [FullNameError, setFullNameError] = useState("");
  const [PhoneNo, setPhoneNo] = useState("");
  const [PhoneNoError, setPhoneNoError] = useState("");
  const [Email, setEmail] = useState("");
  const [AddressLine1, setAddressLine1] = useState("");
  const [AddressLine2, setAddressLine2] = useState("");
  const [City, setCity] = useState("");
  const [Province, setProvince] = useState("");
  const [PostalCode, setPostalCode] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");

  const [editedItem, setEditedItem] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    setEditedItem(item.id);
    setCode(item.CodeId);
    setCustomerName(item.customerName);
    setFullName(item.fullName);
    setPhoneNo(item.phoneNo);
    setEmail(item.email);
    setAddressLine1(item.addressLine1);
    setAddressLine2(item.addressLine2);
    setCity(item.city);
    setProvince(item.province);
    setPostalCode(item.postalCode);
    setOpeningBalance(item.openingBalance);

    setShow(true); // Store the editing item's ID in state
  };

  const handleSaveChanges = async () => {
    if (CustomerName && FullName && PhoneNo) {
      // Implement your save logic here
      console.log("Changes saved!");
      try {
        const loggedInUID = localStorage.getItem("uid");
        // Construct the updated product object
        const updatedCustomer = {
          uid: loggedInUID,
          CodeId: code.toString(),
          customerName: CustomerName,
          fullName: FullName,
          phoneNo: PhoneNo,
          email: Email,
          addressLine1: AddressLine1,
          addressLine2: AddressLine2,
          city: City,
          province: Province,
          postalCode: PostalCode,
          openingBalance: OpeningBalance,
          // Add other properties as needed
        };

        // Update the product data in Firebase
        const CustomerRef = ref(db, `Customer/${editedItem}`);
        await update(CustomerRef, updatedCustomer);

        // Show a success toast if the product is successfully added
        toast.success("Customer Edit Successfully", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        // Close the modal
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (error) {
        console.log("Error updating data:", error);
        toast.error("Error adding Customer: " + error.message, {
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
      handleInputBlur("customerName", CustomerName);
      handleInputBlur("fullName", FullName);
      handleInputBlur("phoneNo", PhoneNo);
    }
  };

  const handleInputBlur = (field, value) => {
    switch (field) {
      case "customerName":
        if (value.trim() === "") {
          setCustomerNameError("Customer Name is required");
          // toast.error('Item Name is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setCustomerNameError("");
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          setFullNameError("Full Name is required");
          // toast.error('Item Name is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setFullNameError("");
        }
        break;
      case "phoneNo":
        if (value.trim() === "") {
          setPhoneNoError("Phone No is required");
          // toast.error('Item Name is required', {
          //   position: 'top-right',
          //   autoClose: 2000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: 'light',
          // });
        } else {
          setPhoneNoError("");
        }
        break;
      default:
        break;
    }
  };

  // -------------------------Delete-----------------------------

  const [showAlert, setShowAlert] = useState(false);
  const [showOK, setShowOK] = useState(false);
  const [id, setId] = useState(null);

  const handleDelete = (id) => {
    setId(id);
    setShowAlert(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const dataRef = ref(db, `Customer/${id}`);
      await remove(dataRef);

      // Update the data state after deletion
      const updatedData = tableData.filter((item) => item.id !== id);
      setTableData(updatedData);

      setShowAlert(false);
      setShowOK(true);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowAlert(false);
  };

  const handleOK = () => {
    setShowOK(false);
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
                <h1>Customer</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddCustomers />

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
                            Code ID
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="CustomerName"
                          >
                            Customer Name
                          </th>
                          <th className="text-900 sort" data-sort="FullName">
                            Full Name
                          </th>
                          <th className="text-900 sort" data-sort="PhoneNumber">
                            Phone Number
                          </th>
                          <th className="text-900 sort" data-sort="City">
                            City
                          </th>
                          <th className="text-900 sort" data-sort="Email">
                            Email
                          </th>
                          <th className="text-900 sort" data-sort=" Balance">
                            Balance
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
                            <td className="tdchild">{item.CodeId}</td>
                            <td className="tdchild">{item.customerName}</td>
                            <td className="tdchild">{item.fullName}</td>
                            <td className="tdchild">
                              {item.phoneNo}
                            </td>
                            <td className="tdchild">
                              {item.city}
                            </td>
                            <td className="tdchild">{item.email}</td>
                            <td className="tdchild">{item.openingBalance}</td>
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

        {/* -----------------------------------Modal--------------------------------------------- */}
        {/* Modal */}
        <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <form>
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="Code"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Code"
                        id="Code"
                        value={code}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="CustomerName"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Customer Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="CustomerName"
                        id="CustomerName"
                        placeholder="Enter Customer Name"
                        value={CustomerName}
                        onBlur={() =>
                          handleInputBlur("customerName", CustomerName)
                        }
                        onFocus={() => setCustomerNameError("")}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                      {CustomerNameError && (
                        <div style={{ color: "red" }}>{CustomerNameError}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="FullName"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Full Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="FullName"
                        id="FullName"
                        placeholder="Enter Full Name"
                        value={FullName}
                        onBlur={() => handleInputBlur("fullName", FullName)}
                        onFocus={() => setFullNameError("")}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                      {FullNameError && (
                        <div style={{ color: "red" }}>{FullNameError}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="PhoneNo"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Phone No <span style={{ color: "red" }}>*</span>
                      </label>
                      {/* <input
                      type="number"
                      className="form-control"
                      name="PhoneNo"
                      id="PhoneNo"
                      placeholder="Enter Phone No"
                      value={PhoneNo}
                      onBlur={() => handleInputBlur('phoneNo', PhoneNo)}
                      onFocus={() => setPhoneNoError('')}
                      onChange={e => setPhoneNo(e.target.value)}
                    /> */}

                      <InputMask
                        value={PhoneNo}
                        className="form-control"
                        name="PhoneNo"
                        id="PhoneNo"
                        onChange={(e) => setPhoneNo(e.target.value)}
                        mask="999-9999999"
                        placeholder="+92 999-9999999"
                        onBlur={() => handleInputBlur("phoneNo", PhoneNo)}
                        onFocus={() => setPhoneNoError("")}
                      />

                      {PhoneNoError && (
                        <div style={{ color: "red" }}>{PhoneNoError}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="Email"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Email"
                        id="Email"
                        placeholder="Enter Email"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="AddressLine1"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="AddressLine1"
                        id="AddressLine1"
                        placeholder="Enter Address Line 1"
                        value={AddressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="AddressLine2"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="AddressLine2"
                        id="AddressLine2"
                        placeholder="Enter Address Line 2"
                        value={AddressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="City"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="City"
                        id="City"
                        placeholder="Enter City"
                        value={City}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="Province"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Province
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Province"
                        id="Province"
                        placeholder="Enter Province"
                        value={Province}
                        onChange={(e) => setProvince(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="PostalCode"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Postal Code
                      </label>
                      {/* <input
                      type="text"
                      className="form-control"
                      name="PostalCode"
                      id="PostalCode"
                      placeholder="Enter Postal Code"
                      value={PostalCode}
                      onChange={e => setPostalCode(e.target.value)}
                    /> */}

                      <InputMask
                        type="text"
                        className="form-control"
                        name="PostalCode"
                        id="PostalCode"
                        value={PostalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        mask="99999"
                        placeholder="Enter Postal Code"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 col-sm-12 col-lg-12">
                    <div className="mb-3">
                      <label
                        htmlFor="OpeningBalance"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Opening Balance
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="OpeningBalance"
                        id="OpeningBalance"
                        placeholder="Enter Opening Balance"
                        value={OpeningBalance}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleSaveChanges(editedItem)}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>

        <SweetAlert
          warning
          show={showAlert}
          title="Confirm Deletion"
          showCancel
          confirmBtnText="Yes, delete it!"
          confirmBtnBsStyle="danger"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          focusCancelBtn
        >
          Are you sure you want to delete this item?
        </SweetAlert>

        <SweetAlert show={showOK} success title="Deleted!" onConfirm={handleOK}>
          Your item has been deleted.
        </SweetAlert>
      </Main>
    </>
  );
}

export default Customers;
