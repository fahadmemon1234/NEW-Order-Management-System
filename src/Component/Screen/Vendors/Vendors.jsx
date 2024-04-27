import React, { useEffect, useState } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import InputMask from "react-input-mask";
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
import { ref, onValue, update, remove } from "firebase/database";
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

  // const startIndex = (currentPage - 1) * rowsToShow;
  // const endIndex = Math.min(
  //   startIndex + rowsToShow,
  //   sortedDataDescending.length
  // );
  // const visibleItems = sortedDataDescending.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedDataDescending.length / rowsToShow);

  // ------------------------------ Populate ---------------------------

  const [code, setCode] = useState("");

  const [VendorName, setVendorName] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Phone, setPhone] = useState("");
  const [Email, setEmail] = useState("");
  const [AddressLine1, setAddressLine1] = useState("");
  const [AddressLine2, setAddressLine2] = useState("");
  const [City, setCity] = useState("");
  const [Province, setProvince] = useState("");
  const [PostalCode, setPostalCode] = useState("");
  const [OpeningBalance, setOpeningBalance] = useState("");

  const [hdnEditID, sethdnEditID] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (item) => {
    sethdnEditID(item.id);
    setCode(item.Code);
    setVendorName(item.vendorName);
    setFirstName(item.firstName);
    setLastName(item.lastName);
    setPhone(item.phoneNo);
    setEmail(item.email);
    setAddressLine1(item.addressLine1);
    setAddressLine2(item.addressLine2);
    setCity(item.city);
    setProvince(item.province);
    setPostalCode(item.postalCode);
    setOpeningBalance(item.openingBalance);

    setShow(true);
  };

  // ----------------------- Edit ------------------------

  const handleSaveChanges = async () => {
    try {
      if (VendorName && FirstName && Phone) {
        const updateVendor = {
          vendorName: VendorName,
          firstName: FirstName,
          lastName: LastName,
          phoneNo: Phone,
          email: Email,
          addressLine1: AddressLine1,
          addressLine2: AddressLine2,
          city: City,
          province: Province,
          postalCode: PostalCode,
          openingBalance: OpeningBalance,
        };

        const VendorRef = ref(db, `Vendor/${hdnEditID}`);
        await update(VendorRef, updateVendor);

        toast.success("Vendor Edit Successfully", {
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
          setVendorName("");
          setFirstName("");
          setLastName("");
          setAddressLine1("");
          setAddressLine2("");
          setCity("");
          setProvince("");
          setPhone("");
          setEmail("");
          setPostalCode("");
          setOpeningBalance("");
        }, 2000);
      } else if (!VendorName) {
        toast.error("Vendor Name is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!FirstName) {
        toast.error("First Name is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!Phone) {
        toast.error("Phone No is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Unexpected error occurred", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Error adding vendor: " + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Error adding vendor:", error);
    }
  };


   // ----------------------- Delete ------------------------

   const [showAlert, setShowAlert] = useState(false);
   const [showOK, setShowOK] = useState(false);
   const [id, setId] = useState(null);


   const handleDelete = async (id) =>{
    setId(id);
    setShowAlert(true);
   }


   const handleConfirmDelete = async () => {
    try {
      const dataRef = ref(db, `Vendor/${id}`);
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
                          <th className="text-900 sort" data-sort="Phone">
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
                            <td className="tdchild">{item.vendorName}</td>
                            <td className="tdchild">+92 {item.phoneNo}</td>
                            <td className="tdchild">{item.email}</td>
                            <td className="tdchild">{item.city}</td>
                            <td className="tdchild">{item.addressLine1}</td>
                            <td className="tdchild">
                              Rs: {item.openingBalance}
                            </td>
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

      {/* ----------------------------Modal------------------------------------ */}

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Add Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <form>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="code"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Code
                      {/* <span style={{ color: "red" }}>*</span> */}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtcode"
                      value={code}
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="vendorName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Vendor Name
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtvendorName"
                      value={VendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="Enter Company Name"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="firstName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      First Name
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtfirstName"
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="lastName"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtlastName"
                      value={LastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="phone"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Phone
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <InputMask
                      value={Phone}
                      className="form-control"
                      name="PhoneNo"
                      id="txtphone"
                      onChange={(e) => setPhone(e.target.value)}
                      mask="999-9999999"
                      placeholder="+92 999-9999999"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="txtemail"
                      value={Email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Email"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
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
                      id="txtAddressLine1"
                      value={AddressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Enter Address Line 1"
                    />
                  </div>
                </div>

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
                      id="txtAddressLine2"
                      value={AddressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Enter Address Line 2"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="city"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      City
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="txtCity"
                      value={City}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter City"
                    />
                  </div>
                </div>

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
                      id="txtProvince"
                      value={Province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="Enter Province"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="PostalCode"
                      className="form-label"
                      style={{ color: "black" }}
                    >
                      Postal Code
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="txtPostalCode"
                      value={PostalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Enter Postal Code"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-sm-6 col-lg-6">
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
                      id="txtOpeningBalance"
                      value={OpeningBalance}
                      onChange={(e) => setOpeningBalance(e.target.value)}
                      placeholder="Enter Opening Balance"
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
    </>
  );
};

export default Vendors;
