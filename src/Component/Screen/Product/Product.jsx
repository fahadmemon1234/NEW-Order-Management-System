import React, { useEffect, useState } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddProduct from "./AddProduct";
// --------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, onValue } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

//Modal Css
// ---------------------------------------------------
import "../../../assets/Css/Model.css";
// ----------------------------------------------------

function Product() {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Reference to the 'Posting' node in Firebase Realtime Database
    const tasksRef = ref(db, "Product");

    // Attach an event listener for data changes
    const fetchData = () => {
      onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert the object of tasks into an array
          const dataArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setTableData(dataArray);
        }
      });
    };

    fetchData();
  }, []);

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
  const totalItems = 8; // Replace with the actual total number of items
  const startIndexs = 1;
  const endIndexs = Math.min(startIndexs + rowsToShow - 1, totalItems);
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

  return (
    <>
      <Main>
        <div className="card">
          <div className="card-body">
            {/* Headng and btn */}
            <div
              className="row"
              style={{ paddingTop: "30px", alignItems: "center" }}
            >
              <div className="col-md-6 col-sm-6 col-lg-6">
                <h1>Product List</h1>
              </div>

              <div className="col-md-6 col-sm-6 col-lg-6">
                <AddProduct />
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
                          <th className="text-900 sort" data-sort="ItemName">
                            Item Name
                          </th>
                          <th
                            className="text-900 sort"
                            data-sort="ItemQuantity"
                          >
                            Item Quantity
                          </th>
                          <th className="text-900 sort" data-sort="ItemCost">
                            Item Cost
                          </th>
                          <th className="text-900 sort" data-sort="SalePrice">
                            Sale Price
                          </th>
                          <th className="text-900 sort" data-sort="Measurement">
                            Measurement
                          </th>
                          <th className="text-900 sort" data-sort="BrandName">
                            Brand Name
                          </th>
                          <th className="text-900 sort" data-sort="TotalPrice">
                            Total Price
                          </th>
                          <th className="text-900 sort" data-sort="Description">
                            Description
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
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                            <td className="tdchild">{item.itemName}</td>
                            <td className="tdchild">{item.itemQty}</td>
                            <td className="tdchild">{item.itemCost}</td>
                            <td className="tdchild">{item.sellPrice}</td>
                            <td className="tdchild">{item.measurement}</td>
                            <td className="tdchild">{item.brandCode}</td>
                            <td className="tdchild">{item.total}</td>
                            <td className="tdchild">{item.description}</td>
                            {/* Add more table data cells as needed */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="row align-items-center mt-3">
                    <div className="pagination d-none"></div>
                    <div className="col">
                      <div className="d-flex align-items-center fs--1" style={{fontSize:'14px'}}>
                        <p className="mb-0">
                          <span className="d-none d-sm-inline-block me-2">
                            {paginationText}
                          </span>
                        </p>
                        <p className="mb-0 mx-2">Rows per page:</p>
                        <select
                          className="w-auto form-select form-select-sm"
                          value={rowsToShow}
                          onChange={handleSelectChange}
                        >
                          <option value="5" selected="">
                            5
                          </option>
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
  );
}

export default Product;
