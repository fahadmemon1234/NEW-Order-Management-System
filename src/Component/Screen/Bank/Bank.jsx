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
import AddBank from "./AddBank";
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

function Banks() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const productRef = ref(db, "Bank");

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

  const [BankName, setBankName] = useState("");
  const [BankNameError, setBankNameError] = useState("");
  const [BankTitle, setBankTitle] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");
  const [OpeningBalanceError, setOpeningBalanceError] = useState("");
  const [OpeningBalanceDate, setOpeningBalanceDate] = useState("");
  const [OpeningBalanceDateError, setOpeningBalanceDateError] = useState("");
  const [BankAccountNo, setBankAccountNo] = useState("");
  const [BankAddress, setBankAddress] = useState("");
  const [BranchName, setBranchName] = useState("");

  const [editedItem, setEditedItem] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    setEditedItem(item.id);
    setBankName(item.bankName);
    setBankTitle(item.bankTitle);
    setOpeningBalance(item.openingBalance);
    setOpeningBalanceDate(item.openingBalanceDate);
    setBankAccountNo(item.bankAccountNumber);
    setBankAddress(item.bankAddress);
    setBranchName(item.branchName);

    setShow(true); // Store the editing item's ID in state
  };

  // Auto Genrate ID
  const [lastId, setLastId] = useState(0);

  // Function to generate a new auto-incremented ID
  const generateId = () => {
    const newId = lastId + 1;
    setLastId(newId);
    return newId;
  };

  const handleSaveChanges = async () => {
    debugger;
    if (BankName && OpeningBalance && OpeningBalanceDate) {
      // Implement your save logic here
      console.log("Changes saved!");
      try {
        const openingBalanceNumeric = parseFloat(OpeningBalance);
        const loggedInUID = localStorage.getItem("uid");
        const newAutoId = generateId();
        // Construct the updated product object
        const updatedBank = {
          uid: loggedInUID,
          bankId: newAutoId,
          bankName: BankName,
          bankTitle: BankTitle,
          openingBalance: openingBalanceNumeric,
          openingBalanceDate: OpeningBalanceDate,
          bankAccountNumber: BankAccountNo,
          bankAddress: BankAddress,
          branchName: BranchName,

          // Add other properties as needed
        };

        // Update the product data in Firebase
        const BankRef = ref(db, `Bank/${editedItem}`);
        await update(BankRef, updatedBank);

        // Show a success toast if the product is successfully added
        toast.success("Bank Edit Successfully", {
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
        console.error("Error updating data:", error);
        toast.error("Error adding Bank: " + error.message, {
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
      handleInputBlur("bankName", BankName);
      handleInputBlur("openingBalance", OpeningBalance);
      handleInputBlur("openingBalanceDate", OpeningBalanceDate);
    }
  };

  const handleInputBlur = (field, value) => {
    switch (field) {
      case "bankName":
        if (value.trim() === "") {
          setBankNameError("Bank Name is required");
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
          setBankNameError("");
        }
        break;
      case "openingBalance":
        if (value.trim() === "") {
          setOpeningBalanceError("Opening Balance is required");
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
          setOpeningBalanceError("");
        }
        break;
      case "openingBalanceDate":
        if (value.trim() === "") {
          setOpeningBalanceDateError("Opening Balance Date is required");
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
          setOpeningBalanceDateError("");
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
      const dataRef = ref(db, `Bank/${id}`);
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
                <h1>Banks</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddBank />

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
                          <th className="text-900 sort" data-sort="BankName">
                            Bank Name
                          </th>
                          <th className="text-900 sort" data-sort="BankTitle">
                            Bank Title
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="OpeningBalance"
                          >
                            Opening Balance
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="OpeningBalanceDate"
                          >
                            Opening Balance Date
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="BankAccountNumber"
                          >
                            Bank Account Number
                          </th>
                          <th className="text-900 sort" data-sort="BankAddress">
                            Bank Address
                          </th>
                          <th className="text-900 sort" data-sort=" BranchName">
                            Branch Name
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
                            <td className="tdchild">{item.bankName}</td>
                            <td className="tdchild">{item.bankTitle}</td>
                            <td className="tdchild">{item.openingBalance}</td>
                            <td className="tdchild">
                              {item.openingBalanceDate}
                            </td>
                            <td className="tdchild">
                              {item.bankAccountNumber}
                            </td>
                            <td className="tdchild">{item.bankAddress}</td>
                            <td className="tdchild">{item.branchName}</td>
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
        <Modal
          show={show}
          onHide={handleClose}
          dialogClassName="custom-modal"
          style={{ paddingTop: "3%" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Bank</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="container">
              <form>
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="BankName"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Bank Name <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="BankName"
                        id="BankName"
                        placeholder="Enter Bank Name"
                        value={BankName}
                        onBlur={() => handleInputBlur("bankName", BankName)}
                        onFocus={() => setBankNameError("")}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                      {BankNameError && (
                        <div style={{ color: "red" }}>{BankNameError}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="BankTitle"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Bank Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="BankTitle"
                        id="BankTitle"
                        placeholder="Enter Bank Title"
                        value={BankTitle}
                        onChange={(e) => setBankTitle(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="BankAccountNumber"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Bank Account Number
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="BankAccountNumber"
                        id="BankAccountNumber"
                        placeholder="Enter Bank Account Number"
                        value={BankAccountNo}
                        onChange={(e) => setBankAccountNo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="BankAddress"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Bank Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="BankAddress"
                        id="BankAddress"
                        placeholder="Enter Bank Address"
                        value={BankAddress}
                        onChange={(e) => setBankAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="OpeningBalance"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Opening Balance <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="OpeningBalance"
                        id="OpeningBalance"
                        placeholder="Enter Opening Balance"
                        value={OpeningBalance}
                        onBlur={() =>
                          handleInputBlur("openingBalance", OpeningBalance)
                        }
                        onFocus={() => setOpeningBalanceError("")}
                        onChange={(e) => setOpeningBalance(e.target.value)}
                      />
                      {OpeningBalanceError && (
                        <div style={{ color: "red" }}>
                          {OpeningBalanceError}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6 col-lg-6">
                    <div className="mb-3">
                      <label
                        htmlFor="OpeningBalanceDate"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Opening Balance Date{" "}
                        <span style={{ color: "red" }}>*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        name="OpeningBalanceDate"
                        id="OpeningBalanceDate"
                        placeholder="Enter Opening Balance Date"
                        value={OpeningBalanceDate}
                        onBlur={() =>
                          handleInputBlur(
                            "openingBalanceDate",
                            OpeningBalanceDate
                          )
                        }
                        onFocus={() => setOpeningBalanceDateError("")}
                        onChange={(e) => setOpeningBalanceDate(e.target.value)}
                      />
                      {OpeningBalanceDateError && (
                        <div style={{ color: "red" }}>
                          {OpeningBalanceDateError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 col-sm-12 col-lg-12">
                    <div className="mb-3">
                      <label
                        htmlFor="BranchName"
                        className="form-label"
                        style={{ color: "black" }}
                      >
                        Branch Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="BranchName"
                        id="BranchName"
                        placeholder="Enter Branch Name"
                        value={BranchName}
                        onChange={(e) => setBranchName(e.target.value)}
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
            <Button variant="primary" onClick={handleSaveChanges}>
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

export default Banks;
