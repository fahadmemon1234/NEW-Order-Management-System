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
import Modal from "react-bootstrap/Modal";
// ---------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

//Modal Css
// ---------------------------------------------------
import "../../../assets/Css/Model.css";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddCode from "./AddCode";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update, remove } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

function Code() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const CodeTypeName = searchParams.get("CodeName");

  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");
  useEffect(() => {
    if (loggedInUID) {
      
      // Reference to the 'Product' node in Firebase Realtime Database
      const productRef = ref(db, `${CodeTypeName}`);

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


// ---------------------Edit--------------------

const [Code, setCode] = useState("");
  const [CodeError, setCodeError] = useState("");

  const [IsActive, setIsActive] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const [ID, setID] = useState('');

const handleEdit = (item) =>{
  setID(item.id);
setCode(item.codeValue);
setIsActive(item.isActive);

  setShow(true);
}



const handleInputBlur = (field, value) => {
  switch (field) {
    case "code":
      if (value.trim() === "") {
        // setCodeTypeError("CodeType is required");
        toast.error(`${CodeTypeName} is required`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        setCodeError("");
      }
      break;
    default:
      break;
  }
};

const handleSave = async () =>{
  if (Code) {
    // Implement your save logic here
    console.log("Changes saved!");

    try {
      const loggedInUID = localStorage.getItem("uid");
     
      const newCustomer = {
        uid: loggedInUID,
        codeValue: Code,
        isActive: IsActive,
      };
      const CustomerRef = ref(db, `${CodeTypeName}/${ID}`);
      await update(CustomerRef, newCustomer);


      // Show a success toast if the product is successfully added
      toast.success(`${CodeTypeName} Edit Successfully`, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setTimeout(() => {
        handleClose();

        setCode("");
        setID('');
        setIsActive(false);
      }, 2000);

      // handleClose(); // Close the modal after successful insert
    } catch (error) {
      toast.error(`${CodeTypeName} Error adding: ` + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log(`Error adding ${CodeTypeName}:`, error);
    }
  } else {
    handleInputBlur("code", Code);
  }
}


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
    const dataRef = ref(db, `${CodeTypeName}/${id}`);
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


      <Main>
        <div className="card">
          <div className="card-body">
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>{CodeTypeName}</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddCode />

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
                          <th className="text-900 sort" data-sort="CodeValue">
                            Code Value
                          </th>
                          <th className="text-900 sort" data-sort="IsActive">
                            IsActive
                          </th>
                        </tr>
                      </thead>
                      <tbody className="list">
                        {visibleItems.slice(0, rowsToShow).map((item) => (
                          <tr key={item.id}>
                            <td style={{width:'19%'}}>
                              <div style={{ display: "flex" }}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{ marginRight: "10px" }}
                                  onClick={()=>handleEdit(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={()=>handleDelete(item.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                            <td className="tdchild">{item.codeValue}</td>
                            <td className="tdchild">
                              <div class="form-check form-check-inline">
                                <input
                                  class="form-check-input"
                                  id="inlineCheckbox1"
                                  type="checkbox"
                                  checked={item.isActive}
                                />
                              </div>
                            </td>
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
        dialogClassName="small-Model"
        // style={{ paddingTop: "3%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit {CodeTypeName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <div className="row">
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="Code"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Code Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="Code"
                      id="Code"
                      placeholder="Enter Code Value"
                      value={Code}
                      onBlur={() => handleInputBlur("code", Code)}
                      onFocus={() => setCodeError("")}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    {CodeError && (
                      <div style={{ color: "red" }}>{CodeError}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div className="mb-3">
                    <label
                      htmlFor="Code"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      IsActive
                    </label>
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        id="flexSwitchCheckDefault"
                        type="checkbox"
                        checked={IsActive} // add checked attribute to reflect the state of isActive
                        onChange={() => setIsActive(!IsActive)}
                      />
                    </div>
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
          <Button variant="primary" onClick={handleSave}>
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

export default Code;
