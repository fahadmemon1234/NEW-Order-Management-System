import React, { useState } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputMask from "react-input-mask";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, push } from "firebase/database";
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

function AddCustomers() {
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

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setCustomerName("");
    setFullName("");
    setPhoneNo("");
    setEmail("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setOpeningBalance("");

    setShow(true); // Store the editing item's ID in state
  };

  const handleSaveChanges = () => {
    try {
      if (CustomerName && FullName && PhoneNo) {
        // Implement your save logic here
        console.log("Changes saved!");

        const randomNumber = Math.floor(Math.random() * 100000); // Example: Generate a random number
        setCode(randomNumber.toString());

        const loggedInUID = localStorage.getItem("uid");
        const CustomerRef = ref(db, "Customer");
        const newCustomer = {
          uid: loggedInUID,
          CodeId: code.toString(),
          customerName: CustomerName,
          fullName: FullName,
          phoneNo: "+92 " + PhoneNo,
          email: Email,
          addressLine1: AddressLine1,
          addressLine2: AddressLine2,
          city: City,
          province: Province,
          postalCode: PostalCode,
          openingBalance: OpeningBalance,
        };
        push(CustomerRef, newCustomer);

        // Show a success toast if the product is successfully added
        toast.success("Customer Added Successfully", {
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
          setCustomerName("");
          setFullName("");
          setPhoneNo("");
          setEmail("");
          setAddressLine1("");
          setAddressLine2("");
          setCity("");
          setProvince("");
          setPostalCode("");
          setOpeningBalance("");
        }, 2000);

        // handleClose(); // Close the modal after successful insert
      } else if (!CustomerName) {
        toast.error("Customer Name is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!FullName) {
        toast.error("Full Name is required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else if (!PhoneNo) {
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
      }
    } catch (error) {
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

      console.log("Error adding Customer:", error);
    }
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

      <button
        className="btn btn-primary"
        type="button"
        onClick={handleShow}
        style={{ float: "right" }}
      >
        Add Customer
      </button>

      {/* -----------------------------------Modal--------------------------------------------- */}
      {/* Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal"
        // style={{ paddingTop: "3%" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
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
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
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
                      onChange={(e) => setFullName(e.target.value)}
                    />
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

                    <InputMask
                      value={PhoneNo}
                      className="form-control"
                      name="PhoneNo"
                      id="PhoneNo"
                      onChange={(e) => setPhoneNo(e.target.value)}
                      mask="999-9999999"
                      placeholder="+92 999-9999999"
                    />
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
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCustomers;
