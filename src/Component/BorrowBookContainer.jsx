import React, { useContext } from "react";
import BorrowBookList from "./BorrowBookList.jsx";
import BorrowBookForm from "./BorrowBookForm.jsx";
import { AppContext } from "../Context/AppContext.jsx";
import DeleteBorrowedBook from "./DeleteBorrowedBook.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BorrowBookContainer = () => {
  const {
    baseUrl,
    fetchData,
    bookingData,
    bookingTotalRecords,
    setShowAddBorrowBookModal,
    showAddBorrowBookModal,
  } = useContext(AppContext);
  return (
    <>
      <div className="container">
        <div style={{ marginTop: "5rem" }}>
          <h1 className="title">Library Management</h1>
        </div>

        {showAddBorrowBookModal && <BorrowBookForm></BorrowBookForm>}
        <BorrowBookList></BorrowBookList>
        <DeleteBorrowedBook></DeleteBorrowedBook>
      </div>
    </>
  );
};

export default BorrowBookContainer;
