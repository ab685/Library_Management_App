import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../Context/AppContext";

const BorrowBookForm = () => {
  const {
    baseUrl,
    showAddBorrowBookModal,
    setShowAddBorrowBookModal,
    setReloadData,
    reloadData,
    memberId,
    showErrorToast,
    showSuccessToast,
  } = useContext(AppContext);
  const [formData, setFormData] = useState({
    memberName: "",
    memberId: 0,
    contactNo: "",
    image: null,
    address: "",
    countryId: "",
    stateId: "",
    cityId: "",
    genreId: "",
    bookId: "",
    email: "",
    returnDate: "",
    borrowDate: "",
    identityProof: "",
    status: 1,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [genres, setGenres] = useState([]);
  const [books, setBooks] = useState([]);

  const [errorMessages, setErrorMessages] = useState({
    memberName: "",
    contactNo: "",
    email: "",
    countryId: "",
    stateId: "",
    cityId: "",
    genreId: "",
    bookId: "",
    returnDate: "",
  });

  useEffect(() => {
    // Initialize toast

    axios.get(`${baseUrl}/Cascade/GetCountry`).then((response) => {
      setCountries(response.data);
    });

    axios
      .get(`${baseUrl}/Cascade/GenresList`)
      .then((response) => setGenres(response.data));

    if (memberId) {
      axios
        .get(`${baseUrl}/LibraryManagement/booksById/${memberId}`)
        .then((response) => {
          fetchStates(response.data.countryId);
          fetchCities(response.data.stateId);
          fetchBooks(response.data.genreId);

          response.data.returnDate = formatDates(response.data.returnDate);

          setFormData(response.data);
        });
    } else {
      setFormData((prev) => ({
        ...prev,
        borrowDate: new Date().toISOString().split("T")[0],
      }));
    }
  }, []);
  const formatDates = (dateString) => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    const date = new Date(dateString);
    if (isNaN(date)) return "";
    date.setDate(date.getDate() + 1); // Add one day
    return date.toISOString().split("T")[0];
  };
  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      countryId: countryId,
      stateId: "",
      cityId: "",
    }));
    fetchStates(countryId);
  };

  const fetchStates = (countryId) => {
    axios
      .get(`${baseUrl}/Cascade/GetStateByCountryId/${countryId}`)
      .then((response) => setStates(response.data));
  };
  const handleStateChange = (e) => {
    const stateId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      stateId: stateId,
      cityId: "",
    }));
    fetchCities(stateId);
  };
  const fetchCities = (stateId) => {
    axios
      .get(`${baseUrl}/Cascade/GetCityByStateId/${stateId}`)
      .then((response) => setCities(response.data));
  };

  const handleGenreChange = (e) => {
    const genreId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      genreId: genreId,
      bookId: "",
    }));
    fetchBooks(genreId);
  };
  const fetchBooks = (genreId) => {
    axios
      .get(`${baseUrl}/Cascade/BookList/${genreId}`)
      .then((response) => setBooks(response.data));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const {
      memberName,
      contactNo,
      email,
      address,
      countryId,
      stateId,
      cityId,
      genreId,
      bookId,
      returnDate,
      borrowDate,
      image,
    } = formData;
    let errors = {};

    if (!memberName) {
      errors.memberName = "Member Name is required.";
    }
    if (!contactNo) {
      errors.contactNo = "Contact Number is required.";
    } else if (contactNo.length < 10 || !/^\d+$/.test(contactNo)) {
      errors.contactNo =
        "Contact No must be at least 10 digits long and numeric";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      errors.email = "A valid Email is required.";
    }
    if (!address) errors.address = "Address is required.";

    if (!countryId) {
      errors.countryId = "Country is required.";
    }
    if (!stateId) {
      errors.stateId = "State is required.";
    }
    if (!cityId) {
      errors.cityId = "City is required.";
    }
    if (!genreId) {
      errors.genreId = "Genres is required.";
    }
    if (!bookId) {
      errors.bookId = "Book is required.";
    }
    if (new Date(returnDate) < new Date(borrowDate)) {
      errors.returnDate =
        "Return Date should be the same day or later than the Borrow Date";
    }
    if (image) {
      const fileError = validateFile(image);
      if (fileError) errors.image = fileError;
    }
    setErrorMessages(errors);

    return Object.keys(errors).length === 0; // Return true if there are no errors
  };
  const validateFile = (file) => {
    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!validExtensions.includes(file.type)) {
      return "Only image files are allowed (.jpeg, .jpg, .png).";
    }
    if (file.size > maxSize) {
      return "File size should not exceed 2MB.";
    }
    return null;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("memberId", formData.memberId);
    formDataToSend.append("memberName", formData.memberName);
    formDataToSend.append("contactNo", formData.contactNo);
    formDataToSend.append("image", formData.image);
    formDataToSend.append("identityProof", formData.identityProof || "");
    formDataToSend.append("address", formData.address);
    formDataToSend.append("countryId", formData.countryId);
    formDataToSend.append("stateId", formData.stateId);
    formDataToSend.append("cityId", formData.cityId);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("borrowDate", formData.borrowDate);
    formDataToSend.append("returnDate", formData.returnDate);
    formDataToSend.append("genreId", formData.genreId);
    formDataToSend.append("bookId", formData.bookId);
    formDataToSend.append("status", formData.status);
    if (memberId) {
      axios
        .put(
          `${baseUrl}/LibraryManagement/booksUpdate/${memberId}`,
          formDataToSend
        )
        .then((response) => {
          showSuccessToast("Record saved successfully!");
        })
        .catch((error) => {
          showErrorToastToast(error.response.messages);
          console.error("There was an error!", error);
        });
    } else {
      axios
        .post(`${baseUrl}/LibraryManagement/BooksInsert`, formDataToSend)
        .then((response) => {
          showSuccessToast("Record updated successfully!");
        })
        .catch((error) => {
          showErrorToastToast(error.response.messages);
          console.error("There was an error!", error);
        });
    }

    setReloadData(true);
    setShowAddBorrowBookModal(false); // Close the modal
  };

  return (
    <>
      {showAddBorrowBookModal && (
        <>
          <div
            className="modal fade show"
            tabIndex="-1"
            data-backdrop="static"
            style={{ display: "block" }}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {memberId == 0 ? "Add Member" : "Edit Member"}
                  </h5>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="username">
                            Member Name <span className="AstrickSign">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errorMessages.memberName ? "is-invalid" : ""
                            }`}
                            name="memberName"
                            value={formData.memberName}
                            onChange={handleInputChange}
                            maxLength="100"
                          />
                          {errorMessages.memberName && (
                            <div className="invalid-feedback">
                              {errorMessages.memberName}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Contact No <span className="AstrickSign">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              errorMessages.contactNo ? "is-invalid" : ""
                            }`}
                            name="contactNo"
                            value={formData.contactNo}
                            onChange={handleInputChange}
                            maxLength="15"
                          />
                          {errorMessages.contactNo && (
                            <div className="invalid-feedback">
                              {errorMessages.contactNo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Email
                            <span className="AstrickSign">*</span>
                          </label>
                          <input
                            type="email"
                            className={`form-control ${
                              errorMessages.email ? "is-invalid" : ""
                            }`}
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                          {errorMessages.email && (
                            <div className="invalid-feedback">
                              {errorMessages.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Country<span className="AstrickSign">*</span>
                          </label>
                          <select
                            className={`form-control ${
                              errorMessages.countryId ? "is-invalid" : ""
                            }`}
                            name="countryId"
                            value={formData.countryId}
                            onChange={handleCountryChange}
                          >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                              <option
                                key={country.countryId}
                                value={country.countryId}
                              >
                                {country.countryName}
                              </option>
                            ))}
                          </select>
                          {errorMessages.countryId && (
                            <div className="invalid-feedback">
                              {errorMessages.countryId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            State<span className="AstrickSign">*</span>
                          </label>
                          <select
                            className={`form-control ${
                              errorMessages.stateId ? "is-invalid" : ""
                            }`}
                            name="stateId"
                            value={formData.stateId}
                            disabled={!formData.countryId}
                            onChange={handleStateChange}
                          >
                            <option value="">Select State</option>
                            {states.map((state) => (
                              <option key={state.stateId} value={state.stateId}>
                                {state.stateName}
                              </option>
                            ))}
                          </select>
                          {errorMessages.stateId && (
                            <div className="invalid-feedback">
                              {errorMessages.stateId}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            City<span className="AstrickSign">*</span>
                          </label>
                          <select
                            className={`form-control ${
                              errorMessages.cityId ? "is-invalid" : ""
                            }`}
                            name="cityId"
                            value={formData.cityId}
                            disabled={!formData.stateId}
                            onChange={handleInputChange}
                          >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                              <option key={city.cityId} value={city.cityId}>
                                {city.cityName}
                              </option>
                            ))}
                          </select>
                          {errorMessages.cityId && (
                            <div className="invalid-feedback">
                              {errorMessages.cityId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Genres<span className="AstrickSign">*</span>
                          </label>
                          <select
                            className={`form-control ${
                              errorMessages.genreId ? "is-invalid" : ""
                            }`}
                            name="genreId"
                            value={formData.genreId}
                            onChange={handleGenreChange}
                          >
                            <option value="">Select Genre</option>
                            {genres.map((genre) => (
                              <option key={genre.genreId} value={genre.genreId}>
                                {genre.genreName}
                              </option>
                            ))}
                          </select>
                          {errorMessages.genres && (
                            <div className="invalid-feedback">
                              {errorMessages.genreId}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Book<span className="AstrickSign">*</span>
                          </label>
                          <select
                            className={`form-control ${
                              errorMessages.bookId ? "is-invalid" : ""
                            }`}
                            name="bookId"
                            value={formData.bookId}
                            disabled={!formData.genreId}
                            onChange={handleInputChange}
                          >
                            <option value="">Select Book</option>
                            {books.map((book) => (
                              <option key={book.bookId} value={book.bookId}>
                                {book.title} - Available: {book.availableCopies}
                              </option>
                            ))}
                          </select>
                          {errorMessages.book && (
                            <div className="invalid-feedback">
                              {errorMessages.bookId}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {memberId != 0 && (
                        <>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Return Date</label>
                              <input
                                type="date"
                                className={`form-control ${
                                  errorMessages.returnDate ? "is-invalid" : ""
                                }`}
                                name="returnDate"
                                value={formData.returnDate}
                                onChange={handleInputChange}
                              />
                              {errorMessages.returnDate && (
                                <div className="invalid-feedback">
                                  {errorMessages.returnDate}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">
                                Status<span className="AstrickSign">*</span>
                              </label>
                              <select
                                className="form-control"
                                name="status"
                                value={formData.status}
                                disabled={!formData.status}
                                onChange={handleInputChange}
                              >
                                <option value="0">Returned</option>
                                <option value="1">Borrowed</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">
                            Identity Proof<span className="AstrickSign">*</span>
                          </label>

                          <input
                            type="file"
                            className={`form-control ${
                              errorMessages.image ? "is-invalid" : ""
                            }`}
                            onChange={handleFileChange}
                            accept=".jpeg,.jpg,.png"
                          />
                          {formData.identityProof && (
                            <img
                              src={`${import.meta.env.VITE_API_BASE_URL}${
                                formData.identityProof
                              }`}
                              alt="Identity Proof"
                              className="profile-image img img-thumbnail"
                            />
                          )}
                          {errorMessages.image && (
                            <div className="invalid-feedback">
                              {errorMessages.image}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6"></div>
                    </div>
                    <div className="row">
                      <div className="form-group">
                        <label className="form-label">
                          Address<span className="AstrickSign">*</span>
                        </label>
                        <textarea
                          className={`form-control ${
                            errorMessages.address ? "is-invalid" : ""
                          }`}
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                        />
                        {errorMessages.address && (
                          <div className="invalid-feedback">
                            {errorMessages.address}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group d-flex justify-content-end align-items-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm m-3"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setShowAddBorrowBookModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BorrowBookForm;
