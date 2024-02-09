import React, { useState, useEffect } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddCodeType from "./AddCodeType";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue, update } from "firebase/database";
import { db } from "../../Config/firebase";
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

function CodeType() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const productRef = ref(db, "CodeType");

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




  // -------------------------------Edit------------------------

  const [CodeType, setCodeType] = useState("");
  const [CodeTypeError, setCodeTypeError] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

const [ID, setID] = useState('')

  const handleEdit = (item) =>{
    setID(item.id);
    setCodeType(item.codeType);

    setShow(true);
  }


  const handleInputBlur = (field, value) => {
    switch (field) {
      case "codeType":
        if (value.trim() === "") {
            // setCodeTypeError("CodeType is required");
          toast.error('CodeType is required', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        } else {
          setCodeTypeError("");
        }
        break;
      default:
        break;
    }
  };


  const handleSave = async () =>{
    if (CodeType) {
      // Implement your save logic here
      console.log("Changes saved!");

      

      try {
        const loggedInUID = localStorage.getItem("uid");
        
        const newCustomer = {
          uid: loggedInUID,
          codeType: CodeType,
        };

        const CustomerRef = ref(db, `CodeType/${ID}`);
        await update(CustomerRef, newCustomer);

        // Show a success toast if the product is successfully added
        toast.success("CodeType Edit Successfully", {
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
          
          setID('');
          setCodeType("");

          handleClose();
        }, 2000);

        // handleClose(); // Close the modal after successful insert
      } catch (error) {
        toast.error("Error adding CodeType: " + error.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        console.log("Error adding CodeType:", error);
      }
    } else {
      handleInputBlur("codeType", CodeType);
    }
  }


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
                <h1>Code Type</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <div style={{ float: "right" }}>
                  <AddCodeType />

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
                          <th
                            className="text-900 sort"
                            data-sort="CodeType"
                          >
                            Code Type
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
                                 onClick={() => handleEdit(item)}
                                >
                                  Edit
                                </button>
                               
                              </div>
                            </td>
                            <td className="tdchild">{item.codeType}</td>
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
          <Modal.Title>Edit CodeType</Modal.Title>
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
                      Code Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="Code"
                      id="Code"
                      placeholder="Enter Code Type"
                      value={CodeType}
                      onBlur={() =>
                        handleInputBlur("codeType", CodeType)
                      }
                      onFocus={() => setCodeTypeError("")}
                      onChange={(e) => setCodeType(e.target.value)}
                    />
                    {CodeTypeError && (
                      <div style={{ color: "red" }}>{CodeTypeError}</div>
                    )}
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



      </Main>
    </>
  );
}

export default CodeType;
