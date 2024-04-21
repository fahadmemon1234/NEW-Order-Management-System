import React, { useState, useEffect } from "react";

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import InputMask from "react-input-mask";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, push, get } from "firebase/database";
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

const AddVendor = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const randomNumber = Math.floor(Math.random() * 100000);
  const [code, setCode] = useState(randomNumber);

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


  const handleSaveChanges = async () => {
    try {
      if (VendorName && FirstName && Phone) {
        const loggedInUID = localStorage.getItem("uid");


        const vendorsRef = ref(db, "Vendor");
        const newVendor = {
          uid: loggedInUID,
          Code: code,
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
        push(vendorsRef, newVendor);

        toast.success("Vendor Added Successfully", {
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
        Add Vendor
      </button>

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
    </>
  );
};

export default AddVendor;
