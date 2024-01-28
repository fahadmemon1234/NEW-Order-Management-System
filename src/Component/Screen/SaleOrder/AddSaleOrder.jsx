import React, { useState, useEffect } from "react";

// Main Page Connect
// ---------------------------------------------------
import Main from "../../NavBar/Navbar";
// ---------------------------------------------------

// Bootstrap Modal
// ---------------------------------------------------
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import SweetAlert from "react-bootstrap-sweetalert";
import Select from "react-select";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
// ---------------------------------------------------

//DataBase
// ---------------------------------------------------
import { ref, get, onValue, update, remove, push } from "firebase/database";
import { db } from "../../Config/firebase";
// ---------------------------------------------------

// Add Modal
// ---------------------------------------------------
import AddCustModal from "./AddCustModal";
import AddProductModal from "./AddProduct";
// --------------------------------------------------

//Notify
// ---------------------------------------------------
import { toast, ToastContainer } from "react-toastify";
import "../../../assets/Css/Tostify.css";
// ---------------------------------------------------

function AddSaleOrder() {
  const [AddItemSection, setAddItemSection] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("rdoCash");

  const [isSaveOrderVisible, setSaveOrderVisible] = useState(true);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const [customerName, setCustomerName] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const loggedInUID = localStorage.getItem("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (loggedInUID) {
          const dataRef = ref(db, "Customer");
          const snapshot = await get(dataRef);

          if (snapshot.exists()) {
            const data = snapshot.val();

            // Filter data based on the loggedInUID
            const filteredData = Object.keys(data)
              .filter((key) => data[key].uid === loggedInUID)
              .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
              }, {});

            // Convert the filtered data object into an array of options
            const options = Object.keys(filteredData).map((key) => ({
              value: key,
              label: filteredData[key].customerName,
            }));

            // Add the "Select Customer" option to the beginning of the array
            setCustomerName([
              {
                value: "0",
                label: "Select Customer",
                disabled: true,
                selected: true,
              },
              ...options,
            ]);
          } else {
            console.error("Data doesn't exist in the 'Customer' node.");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [db, loggedInUID]);

  // Get the current date in the format "YYYY-MM-DD"
  const currentDate = new Date().toISOString().split("T")[0];

  // Initialize the state with the current date
  const [orderDate, setOrderDate] = useState(currentDate);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #ccc",
      borderRadius: "4px",
      minHeight: "38px",
    }),
  };

  const [CounterSale, setCounterSale] = useState("Counter Sale");
  const [Name, setName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");

  const [SalesMan, setSalesMan] = useState("Zohaib Memon");

  const [orderId, setId] = useState("");

  const [isDisabled, setIsDisabled] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(true);

  const handleSaveOrder = () => {
    debugger;
    try {
      const loggedInUID = localStorage.getItem("uid");

      if (paymentMethod === "rdoCash") {
        debugger;
        const SaleOrderRef = ref(db, "SaleOrder");
        const newSaleOrder = {
          uid: loggedInUID,
          customer: CounterSale,
          status: "New",
          orderDate: orderDate,
          name: Name,
          phoneNumber: PhoneNumber,
          paymentMethod: "rdoCash",
        };
        const newSaleOrderRef = push(SaleOrderRef, newSaleOrder);
        // Get the ID (key) of the newly pushed SaleOrder
        const newSaleOrderId = newSaleOrderRef.key;
        setId(newSaleOrderId);
        localStorage.setItem("ID", newSaleOrderId);
        setCounterSale(newSaleOrder.customer);
        localStorage.setItem("customer", newSaleOrder.customer);
        setOrderDate(newSaleOrder.orderDate);
        localStorage.setItem("orderDate", newSaleOrder.orderDate);
        setName(newSaleOrder.name);
        localStorage.setItem("name", newSaleOrder.name);
        setPhoneNumber(newSaleOrder.phoneNumber);
        localStorage.setItem("phoneNumber", newSaleOrder.phoneNumber);
        setPaymentMethod(newSaleOrder.paymentMethod);
        localStorage.setItem("paymentMethod", newSaleOrder.paymentMethod);
        setIsDisabled(false);
        setIsReadOnly(false);
      } else if (paymentMethod === "rdoCredit") {
        const SaleOrderRef = ref(db, "SaleOrder");
        const newSaleOrder = {
          uid: loggedInUID,
          customer: selectedCustomer.label,
          orderDate: orderDate,
          status: "New",
          salesMan: SalesMan,
          paymentMethod: "rdoCredit",
        };
        const newSaleOrderRef = push(SaleOrderRef, newSaleOrder);
        const newSaleOrderId = newSaleOrderRef.key;
        setId(newSaleOrderId);
        localStorage.setItem("ID", newSaleOrderId);
        setCustomerName(newSaleOrder.customer);
        localStorage.setItem("customer", newSaleOrder.customer);
        setOrderDate(newSaleOrder.orderDate);
        localStorage.setItem("orderDate", newSaleOrder.orderDate);
        setSalesMan(newSaleOrder.salesMan);
        localStorage.setItem("salesMan", newSaleOrder.salesMan);
        setPaymentMethod(newSaleOrder.paymentMethod);
        localStorage.setItem("paymentMethod", newSaleOrder.paymentMethod);
        setIsDisabled(false);
        setIsReadOnly(false);
      } else {
        const SaleOrderRef = ref(db, "SaleOrder");
        const newSaleOrder = {
          uid: loggedInUID,
          customer: selectedCustomer.label,
          orderDate: orderDate,
          name: Name,
          status: "New",
          paymentMethod: "rdoCashCredit",
          phoneNumber: PhoneNumber,
        };
        const newSaleOrderRef = push(SaleOrderRef, newSaleOrder);
        const newSaleOrderId = newSaleOrderRef.key;
        setId(newSaleOrderId);
        localStorage.setItem("ID", newSaleOrderId);
        setCustomerName(newSaleOrder.customer);
        localStorage.setItem("customer", newSaleOrder.customer);
        setOrderDate(newSaleOrder.orderDate);
        localStorage.setItem("orderDate", newSaleOrder.orderDate);
        setName(newSaleOrder.name);
        localStorage.setItem("name", newSaleOrder.name);
        setPhoneNumber(newSaleOrder.phoneNumber);
        localStorage.setItem("phoneNumber", newSaleOrder.phoneNumber);
        setPaymentMethod(newSaleOrder.paymentMethod);
        localStorage.setItem("paymentMethod", newSaleOrder.paymentMethod);
        setIsDisabled(false);
        setIsReadOnly(false);
      }

      toast.success("Sale Order Added Successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setSaveOrderVisible(false);

      // Save the state in local storage
      localStorage.setItem("isSaveOrderVisible", "false");
    } catch (error) {
      toast.error("Error adding SaleOrder: " + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Error adding SaleOrder:", error);
    }
  };

  const handleUpdateOrder = () => {
    debugger;
    try {
      const loggedInUID = localStorage.getItem("uid");

      if (paymentMethod === "rdoCash") {
        const newSaleOrder = {
          uid: loggedInUID,
          customer: CounterSale,
          orderDate: orderDate,
          name: Name,
          phoneNumber: PhoneNumber,
          paymentMethod: "rdoCash",
        };
        const SaleOrderRef = ref(db, `SaleOrder/${orderId}`);
        const newSaleOrderRef = update(SaleOrderRef, newSaleOrder);
        // Get the ID (key) of the newly pushed SaleOrder

        setCounterSale(newSaleOrder.customer);
        setOrderDate(newSaleOrder.orderDate);
        setName(newSaleOrder.name);
        setPhoneNumber(newSaleOrder.phoneNumber);
        setPaymentMethod(newSaleOrder.paymentMethod);
      } else if (paymentMethod === "rdoCredit") {
        const newSaleOrder = {
          uid: loggedInUID,
          customer: selectedCustomer.label,
          orderDate: orderDate,
          salesMan: SalesMan,
          paymentMethod: "rdoCredit",
        };
        const SaleOrderRef = ref(db, `SaleOrder/${orderId}`);
        const newSaleOrderRef = update(SaleOrderRef, newSaleOrder);

        setCustomerName(newSaleOrder.customer);
        setOrderDate(newSaleOrder.orderDate);
        setSalesMan(newSaleOrder.salesMan);
        setPaymentMethod(newSaleOrder.paymentMethod);
      } else {
        const newSaleOrder = {
          uid: loggedInUID,
          customer: selectedCustomer.label,
          orderDate: orderDate,
          name: Name,
          paymentMethod: "rdoCashCredit",
          phoneNumber: PhoneNumber,
        };
        const SaleOrderRef = ref(db, `SaleOrder/${orderId}`);
        const newSaleOrderRef = update(SaleOrderRef, newSaleOrder);

        setCustomerName(newSaleOrder.customer);
        setOrderDate(newSaleOrder.orderDate);
        setName(newSaleOrder.name);
        setPhoneNumber(newSaleOrder.phoneNumber);
        setPaymentMethod(newSaleOrder.paymentMethod);
      }

      toast.success("Sale Order Edit Successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setSaveOrderVisible(false);
    } catch (error) {
      toast.error("Error adding SaleOrder: " + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Error adding SaleOrder:", error);
    }
  };

  useEffect(() => {
    debugger;
    // When the component mounts, check local storage for the saved state
    const savedState = localStorage.getItem("isSaveOrderVisible");

    const ID = localStorage.getItem("ID");
    const customer = localStorage.getItem("customer");
    const orderDate = localStorage.getItem("orderDate");
    const name = localStorage.getItem("name");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const paymentMethod = localStorage.getItem("paymentMethod");

    // If there is a saved state, update the component state
    if (savedState === "false") {
      setSaveOrderVisible(false);
      setCustomerName(customer);
      setSelectedCustomer(customer);
      setOrderDate(orderDate);
      setName(name);
      setId(ID);
      setPhoneNumber(phoneNumber);
      setPaymentMethod(paymentMethod);
      setIsReadOnly(false);
      setIsDisabled(false);
    } else {
      setSaveOrderVisible(true);
      setCustomerName("");
      setOrderDate("");
      setName("");
      setSelectedCustomer("");
      setId("");
      setPhoneNumber("");
      setPaymentMethod("rdoCash");
      setIsReadOnly(true);
      setIsDisabled(true);
    }
  }, []);

  // ---------------------------------variables Start------------------------------------

  const [Quantity, setQuantity] = useState("");
  const [Measurement, setMeasurement] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [Description, setDescription] = useState("");
  const [TotalPrice, setTotalPrice] = useState("");
  const [TotalStock, setTotalStock] = useState("");
  const [CostPrice, setCostPrice] = useState("");

  // ---------------------------------variables End------------------------------------

  // ItemName Show Dropdown

  const [Item, setItem] = useState([]);

  const [ItemOptions, setItemOptions] = useState([]);

  const [SelectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataRef = ref(db, "Product");
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          debugger;
          // Convert the data object into an array of options
          const options = Object.keys(data).map((key) => ({
            Id: key,
            value: data[key].itemName,
            label: data[key].itemName,
            TotalStock: data[key].itemQty,
            Measurement: data[key].measurement,
            SalePrice: data[key].sellPrice,
            CostPrice: data[key].itemCost,
            uid: data[key].uid,
          }));

          // console.log("All Banks:", options); // Log all banks before filtering

          // Filter options based on loggedInUID
          const userItems = options.filter((Item) => Item.uid === loggedInUID);
          setItem(userItems);

          // console.log("User Banks:", userBanks); // Log filtered banks

          if (userItems.length > 0) {
            // Add the "Select Bank" option to the beginning of the array
            setItemOptions([
              {
                value: "0",
                label: "Select Item Name",
                disabled: true,
                selected: true,
              },
              ...userItems,
            ]);
          } else {
            console.log("No matching Item for loggedInUID:", loggedInUID);

            toast.error("No matching Item for loggedInUID: ", loggedInUID, {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            // Handle the case where no matching banks are found
          }
        } else {
          console.log("Data doesn't exist in the 'Item' node.");

          toast.error("Data doesn't exist in the 'Item' node.", {
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
      } catch (error) {
        console.log("Error fetching data:", error);

        toast.error("Network Error:", error.message, {
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
    };

    fetchData();
  }, [db, loggedInUID]);

  const [Exists, setExists] = useState("");

  const handleItemSelect = (selectedOption) => {
    debugger;

    const itemExists = tableData.some(
      (item) => item.itemName === selectedOption?.value
    );
    setExists(itemExists);
    if (itemExists) {
      toast.error("Your product already exists.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setSelectedItem(0);
      setIsReadOnly(true);
      setSalePrice("");
      setMeasurement("");
      setTotalPrice("");
      setTotalStock("");
      setStock("");
      setCostPrice("");
      setTotalPrice("");
    } else {
      setSelectedItem(selectedOption?.value);
      setIsReadOnly(false);

      const selectedBankData = ItemOptions.find(
        (option) => option.value === selectedOption?.value
      );
      if (
        selectedBankData.Measurement != "" &&
        selectedBankData.SalePrice != "" &&
        selectedBankData.TotalStock != "" &&
        selectedBankData.CostPrice != ""
      ) {
        var TotalStock = selectedBankData.TotalStock;
        var SalePrice = selectedBankData.SalePrice;
        // var TotalPrice = selectedBankData.TotalPrice;
        var Measurement = selectedBankData.Measurement;
        var CostPrice = selectedBankData.CostPrice;

        // Extract the numeric part using parseInt
        var SalePriceNumeric = parseFloat(SalePrice);
        // var TotalPriceNumeric = parseFloat(TotalPrice);
        var TotalStockNumeric = parseFloat(TotalStock);
        var CostPriceNumeric = parseFloat(CostPrice);

        setSalePrice(SalePriceNumeric);
        setTotalPrice("");
        setTotalStock(TotalStockNumeric);
        setStock(TotalStockNumeric);
        setMeasurement(Measurement);
        setCostPrice(CostPriceNumeric);
        setQuantity("");
        setTotal("");
        // setBankID(`${selectedBankData.Id}`);
      } else {
        setSalePrice("");
        setMeasurement("");
        setTotalPrice("");
        setSelectedItem(0);
        setStock("");
        setTotalStock("");
        setCostPrice("");
        setTotalPrice("");
      }
    }
  };

  const [total, setTotal] = useState();

  const [Stock, setStock] = useState();

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    updateTotal(e.target.value, SalePrice);
    updateStock(e.target.value, TotalStock);
  };

  const handleTotalStockChange = (e) => {
    debugger;
    setTotalStock(e.target.value);
    updateStock(Quantity, e.target.value);
  };

  const handleSalePriceChange = (e) => {
    setSalePrice(e.target.value);
    updateTotal(Quantity, e.target.value);
  };

  const updateTotal = (quantity, salePrice) => {
    const totalValue = quantity * salePrice;
    setTotal(totalValue);
  };

  const updateStock = (quantity, totalStock) => {
    debugger;
    if (parseFloat(quantity) > totalStock) {
      // Quantity cannot be greater than totalStock, show an error or handle it accordingly
      toast.error("Quantity cannot be greater than TotalStock.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setQuantity("");
      setTotalPrice("");
      setTotal("");
      setStock(TotalStock);
      // Additional logic for error handling if needed
    } else if (quantity !== "" && parseFloat(quantity) < totalStock) {
      const Qty = parseFloat(quantity);
      const newTotalStock = totalStock - Qty;
      setStock(newTotalStock);
    } else if (parseFloat(quantity) === totalStock) {
      const Qty = parseFloat(quantity);
      const newTotalStock = Qty - totalStock;
      setStock(newTotalStock);
    } else {
      // Assuming you want to do something specific in the 'else' case
      setStock(TotalStock);
      // Additional logic for other cases if needed
    }
  };

  // -----------------------Add Item------------------

  const [AmountID, setAmountID] = useState("");

  const ID = localStorage.getItem("ID");

  const handleAddItem = () => {
    try {
      if (Exists) {
        toast.error("Your product already exists.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setSelectedItem(0);
        setSalePrice("");
        setMeasurement("");
        setTotalPrice("");
        setTotalStock("");
        setStock("");
        setCostPrice("");
        setTotalPrice("");
      } else {
        if (paymentMethod === "rdoCash") {
          localStorage.setItem("ItemName", SelectedItem);

          const SaleOrderRef = ref(db, "SaleOrderItem");
          const NewSaleOrder = {
            uid: loggedInUID,
            saleOrderID: ID,
            itemName: SelectedItem,
            quantity: Quantity,
            measurement: Measurement,
            salePrice: SalePrice,
            description: Description,
            totalPrice: total,
            totalStock: Stock,
            costPrice: CostPrice,
          };
          const AmountsId = push(SaleOrderRef, NewSaleOrder);
          const newAmountID = AmountsId.key;

          setAmountID(newAmountID);
          setQuantity("");
          setMeasurement("");
          setSalePrice("");
          setDescription("");
          setTotal("");
          setStock("");
          setTotalStock("");
          setCostPrice("");
          setSelectedItem(0);
        } else if (paymentMethod === "rdoCredit") {
          localStorage.setItem("ItemName", SelectedItem);

          const SaleOrderRef = ref(db, "SaleOrderItem");
          const NewSaleOrder = {
            uid: loggedInUID,
            saleOrderID: ID,
            itemName: SelectedItem,
            quantity: Quantity,
            measurement: Measurement,
            salePrice: SalePrice,
            description: Description,
            totalPrice: total,
            totalStock: Stock,
            costPrice: CostPrice,
          };

          const AmountsId = push(SaleOrderRef, NewSaleOrder);
          const newAmountID = AmountsId.key;

          setAmountID(newAmountID);

          setQuantity("");
          setMeasurement("");
          setSalePrice("");
          setDescription("");
          setTotal("");
          setStock("");
          setTotalStock("");
          setCostPrice("");
          setSelectedItem(0);
        } else if (paymentMethod === "rdoCashCredit") {
          localStorage.setItem("ItemName", SelectedItem);

          const SaleOrderRef = ref(db, "SaleOrderItem");
          const NewSaleOrder = {
            uid: loggedInUID,
            saleOrderID: ID,
            itemName: SelectedItem,
            quantity: Quantity,
            measurement: Measurement,
            salePrice: SalePrice,
            description: Description,
            totalPrice: total,
            totalStock: Stock,
            costPrice: CostPrice,
          };

          const AmountsId = push(SaleOrderRef, NewSaleOrder);
          const newAmountID = AmountsId.key;

          setAmountID(newAmountID);

          setQuantity("");
          setMeasurement("");
          setSalePrice("");
          setDescription("");
          setTotal("");
          setStock("");
          setTotalStock("");
          setCostPrice("");
          setSelectedItem(0);
        } else {
          toast.error("Your product is not Add!", {
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
      }
    } catch (error) {
      toast.error("Error adding SaleOrder: " + error.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      console.log("Error adding SaleOrder:", error);
    }
  };

  //-------------------------------Table Data Show----------------------

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (loggedInUID) {
      // Reference to the 'Product' node in Firebase Realtime Database
      const DepositRef = ref(db, "SaleOrderItem");

      // Attach an event listener for data changes
      const fetchData = async () => {
        onValue(DepositRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert the object of products into an array
            const dataArray = Object.keys(data)
              .filter(
                (key) =>
                  data[key].uid === loggedInUID && data[key].saleOrderID === ID
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
  }, [loggedInUID, ID]);

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

  const FinalPrice = visibleItems.reduce(
    (acc, item) => acc + (item.totalPrice || 0),
    0
  );

  // --------------------Discount Box Footer-------------------------

  const [discount, setDiscount] = useState("");
  const [payment, setPayment] = useState("");

  useEffect(() => {
    // Update payment whenever finalPrice changes
    setPayment(FinalPrice);
  }, [FinalPrice]);

  const handleDiscountChange = (e) => {
    debugger;
    const discountValue = e.target.value;
    setDiscount(discountValue);

    if (discountValue > FinalPrice) {
      toast.error("Discount cannot be greater than Payment.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setDiscount("");
      setPayment(FinalPrice);
    } else if (discountValue !== "") {
      // Assuming finalPrice is a state containing your original price
      const discountedPayment =
        parseFloat(FinalPrice) - parseFloat(discountValue);
      setPayment(discountedPayment);
    } else {
      setPayment(FinalPrice);
    }
  };

  const navigate = useNavigate();

  const handleSaleOrderTotalAmount = () => {
    try {
      const loggedInUID = localStorage.getItem("uid");
      debugger;
      const SaleOrderRef = ref(db, "SaleOrderTotalAmount");
      const newSaleOrder = {
        uid: loggedInUID,
        discount: discount,
        Payment: payment,
        SaleOrderID: AmountID,
      };
      push(SaleOrderRef, newSaleOrder);

      if (paymentMethod === "rdoCash") {
        const newSaleOrder = {
          uid: loggedInUID,
          status: "Order Delivered",
          paymentMethod: "rdoCash",
        };
        const SaleOrderRef = ref(db, `SaleOrder/${orderId}`);
        update(SaleOrderRef, newSaleOrder);
      } else if (paymentMethod === "rdoCredit") {
        const newSaleOrder = {
          uid: loggedInUID,
          status: "Order Delivered",
          paymentMethod: "rdoCredit",
        };
        const SaleOrderRef = ref(db, `SaleOrder/${orderId}`);
        update(SaleOrderRef, newSaleOrder);
      } else {
        const newSaleOrder = {
          uid: loggedInUID,
          status: "Order Delivered",
          paymentMethod: "rdoCashCredit",
        };
        const SaleOrderRef = ref(db, `SaleOrder/${orderId}`);
        update(SaleOrderRef, newSaleOrder);
      }

      setIsReadOnly(true);
      setIsDisabled(true);

      setTimeout(() => {
        navigate("/SaleOrder");
      }, 2000);
    } catch (error) {
      toast.error("Error adding SaleOrder: " + error.message, {
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
  };

  // ---------------------Edit-----------------------

  const [EditID, setEditID] = useState("");

  const handleEdit = async (item) => {
    debugger;
    localStorage.setItem("EditID", item.id);
    setEditID(item.id);
    localStorage.setItem("EdititemName", item.itemName);
    setSelectedItem(item.itemName);
    localStorage.setItem("EditQuantity", item.quantity);
    setQuantity(item.quantity);
    localStorage.setItem("EditMeasurement", item.measurement);
    setMeasurement(item.measurement);
    localStorage.setItem("EditSalePrice", item.salePrice);
    setSalePrice(item.salePrice);
    localStorage.setItem("EditDescription", item.description);
    setDescription(item.description);
    localStorage.setItem("EditTotal", item.totalPrice);
    setTotal(item.totalPrice);
    setTotalPrice(item.totalPrice);
    localStorage.setItem("EditStock", item.totalStock);
    setStock(item.totalStock);
    setTotalStock(item.totalStock);
    localStorage.setItem("EditCostPrice", item.costPrice);
    setCostPrice(item.costPrice);

    localStorage.setItem("AddItemSection", false);
    setAddItemSection(false);
  };

  useEffect(() => {
    debugger;
    const AddItemSec = localStorage.getItem("AddItemSection");
    const EditIDs = localStorage.getItem("EditID");
    const itemName = localStorage.getItem("EdititemName");
    const quantity = localStorage.getItem("EditQuantity");
    const measurement = localStorage.getItem("EditMeasurement");
    const salePrice = localStorage.getItem("EditSalePrice");
    const description = localStorage.getItem("EditDescription");
    const total = localStorage.getItem("EditTotal");
    const totalPrice = localStorage.getItem("EditTotalPrice");
    const stock = localStorage.getItem("EditStock");
    const totalStock = localStorage.getItem("EditTotalStock");
    const costPrice = localStorage.getItem("EditCostPrice");
    // Use the stored value if it exists, otherwise, use the default (false)
    if (AddItemSec === "false") {
      setAddItemSection(false);
      

      setEditID(EditIDs);
      setSelectedItem(itemName);
      setQuantity(quantity);
      setMeasurement(measurement);
      setSalePrice(salePrice);
      if(description === "undefined"){
        setDescription('');
      }
      else{
        setDescription(description);
      }
      
      setTotal(total);
      setTotalPrice(totalPrice);
      setStock(stock);
      setTotalStock(totalStock);
      setCostPrice(costPrice);

    } else {
      setAddItemSection(true);

      setEditID('');
      setSelectedItem('');
      setQuantity('');
      setMeasurement('');
      setSalePrice('');
      setDescription('');
      setTotal('');
      setTotalPrice('');
      setStock('');
      setTotalStock('');
      setCostPrice('');
    }
  }, []);



  const [LastStock, setLastStock]= useState('');

  const handleQuantityUpdate = (e) => {
    setQuantity(e.target.value);
    NewTotal(e.target.value, SalePrice);
    NewStocks(e.target.value, LastStock);
  };

  const handleTotalStockUpdate = (e) => {
    debugger;
    setTotalStock(e.target.value);
    NewStocks(Quantity, e.target.value);
  };

  const handleSalePriceUpdate = (e) => {
    setSalePrice(e.target.value);
    NewTotal(Quantity, e.target.value);
  };

  const NewTotal = (quantity, salePrice) => {
    const totalValue = quantity * salePrice;
    setTotal(totalValue);
  };

  const NewStocks = (quantity, LastStock) => {
    debugger;
    if (parseFloat(quantity) > LastStock) {
      // Quantity cannot be greater than totalStock, show an error or handle it accordingly
      toast.error("Quantity cannot be greater than TotalStock.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setQuantity("");
      setTotalPrice("");
      setTotal("");
      setStock(TotalStock);
      // Additional logic for error handling if needed
    } else if (quantity !== "" && parseFloat(quantity) < LastStock) {
      const Qty = parseFloat(quantity);
      const newTotalStock = LastStock - Qty;
      setStock(newTotalStock);
    } else if (parseFloat(quantity) === LastStock) {
      const Qty = parseFloat(quantity);
      const newTotalStock = Qty - LastStock;
      setStock(newTotalStock);
    } else {
      const quantity = localStorage.getItem("EditQuantity");
      const stock = localStorage.getItem("EditStock");
      const newTotalStock = parseFloat(stock) + parseFloat(quantity);
      // Assuming you want to do something specific in the 'else' case
      setStock(newTotalStock);

      setLastStock(newTotalStock);
      // Additional logic for other cases if needed
    }
  };

const handleUpdateItem = () =>{
  // console.log(EditID);

  try{

    const loggedInUID = localStorage.getItem("uid");
    const SaleOrderItemRef = ref(db, `SaleOrderItem/${EditID}`);

    localStorage.setItem("ItemName", SelectedItem);

    const newSaleOrderItem = {
      uid: loggedInUID,
      saleOrderID: ID,
      itemName: SelectedItem,
      quantity: Quantity,
      measurement: Measurement,
      salePrice: SalePrice,
      description: Description,
      totalPrice: total,
      totalStock: Stock,
      costPrice: CostPrice,
    };
    update(SaleOrderItemRef, newSaleOrderItem);


    setQuantity("");
    setMeasurement("");
    setSalePrice("");
    setDescription("");
    setTotal("");
    setStock("");
    setTotalStock("");
    setCostPrice("");
    setSelectedItem(0);

    setAddItemSection(false);

  }
  catch(error){
    toast.error("Error adding Product: " + error.message, {
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

        <div className="card" style={{ border: "1px solid #2c7be5" }}>
          <div className="card-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12 col-lg-12 col-sm-12">
                  <h1>Sale Order</h1>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-6">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      id="rdoCash"
                      type="radio"
                      name="paymentMethod"
                      value="rdoCash"
                      checked={paymentMethod === "rdoCash"}
                      onChange={handlePaymentMethodChange}
                    />
                    <label className="form-check-label" htmlFor="rdoCash">
                      Cash
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      id="rdoCredit"
                      type="radio"
                      name="paymentMethod"
                      value="rdoCredit"
                      checked={paymentMethod === "rdoCredit"}
                      onChange={handlePaymentMethodChange}
                    />
                    <label className="form-check-label" htmlFor="rdoCredit">
                      Credit
                    </label>
                  </div>

                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      id="rdoCashCredit"
                      type="radio"
                      name="paymentMethod"
                      value="rdoCashCredit"
                      checked={paymentMethod === "rdoCashCredit"}
                      onChange={handlePaymentMethodChange}
                    />
                    <label className="form-check-label" htmlFor="rdoCashCredit">
                      Cash/Credit
                    </label>
                  </div>
                </div>

                <div
                  className="col-md-6 col-lg-6 col-sm-6"
                  style={{ display: "flex", justifyContent: "end" }}
                >
                  <h3>SO #</h3>
                </div>
              </div>

              {isSaveOrderVisible && (
                <div id="SaveOrder">
                  {/* input field Cash */}

                  {paymentMethod === "rdoCash" && (
                    <div className="Cash">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label
                            className="form-label"
                            htmlFor="SelectCustomer"
                          >
                            Select Customer
                          </label>
                          <input
                            type="text"
                            id="txtCustomerCash"
                            className="form-control"
                            readOnly
                            value={CounterSale}
                            onChange={() => setCounterSale()}
                          ></input>
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="OrderDate">
                            Order Date
                          </label>
                          <input
                            type="date"
                            id="txtOrderDate"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="Name">
                            Name
                          </label>
                          <input
                            type="text"
                            id="txtName"
                            className="form-control"
                            placeholder="Enter Name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                          ></input>
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="PhoneNumber">
                            Phone Number
                          </label>

                          <InputMask
                            className="form-control"
                            name="PhoneNo"
                            id="txtPhoneNo"
                            mask="999-9999999"
                            placeholder="+92 999-9999999"
                            value={PhoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />

                          {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 20 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* input field Credit */}

                  {paymentMethod === "rdoCredit" && (
                    <div className="Credit">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label
                            className="form-label"
                            htmlFor="SelectCustomer"
                          >
                            Select Customer
                          </label>

                          <Select
                            id="txtCustomerCredit"
                            styles={{
                              ...customStyles,
                              menu: (provided) => ({
                                ...provided,
                                overflowY: "auto", // Add scrollbar when needed
                                maxHeight: "160px", // Set the maximum height here
                              }),
                            }}
                            options={customerName}
                            value={selectedCustomer}
                            placeholder="Select Customer"
                            onChange={(selectedOption) =>
                              setSelectedCustomer(selectedOption)
                            }
                            isSearchable={true}
                          />

                          {/* <a
                        href="#"
                        style={{ float: "right", fontSize: 13 + "px" }}
                       
                      >
                        Add Customer
                      </a> */}
                          <AddCustModal />
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="OrderDate">
                            Order Date
                          </label>
                          <input
                            type="date"
                            id="txtOrderDate"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="SalesMan">
                            SalesMan
                          </label>
                          {/* <input
                  type="text"
                  id="txtName"
                  className="form-control"
                  placeholder="Enter Name"
                ></input> */}

                          <Select
                            id="txtSalesMan"
                            options={[
                              { value: "Fahad Memon", label: "Fahad Memon" },
                              { value: "Zohaib Memon", label: "Zohaib Memon" },
                              // Add more static names as needed
                            ]}
                            value={SalesMan} // Set the desired pre-selected value here
                            placeholder="Select SalesMan"
                            isSearchable={true}
                            onChange={(e) => setSalesMan(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 85 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* input field Cash/Credit */}

                  {paymentMethod === "rdoCashCredit" && (
                    <div className="Cash/Credit">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label
                            className="form-label"
                            htmlFor="SelectCustomer"
                          >
                            Select Customer
                          </label>
                          <Select
                            id="txtCustomerCashCredit"
                            options={customerName}
                            styles={{
                              ...customStyles,
                              menu: (provided) => ({
                                ...provided,
                                overflowY: "auto", // Add scrollbar when needed
                                maxHeight: "160px", // Set the maximum height here
                              }),
                            }}
                            value={selectedCustomer}
                            placeholder="Select Customer"
                            onChange={(selectedOption) =>
                              setSelectedCustomer(selectedOption)
                            }
                            isSearchable={true}
                          />
                          {/* <a
                        href="#"
                        style={{ float: "right", fontSize: 13 + "px" }}
                      >
                        Add Customer
                      </a> */}
                          <AddCustModal />
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="OrderDate">
                            Order Date
                          </label>
                          <input
                            type="date"
                            id="txtOrderDate"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="Name">
                            Name
                          </label>
                          <input
                            type="text"
                            id="txtName"
                            className="form-control"
                            placeholder="Enter Name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                          ></input>
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="PhoneNumber">
                            Phone Number
                          </label>

                          <InputMask
                            className="form-control"
                            name="PhoneNo"
                            id="txtPhoneNo"
                            mask="999-9999999"
                            placeholder="+92 999-9999999"
                            value={PhoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />

                          {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 20 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    style={{ float: "right", marginTop: 20 + "px" }}
                    onClick={handleSaveOrder}
                  >
                    Save Order
                  </Button>
                </div>
              )}

              {!isSaveOrderVisible && (
                <div id="UpdateOrder">
                  {/* input field Cash */}

                  {paymentMethod === "rdoCash" && (
                    <div className="Cash">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label
                            className="form-label"
                            htmlFor="SelectCustomer"
                          >
                            Select Customer
                          </label>
                          <input
                            type="text"
                            id="txtCustomerCash"
                            className="form-control"
                            readOnly
                            value={CounterSale}
                            onChange={() => setCounterSale()}
                          ></input>
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="OrderDate">
                            Order Date
                          </label>
                          <input
                            type="date"
                            id="txtOrderDate"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="Name">
                            Name
                          </label>
                          <input
                            type="text"
                            id="txtName"
                            className="form-control"
                            placeholder="Enter Name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                          ></input>
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="PhoneNumber">
                            Phone Number
                          </label>

                          <InputMask
                            className="form-control"
                            name="PhoneNo"
                            id="txtPhoneNo"
                            mask="999-9999999"
                            placeholder="+92 999-9999999"
                            value={PhoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />

                          {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 20 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* input field Credit */}

                  {paymentMethod === "rdoCredit" && (
                    <div className="Credit">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label
                            className="form-label"
                            htmlFor="SelectCustomer"
                          >
                            Select Customer
                          </label>

                          <Select
                            id="txtCustomerCredit"
                            styles={{
                              ...customStyles,
                              menu: (provided) => ({
                                ...provided,
                                overflowY: "auto", // Add scrollbar when needed
                                maxHeight: "160px", // Set the maximum height here
                              }),
                            }}
                            options={customerName}
                            value={selectedCustomer}
                            placeholder="Select Customer"
                            onChange={(selectedOption) =>
                              setSelectedCustomer(selectedOption)
                            }
                            isSearchable={true}
                          />

                          {/* <a
                        href="#"
                        style={{ float: "right", fontSize: 13 + "px" }}
                       
                      >
                        Add Customer
                      </a> */}
                          <AddCustModal />
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="OrderDate">
                            Order Date
                          </label>
                          <input
                            type="date"
                            id="txtOrderDate"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="SalesMan">
                            SalesMan
                          </label>
                          {/* <input
                  type="text"
                  id="txtName"
                  className="form-control"
                  placeholder="Enter Name"
                ></input> */}

                          <Select
                            id="txtSalesMan"
                            options={[
                              { value: "Fahad Memon", label: "Fahad Memon" },
                              { value: "Zohaib Memon", label: "Zohaib Memon" },
                              // Add more static names as needed
                            ]}
                            value={SalesMan} // Set the desired pre-selected value here
                            placeholder="Select SalesMan"
                            isSearchable={true}
                            onChange={(e) => setSalesMan(e.target.value)}
                          />
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 85 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* input field Cash/Credit */}

                  {paymentMethod === "rdoCashCredit" && (
                    <div className="Cash/Credit">
                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label
                            className="form-label"
                            htmlFor="SelectCustomer"
                          >
                            Select Customer
                          </label>
                          <Select
                            id="txtCustomerCashCredit"
                            options={customerName}
                            styles={{
                              ...customStyles,
                              menu: (provided) => ({
                                ...provided,
                                overflowY: "auto", // Add scrollbar when needed
                                maxHeight: "160px", // Set the maximum height here
                              }),
                            }}
                            value={selectedCustomer}
                            placeholder="Select Customer"
                            onChange={(selectedOption) =>
                              setSelectedCustomer(selectedOption)
                            }
                            isSearchable={true}
                          />
                          {/* <a
                        href="#"
                        style={{ float: "right", fontSize: 13 + "px" }}
                      >
                        Add Customer
                      </a> */}
                          <AddCustModal />
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="OrderDate">
                            Order Date
                          </label>
                          <input
                            type="date"
                            id="txtOrderDate"
                            className="form-control"
                            value={orderDate}
                            onChange={(e) => setOrderDate(e.target.value)}
                          />
                        </div>
                      </div>
                      <br />

                      <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="Name">
                            Name
                          </label>
                          <input
                            type="text"
                            id="txtName"
                            className="form-control"
                            placeholder="Enter Name"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                          ></input>
                        </div>

                        <div className="col-md-6 col-lg-6 col-sm-6">
                          <label className="form-label" htmlFor="PhoneNumber">
                            Phone Number
                          </label>

                          <InputMask
                            className="form-control"
                            name="PhoneNo"
                            id="txtPhoneNo"
                            mask="999-9999999"
                            placeholder="+92 999-9999999"
                            value={PhoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />

                          {/* <Button
                      variant="primary"
                      style={{ float: 'right', marginTop: 20 + 'px' }}
                    >
                      Save Order
                    </Button> */}
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    style={{ float: "right", marginTop: 20 + "px" }}
                    onClick={handleUpdateOrder}
                  >
                    Update Order
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="card"
          style={{ border: "1px solid #2c7be5", marginTop: "10px" }}
        >
          <div className="card-body">
            <div className="container-fluid">
              {AddItemSection && (
                <>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="ItemName"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Item Name
                        </label>

                        <Select
                          id="ItemName"
                          options={Item}
                          value={
                            Item.find(
                              (option) => option.value === SelectedItem
                            ) || null
                          }
                          styles={{
                            ...customStyles,
                            menu: (provided) => ({
                              ...provided,
                              overflowY: "auto", // Add scrollbar when needed
                              maxHeight: "150px", // Set the maximum height here
                            }),
                          }}
                          isSearchable={true}
                          placeholder="Select Item Name"
                          onChange={handleItemSelect}
                          isDisabled={isDisabled}
                        />
                        <AddProductModal />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="Quantity"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Quantity
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="Quantity"
                          id="Quantity"
                          value={Quantity}
                          onChange={handleQuantityChange}
                          readOnly={isReadOnly}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="Measurement"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Measurement
                        </label>

                        <input
                          type="text"
                          readOnly
                          className="form-control"
                          name="Measurement"
                          id="Measurement"
                          value={Measurement}
                          onChange={(e) => setMeasurement(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="SalePrice"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Sale Price
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="SalePrice"
                          id="SalePrice"
                          readOnly={isReadOnly}
                          value={SalePrice}
                          onChange={handleSalePriceChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="Description"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Description
                        </label>

                        <textarea
                          class="form-control"
                          id="Description"
                          rows="3"
                          readOnly={isReadOnly}
                          value={Description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="TotalPrice"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Total Price
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          readOnly
                          name="TotalPrice"
                          id="TotalPrice"
                          value={total}
                          onChange={(e) => setTotalPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="TotalStock"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Total Stock
                        </label>

                        <input
                          type="text"
                          readOnly
                          className="form-control"
                          name="TotalStock"
                          id="TotalStock"
                          value={Stock}
                          onChange={handleTotalStockChange}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="CostPrice"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Cost Price
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="CostPrice"
                          readOnly
                          id="CostPrice"
                          value={CostPrice}
                          onChange={(e) => setCostPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-lg-12">
                      <Button
                        variant="primary"
                        style={{ float: "right" }}
                        onClick={handleAddItem}
                      >
                        Add Item
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {!AddItemSection && (
                <>
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="ItemName"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Item Name
                        </label>

                        <Select
                          id="ItemName"
                          options={Item}
                          value={
                            Item.find(
                              (option) => option.value === SelectedItem
                            ) || null
                          }
                          styles={{
                            ...customStyles,
                            menu: (provided) => ({
                              ...provided,
                              overflowY: "auto", // Add scrollbar when needed
                              maxHeight: "150px", // Set the maximum height here
                            }),
                          }}
                          isSearchable={true}
                          placeholder="Select Item Name"
                          onChange={handleItemSelect}
                          isDisabled={isDisabled}
                        />
                        <AddProductModal />
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="Quantity"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Quantity
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="Quantity"
                          id="Quantity"
                          value={Quantity}
                          onChange={handleQuantityUpdate}
                          readOnly={isReadOnly}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="Measurement"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Measurement
                        </label>

                        <input
                          type="text"
                          readOnly
                          className="form-control"
                          name="Measurement"
                          id="Measurement"
                          value={Measurement}
                          onChange={(e) => setMeasurement(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="SalePrice"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Sale Price
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="SalePrice"
                          id="SalePrice"
                          readOnly={isReadOnly}
                          value={SalePrice}
                          onChange={handleSalePriceUpdate}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-lg-6">
                      <div className="mb-3">
                        <label
                          htmlFor="Description"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Description
                        </label>

                        <textarea
                          class="form-control"
                          id="Description"
                          rows="3"
                          readOnly={isReadOnly}
                          value={Description}
                          onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="TotalPrice"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Total Price
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          readOnly
                          name="TotalPrice"
                          id="TotalPrice"
                          value={total}
                          onChange={(e) => setTotalPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="TotalStock"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Total Stock
                        </label>

                        <input
                          type="text"
                          readOnly
                          className="form-control"
                          name="TotalStock"
                          id="TotalStock"
                          value={Stock}
                          onChange={handleTotalStockUpdate}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 col-sm-2 col-lg-2">
                      <div className="mb-3">
                        <label
                          htmlFor="CostPrice"
                          className="form-label"
                          style={{ color: "black" }}
                        >
                          Cost Price
                        </label>

                        <input
                          type="number"
                          className="form-control"
                          name="CostPrice"
                          readOnly
                          id="CostPrice"
                          value={CostPrice}
                          onChange={(e) => setCostPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-lg-12">
                      <Button
                        variant="primary"
                        style={{ float: "right" }}
                        onClick={handleUpdateItem}
                      >
                        Update Item
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Footer */}
              <div className="row" style={{ paddingTop: "60px" }}>
                <div className="col-md-12 col-sm-12 col-lg-12">
                  <div
                    id="tableExample"
                    data-list='{"valueNames":["name","email","age"],"page":5,"pagination":true}'
                  >
                    <div className="table-responsive scrollbar">
                      <table className="table table-bordered table-striped fs-10 mb-0">
                        <thead className="bg-200">
                          <tr>
                            <th
                              className="text-900 sort"
                              data-sort="Action"
                              style={{ width: "20%" }}
                            >
                              Action
                            </th>
                            <th className="text-900 sort" data-sort="ItemName">
                              Item Name
                            </th>
                            <th className="text-900 sort" data-sort="SalePrice">
                              Sale Price
                            </th>
                            <th className="text-900 sort" data-sort="Quantity">
                              Quantity
                            </th>
                            <th
                              className="text-900 sort"
                              data-sort="OpeningBalanceDate"
                            >
                              Sub Total
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
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>

                              <td className="tdchild">{item.itemName}</td>
                              <td className="tdchild">{item.salePrice}</td>
                              <td className="tdchild">{item.quantity}</td>
                              <td className="tdchild">{item.totalPrice}</td>
                              {/* Add more table data cells as needed */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="row mt-3">
                      <div className="pagination d-none"></div>
                      <div className="col-md-9 col-sm-9 col-lg-9">
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
                        <div style={{ paddingTop: "10px" }}>
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
                            style={{
                              backgroundColor: "#2c7be5",
                              color: "white",
                            }}
                            data-list-pagination="next"
                            onClick={handleNextClick}
                            disabled={currentPage === totalPages}
                          >
                            <span>Next</span>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-lg-3">
                        <h5
                          style={{
                            color: "#2c7be5",
                            fontWeight: "600",
                            float: "right",
                          }}
                        >
                          Total: {FinalPrice.toLocaleString()}
                        </h5>

                        <div className="mb-3" style={{ paddingTop: "40px" }}>
                          <label
                            htmlFor="Discount"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Discount
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="Discount"
                            id="Discount"
                            placeholder="Enter Discount"
                            value={discount}
                            onChange={handleDiscountChange}
                          />
                        </div>

                        <div className="mb-3" style={{ paddingTop: "10px" }}>
                          <label
                            htmlFor="Payment"
                            className="form-label"
                            style={{ color: "black" }}
                          >
                            Payment
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="Payment"
                            readOnly
                            value={payment}
                            id="Payment"
                            placeholder="Enter Payment"
                          />
                        </div>

                        <Button
                          variant="primary"
                          style={{ float: "right", marginTop: 10 + "px" }}
                          onClick={handleSaleOrderTotalAmount}
                        >
                          Save & Close
                        </Button>
                      </div>
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

export default AddSaleOrder;
