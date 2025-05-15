"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  Save,
  ArrowUp,
  ArrowDown,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Types
interface Book {
  id_book: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  age: string;
}
interface ageRec {
  id: number;
  age: number;
}

interface CreateBook {
  title: string;
  author: string;
  price: number;
  stock: number;
  description: string;
  image_url: string;
  age_rec_id: number;
}

export default function AdminCrud() {
  // State for books data
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ageRecs, setAgeRecs] = useState<ageRec[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");

  const [sortField, setSortField] = useState<keyof Book | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "add" | "edit" | "view" | "delete"
  >("add");
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<Partial<CreateBook>>({});

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/getallbooks");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching books"
      );
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchAgeRecs = async () => {
    try {
      const response = await fetch("http://localhost:3001/getallages");
      const data = await response.json();
      setAgeRecs(data);
    } catch (err) {
      console.error("Error fetching age recommendations:", err);
    }
  };

  useEffect(() => {
    fetchAgeRecs();
  }, []);

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Search books by title
  const searchBooksByTitle = async (title: string) => {
    if (!title.trim()) {
      // If search term is empty, fetch all books
      fetchBooks();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/getbooksbytitle/${encodeURIComponent(title)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setFilteredBooks(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching books"
      );
      console.error("Error searching books:", err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and search
  useEffect(() => {
    if (searchTerm) {
      // Use the API endpoint for search
      searchBooksByTitle(searchTerm);
    }
    // If no search term, reset to all books
    else {
      setFilteredBooks(books);
    }
  });

  // Handle search input change with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchBooksByTitle(searchTerm);
      } else {
        setFilteredBooks(books);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sort
  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open modal for add/edit/view/delete
  const openModal = (mode: "add" | "edit" | "view" | "delete", book?: Book) => {
    setModalMode(mode);
    if (book && (mode === "edit" || mode === "view" || mode === "delete")) {
      setCurrentBook(book);
      setFormData({ ...book, age_rec_id: book.age ? Number(book.age) : 0 });
    } else {
      setCurrentBook(null);
      setFormData({
        title: "",
        author: "",
        price: 0,
        stock: 0,
        image_url: "/placeholder.svg?height=150&width=100",
        age_rec_id: 0,
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
    setFormData({});
    setFormErrors({});
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Parse numeric values
    if (name === "price" || name === "stock" || name === "age_rec_id") {
      parsedValue =
        name === "price"
          ? Number.parseFloat(value)
          : Number.parseInt(value, 10);

      parsedValue = Number(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.author?.trim()) {
      errors.author = "Author is required";
    }

    if (formData.price === undefined || formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (formData.stock === undefined || formData.stock < 0) {
      errors.stock = "Stock cannot be negative";
    }

    if (!formData.image_url?.trim()) {
      errors.image_url = "Image URL is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    setError(null);

    try {
      const dataToSend = { ...formData };

      if (modalMode === "add") {
        console.log("Form data being sent:", formData);
        // Add new book
        const response = await fetch("http://localhost:3001/createbook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        // Refresh book list
        await fetchBooks();
      } else if (modalMode === "edit" && currentBook) {
        // Update existing book
        const response = await fetch(
          `http://localhost:3001/updatebook/${currentBook.id_book}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        // Refresh book list
        await fetchBooks();
      }

      closeModal();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the book"
      );
      console.error("Error saving book:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (currentBook) {
      setSubmitLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:3001/deletebook/${currentBook.id_book}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        // Refresh book list
        await fetchBooks();
        closeModal();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while deleting the book"
        );
        console.error("Error deleting book:", err);
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  // Get unique age values for filtering

  return (
    <div className="min-h-screen bg-marfil-suave">
      {/* Admin header */}
      <header className="bg-azul-noche text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-dorado-elegante mr-3" />
            <h1 className="text-2xl font-bold">Book Admin Dashboard</h1>
          </div>
          <div>
            <Link
              href="/admin"
              className="text-sm bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro px-4 py-2 rounded-md transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Page header with actions */}
          <div className="p-6 border-b border-gris-medio/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gris-oscuro">Manage Books</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search books..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gris-medio hover:text-gris-oscuro"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Age filter */}

              {/* Add book button */}
              <button
                onClick={() => openModal("add")}
                className="inline-flex items-center bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro px-4 py-2 rounded-md transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Book
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-dorado-elegante border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gris-medio">Loading books...</p>
            </div>
          ) : (
            <>
              {/* Books table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-marfil-suave">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("title")}
                          className="flex items-center focus:outline-none"
                        >
                          Title
                          {sortField === "title" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("author")}
                          className="flex items-center focus:outline-none"
                        >
                          Author
                          {sortField === "author" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("price")}
                          className="flex items-center focus:outline-none"
                        >
                          Price
                          {sortField === "price" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        <button
                          onClick={() => handleSort("stock")}
                          className="flex items-center focus:outline-none"
                        >
                          Stock
                          {sortField === "stock" && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Age Recommendation
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gris-medio/20">
                    {currentBooks.length > 0 ? (
                      currentBooks.map((book) => (
                        <tr
                          key={book.id_book}
                          className="hover:bg-marfil-suave/50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 object-cover rounded-md"
                                  src={book.image_url || "/placeholder.svg"}
                                  alt={book.title}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gris-oscuro">
                                  {book.title}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                            {book.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                            ${book.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                book.stock > 20
                                  ? "bg-green-100 text-green-800"
                                  : book.stock > 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {book.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gris-medio">
                            {book.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openModal("view", book)}
                              className="text-azul-noche hover:text-dorado-elegante mr-3"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openModal("edit", book)}
                              className="text-dorado-elegante hover:text-oro-claro mr-3"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openModal("delete", book)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-4 text-center text-gris-medio"
                        >
                          No books found. Try adjusting your search or filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredBooks.length > 0 && (
                <div className="px-6 py-4 bg-white border-t border-gris-medio/20 flex items-center justify-between">
                  <div className="text-sm text-gris-medio">
                    Showing{" "}
                    <span className="font-medium">{indexOfFirstBook + 1}</span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastBook, filteredBooks.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredBooks.length}</span>{" "}
                    books
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gris-medio/30 text-gris-medio hover:text-gris-oscuro disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === number
                              ? "bg-dorado-elegante text-gris-oscuro"
                              : "text-gris-medio hover:bg-marfil-suave"
                          }`}
                        >
                          {number}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gris-medio/30 text-gris-medio hover:text-gris-oscuro disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal for add/edit/view/delete */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gris-oscuro/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gris-medio/20 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gris-oscuro">
                {modalMode === "add"
                  ? "Add New Book"
                  : modalMode === "edit"
                  ? "Edit Book"
                  : modalMode === "view"
                  ? "Book Details"
                  : "Delete Book"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gris-medio hover:text-gris-oscuro"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="px-6 py-4">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {modalMode === "delete" ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gris-oscuro mb-2">
                    Delete Book
                  </h3>
                  <p className="text-sm text-gris-medio mb-6">
                    Are you sure you want to delete &quot;{currentBook?.title}
                    &quot;? This action cannot be undone.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 border border-gris-medio/30 rounded-md text-gris-oscuro hover:bg-marfil-suave"
                      disabled={submitLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                      disabled={submitLoading}
                    >
                      {submitLoading ? (
                        <>
                          <div className="h-4 w-4 mr-2 border-2 border-white border-r-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.title
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.title && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.title}
                          </p>
                        )}
                      </div>

                      {/* Author */}
                      <div>
                        <label
                          htmlFor="author"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Author
                        </label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          value={formData.author || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.author
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.author && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.author}
                          </p>
                        )}
                      </div>

                      {/* Price */}
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price || 0}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          min="0"
                          step="0.01"
                          className={`w-full px-3 py-2 border ${
                            formErrors.price
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.price && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.price}
                          </p>
                        )}
                      </div>

                      {/* Stock */}
                      <div>
                        <label
                          htmlFor="stock"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Stock
                        </label>
                        <input
                          type="number"
                          id="stock"
                          name="stock"
                          value={formData.stock || 0}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          min="0"
                          className={`w-full px-3 py-2 border ${
                            formErrors.stock
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.stock && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.stock}
                          </p>
                        )}
                      </div>
                      {/* Description */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Description
                        </label>
                        <input
                          type="text"
                          id="description"
                          name="description"
                          value={formData.description || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          min="0"
                          className={`w-full px-3 py-2 border ${
                            formErrors.stock
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.stock && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.stock}
                          </p>
                        )}
                      </div>

                      {/* Age recommendation */}
                      <div>
                        <label
                          htmlFor="age"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Age Recommendation
                        </label>
                        <select
                          id="age_rec_id"
                          name="age_rec_id"
                          value={formData.age_rec_id ?? ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.age_rec_id
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        >
                          <option value="">Select age recommendation</option>
                          {ageRecs.map((age) => (
                            <option key={age.id} value={age.id}>
                              {age.age}
                            </option>
                          ))}
                        </select>
                        {formErrors.age_rec_id && (
                          <span className="text-red-500 text-sm">
                            {formErrors.age_rec_id}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                      {/* Image URL */}
                      <div>
                        <label
                          htmlFor="image_url"
                          className="block text-sm font-medium text-gris-oscuro mb-1"
                        >
                          Image URL
                        </label>
                        <input
                          type="text"
                          id="image_url"
                          name="image_url"
                          value={formData.image_url || ""}
                          onChange={handleInputChange}
                          disabled={modalMode === "view"}
                          className={`w-full px-3 py-2 border ${
                            formErrors.image_url
                              ? "border-red-500"
                              : "border-gris-medio/30"
                          } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante disabled:bg-marfil-suave disabled:text-gris-medio`}
                        />
                        {formErrors.image_url && (
                          <p className="mt-1 text-sm text-red-500">
                            {formErrors.image_url}
                          </p>
                        )}
                      </div>

                      {/* Image preview */}
                      <div>
                        <p className="block text-sm font-medium text-gris-oscuro mb-1">
                          Image Preview
                        </p>
                        <div className="border border-gris-medio/30 rounded-md p-2 flex items-center justify-center">
                          <img
                            src={
                              formData.image_url ||
                              "/placeholder.svg?height=150&width=100"
                            }
                            alt="Book cover preview"
                            className="h-32 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form actions */}
                  {modalMode !== "view" && (
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border border-gris-medio/30 rounded-md text-gris-oscuro hover:bg-marfil-suave"
                        disabled={submitLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md flex items-center"
                        disabled={submitLoading}
                      >
                        {submitLoading ? (
                          <>
                            <div className="h-4 w-4 mr-2 border-2 border-gris-oscuro border-r-transparent rounded-full animate-spin"></div>
                            {modalMode === "add" ? "Adding..." : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            {modalMode === "add" ? "Add Book" : "Save Changes"}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {modalMode === "view" && (
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
