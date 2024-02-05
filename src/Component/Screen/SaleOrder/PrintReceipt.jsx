import React, { useState, useEffect, useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { ref, onValue, update, remove, get } from "firebase/database";
import { db } from "../../Config/firebase";

import "./Receipt.css";

function PrintReceipt() {
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

  //   const openPrintWindow = useReactToPrint({
  //         content: () => componentRef.current,
  //         documentTitle: "Print Receipt",
  //         onBeforeGetContent: () => {
  //           // Set showPrintWindow to true before getting content
  //           setPrint(true);
  //         },
  //         onAfterPrint: () => {
  //           // Set showPrintWindow to false after printing
  //           setPrint(true);
  //           alert("Print Success");
  //         },
  //     });

  localStorage.getItem("ID");
  const Customer = localStorage.getItem("Customer");
  const InvoiceDate = localStorage.getItem("InvoiceDate");

  return (
    <>
      <div className="container" id="tableId" ref={componentRef}>
        <div className="receipt_header">
          <h1>
            Receipt of Sale <span>Shop Name</span>
          </h1>
          <h2>
            Address: Lorem Ipsum, 1234-5 <span>Tel: +1 012 345 67 89</span>
          </h2>
        </div>

        <div className="receipt_body">
          <div className="date_time_con">
            <h5 style={{ fontSize: "18px" }}>Customer: </h5>
            <h5 style={{ fontSize: "18px" }}>{Customer}</h5>
          </div>

          <div className="date_time_con">
            <h5 style={{ fontSize: "15px" }}>Invoice Date: </h5>
            <h5 style={{ fontSize: "15px" }}>{InvoiceDate}</h5>
          </div>

          <div className="date_time_con">
            <h5 style={{ fontSize: "15px" }}>Invoice No: </h5>
            <h5 style={{ fontSize: "15px" }}>1</h5>
          </div>

          <div className="items">
            <table>
              <thead>
                <th style={{ paddingLeft: "10px", width: "180px" }}>
                  ITEM NAME
                </th>
                <th style={{ width: "80px" }}>QTY</th>
                <th style={{ width: "80px" }}>PRICE</th>
                <th style={{ paddingRight: "10px", width: "80px" }}>TOTAL</th>
              </thead>

              <tbody>
                {sortedDataDescending.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        borderBottom: "1px dashed #000",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                        fontSize:'14px'
                      }}
                    >
                      {item.itemName}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px dashed #000",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                      }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px dashed #000",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                      }}
                    >{`Rs: ${item.salePrice}`}</td>
                    <td
                      style={{
                        borderBottom: "1px dashed #000",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                      }}
                    >{`Rs: ${item.totalPrice}`}</td>
                  </tr>
                ))}
                
              </tbody>

              <tfoot>
                <tr>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td>RS:2,500</td>
                </tr>

                <tr>
                  <td>TransPort Charges</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td>Labour Charges</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td>Discount</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>

                <tr>
                  <td>Grand Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <h3 className="h3">Thank You!</h3>
      </div>
    </>
  );
}

export default PrintReceipt;
