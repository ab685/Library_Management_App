import React, { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";

const DeleteBorrowedBook = () => {
  const {
    memberIdToDelete,
    showDeleteModal,
    setShowDeleteModal,
    setReloadData,
    baseUrl,
    showErrorToast,
    showSuccessToast,
  } = useContext(AppContext);

  const handleClose = () => setShowDeleteModal(false);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${baseUrl}/LibraryManagement/BookingDelete/${memberIdToDelete}`
      );
      if (response.status !== 200) {
        showErrorToast(response);
        throw new Error("Error deleting provider");
      } else {
        showSuccessToast("Record deleted successfully");
      }
    } catch (error) {
      showErrorToast(error.response.data);
      console.log("Delete error:", error);
    } finally {
      setReloadData(true);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Return Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this book?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteBorrowedBook;
