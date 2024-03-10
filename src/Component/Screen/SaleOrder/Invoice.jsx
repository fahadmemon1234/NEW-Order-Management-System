import React, { useState, useEffect, useRef } from "react";

import { ref, onValue } from "firebase/database";
import { db } from "../../Config/firebase";

import Logo from "../../../assets/img/Fahad-logo-designnew.png";

function Invoice() {
  const [tableData, setTableData] = useState([]);

  const loggedInUID = localStorage.getItem("uid");
  const SaleID = localStorage.getItem("ID");

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const DepositRef = ref(db, "SaleOrderItem");

      // Attach an event listener for data changes
      const fetchData = async () => {
        onValue(DepositRef, (snapshot) => {
          debugger;
          const data = snapshot.val();
          if (data) {
            // Convert the object of products into an array
            const dataArray = Object.keys(data)
              .filter(
                (key) =>
                  data[key].uid === loggedInUID &&
                  data[key].saleOrderID === SaleID
              ) // Filter data based on UID
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
  }, [loggedInUID, SaleID]);

  const sortedTableData = tableData.sort((a, b) => b.id - a.id);
  const sortedDataDescending = [...sortedTableData].sort((a, b) =>
    b.id.localeCompare(a.id)
  );

  const componentRef = useRef();

  localStorage.getItem("ID");
  const Customer = localStorage.getItem("Customer");
  const InvoiceDate = localStorage.getItem("InvoiceDate");
  const TotalAmount = localStorage.getItem("TotalAmount");
  const Status = localStorage.getItem("Status");

  return (
    <>
      <div className="container-fluid">
        <div id="invoiceCard" class="card">
          <div class="card-body">
            <div class="row align-items-center text-center mb-3">
              <div class="col-sm-6 text-sm-start">
                <img src={Logo} alt="invoice" width="150" />
              </div>
              <div class="col text-sm-end mt-3 mt-sm-0">
                <h2 class="mb-3">Invoice</h2>
                <h5>Fahad Graphic & Developer</h5>
                <p class="fs-10 mb-0">
                 <strong>Email:</strong> fahadmemon131@gmail.com
                  <br />
                 <strong>Phone:</strong> +92 315-32668177
                </p>
              </div>
              <div class="col-12">
                <hr />
              </div>
            </div>
            <div class="row align-items-center">
              <div class="col">
                <h6 class="text-500">Invoice to</h6>
                <h5>{Customer}</h5>
                <p class="fs-10">
                  <strong>Status:</strong> {Status}
                </p>
              </div>
              <div class="col-sm-auto ms-auto">
                <div class="table-responsive">
                  <table class="table table-sm table-borderless fs-10">
                    <tbody>
                      <tr>
                        <th class="text-sm-end">Invoice No:</th>
                        <td>14</td>
                      </tr>
                      <tr>
                        <th class="text-sm-end">Order Number:</th>
                        <td>AD20294</td>
                      </tr>
                      <tr>
                        <th class="text-sm-end">Sale Date:</th>
                        <td>{InvoiceDate}</td>
                      </tr>
                      {/* <tr>
                        <th class="text-sm-end">Payment Due:</th>
                        <td>Upon receipt</td>
                      </tr> */}
                      {/* <tr class="alert alert-success fw-bold">
                        <th class="text-success-emphasis text-sm-end">
                          Amount Due:
                        </th>
                        <td class="text-success-emphasis">$19688.40</td>
                      </tr> */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="table-responsive scrollbar mt-4 fs-10">
              <table
                class="table table-striped border-bottom"
                ref={componentRef}
              >
                <thead data-bs-theme="light">
                  <tr class="bg-primary dark__bg-1000">
                    <th class="text-white border-0">Products</th>
                    <th class="text-white border-0 text-center">Quantity</th>
                    <th class="text-white border-0 text-end">Price</th>
                    <th class="text-white border-0 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDataDescending.map((item, index) => (
                    <>
                      <tr key={index}>
                        <td class="align-middle">
                          <h6 class="mb-0 text-nowrap">
                            {item.itemName}
                          </h6>
                        </td>
                        <td class="align-middle text-center">{item.quantity}</td>
                        <td class="align-middle text-end">{item.salePrice}</td>
                        <td class="align-middle text-end">{item.totalPrice}</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <div class="row justify-content-end">
              <div class="col-auto">
                <table class="table table-sm table-borderless fs-10 text-end">
                  <tbody>
                    <tr>
                      <th class="text-900">Subtotal:</th>
                      <td class="fw-semi-bold">$18,230.00 </td>
                    </tr>
                    <tr>
                      <th class="text-900">Tax 8%:</th>
                      <td class="fw-semi-bold">$1458.40</td>
                    </tr>
                    <tr class="border-top">
                      <th class="text-900">Total:</th>
                      <td class="fw-semi-bold">$19688.40</td>
                    </tr>
                    <tr class="border-top border-top-2 fw-bolder">
                      <th class="text-900">Amount Due:</th>
                      <td class="text-900">$19688.40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Invoice;
