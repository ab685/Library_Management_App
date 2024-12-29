import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Table, Form, InputGroup, Button } from "react-bootstrap";
import { AppContext } from "../Context/AppContext";

const BorrowBookList = () => {
  const {
    baseUrl,
    fetchData,
    bookingData,
    bookingTotalRecords,
    setShowAddBorrowBookModal,
    setReloadData,
    setMemberIdToDelete,
    setShowDeleteModal,
    reloadData,
    setMemberId,
  } = useContext(AppContext);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("borrowDate");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);

  useEffect(() => {
    fetchData(page, pageSize, sortBy, order, search);
  }, [page, pageSize, sortBy, order, search, reloadData]);

  const handleSort = (column) => {
    const isAsc = sortBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to the first page
  };

  const totalPages = Math.ceil(bookingTotalRecords / pageSize);

  return (
    <div className="col-md-12">
      <div className="d-flex justify-content-between align-items-center">
        <div className="col-4">
          <Form.Select
            className="mb-3"
            size="sm"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ width: "auto" }}
          >
            {[7, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-2 d-flex align-items-center justify-content-between">
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => {
              setMemberId(0);
              setShowAddBorrowBookModal(true);
            }}
          >
            Add
          </button>
          <InputGroup className="flex-grow-1">
            <Form.Control
              className="form-control-sm"
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>
      </div>
      <Table className="table table-bordered table-hover table-striped table-responsive">
        <thead>
          <tr>
            <th>Action</th>
            <th onClick={() => handleSort("title")}>
              Title {sortBy === "title" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("publishedYear")}>
              Published Year{" "}
              {sortBy === "publishedYear" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("authorName")}>
              Author Name{" "}
              {sortBy === "authorName" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("genreName")}>
              Genre{" "}
              {sortBy === "genreName" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("memberName")}>
              Member Name{" "}
              {sortBy === "memberName" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>Identity Proof</th>
            <th onClick={() => handleSort("location")}>
              Location{" "}
              {sortBy === "location" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("borrowDate")}>
              Borrow Date{" "}
              {sortBy === "borrowDate" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("returnDate")}>
              Return Date{" "}
              {sortBy === "returnDate" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("status")}>
              Status {sortBy === "status" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("totalPrice")}>
              Total Price{" "}
              {sortBy === "totalPrice" ? (order === "asc" ? "↑" : "↓") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {bookingData?.map((item, index) => (
            <tr className="data-item" key={index}>
              <td style={{ width: "100px" }}>
                {item.status === 1 && (
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => {
                      setMemberId(item.memberId);
                      setShowAddBorrowBookModal(true);
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    setMemberIdToDelete(item.memberId);
                    setShowDeleteModal(true);
                  }}
                >
                  <i className="fa fa-trash"></i>
                </button>
              </td>
              <td>{item.title}</td>
              <td>{item.publishedYear}</td>
              <td>{item.authorName}</td>
              <td>{item.genreName}</td>
              <td>{item.memberName}</td>
              <td>
                <img
                  src={`${baseUrl}${item.identityProof}`}
                  alt="Identity Proof"
                  className="profile-image "
                />
              </td>
              <td>{item.location}</td>
              <td>{new Date(item.borrowDate).toLocaleDateString()}</td>
              <td>
                {item.returnDate
                  ? new Date(item.returnDate).toLocaleDateString()
                  : "not selected"}
              </td>
              <td>
                <span
                  className={
                    item.status === 1 ? "badge bg-primary" : "badge bg-success"
                  }
                >
                  {item.status === 1 ? "Borrowed" : "Returned"}
                </span>
              </td>
              <td>{item.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-end align-items-center">
        <div>
          <Button
            variant="primary"
            className="btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
          </Button>
          <span className="mx-2">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="primary"
            className="btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            <i className="fa fa-arrow-right" aria-hidden="true"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BorrowBookList;
