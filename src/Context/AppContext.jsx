import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [showAddBorrowBookModal, setShowAddBorrowBookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [bookingData, setBookingData] = useState([]);
  const [bookingTotalRecords, setBookingTotalRecords] = useState(0);
  const [reloadData, setReloadData] = useState(false);
  const [memberId, setMemberId] = useState(false);
  const [memberIdToDelete, setMemberIdToDelete] = useState(false);
  const fetchData = async (page, pageSize, sortBy, order, search) => {
    try {
      const response = await axios.get(
        `${baseUrl}/LibraryManagement/ServerSidePagination?pageNumber=${page}&pageSize=${pageSize}&searchValue=${encodeURIComponent(
          search
        )}&columnshort=${sortBy}&dir=${order}`
      );
      setBookingData(response.data.data);
      setBookingTotalRecords(response.data.totalRecords);
      setReloadData(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const showSuccessToast = (message) => {
    toast.success(message);
  };
  const showErrorToast = (message) => {
    toast.error(message);
  };

  return (
    <AppContext.Provider
      value={{
        baseUrl,
        fetchData,
        bookingData,
        bookingTotalRecords,
        showAddBorrowBookModal,
        setShowAddBorrowBookModal,
        setReloadData,
        reloadData,
        memberId,
        setMemberId,
        showDeleteModal,
        setShowDeleteModal,
        memberIdToDelete,
        setMemberIdToDelete,
        showErrorToast,
        showSuccessToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
