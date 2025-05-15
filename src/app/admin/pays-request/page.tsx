"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  DollarSign,
  Calendar,
  FileText,
  Download,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// Types
interface Payments {
  id: number;
  cart_id: number;
  amount: string;
  payment_status: number;
  payment_proof_url: string;
  created_at: string;
}

interface CartsInfo {
  title: string;
  price: string;
  quantity: number;
  name: string;
}

export default function PaysRequest() {
  // State for payments data
  const [payments, setPayments] = useState<Payments[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payments[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null
  );
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [cartDetails, setCartDetails] = useState<CartsInfo[]>([]);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(5);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [sortField, setSortField] = useState<keyof Payments | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payments | null>(null);

  const [modalMode, setModalMode] = useState<"view" | "approve" | "reject">(
    "view"
  );

  // Apply filters and search
  useEffect(() => {
    let result = [...payments];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((payments) =>
        payments.id.toString().toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter(
        (payments) => payments.payment_status === parseInt(filterStatus, 10)
      );
    }

    // Apply sorting
    if (sortField) {
      result = result.sort((a, b) => {
        if (a[sortField] < b[sortField])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredPayments(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [payments, searchTerm, filterStatus, sortField, sortDirection]);

  //fetch payments data
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("http://localhost:3001/getallpayments");
        const data = await response.json();
        setPayments(data);
        setFilteredPayments(data);
        if (data.length > 0) {
          const firstPaymentId = data[0].id;
          setSelectedPaymentId(firstPaymentId);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);
  const fetchPayments = async () => {
    try {
      const response = await fetch("http://localhost:3001/getallpayments");
      const data = await response.json();
      setPayments(data);
      setFilteredPayments(data);
      if (data.length > 0) {
        const firstPaymentId = data[0].id;
        setSelectedPaymentId(firstPaymentId);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  //fetch payment by id
  useEffect(() => {
    const fetchPaymentById = async () => {
      if (selectedPaymentId) {
        try {
          const response = await fetch(
            `http://localhost:3001/getpaymentbyid/${selectedPaymentId}`
          );
          const data = await response.json();
          setCurrentPayment(data);
        } catch (error) {
          console.error("Error fetching payment by ID:", error);
        }
      }
    };
    fetchPaymentById();
  });

  // Aceptar el pago
  const handleAcceptPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/confirmpayment/${selectedPaymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al aceptar el pago");
      }
    } catch (error) {
      console.error("Error accepting payment:", error);
    }
  };

  const handleRejectPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/rejectpayment/${selectedPaymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al rechazar el pago");
      }
    } catch (error) {
      console.error("Error rejecting payment:", error);
    }
  };

  // post para crear el invoice del cliente

  const handleCreateInvoice = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/createinvoice/${selectedPaymentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error creating invoice");
      }
      //obtenemos el id del invoice recien creado
      const data = await response.json();
      if (data && data.id) {
        setSelectedInvoiceId(data.id); // Guardar el id en el estado
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };
  const handleApproveAndCreateInvoice = async () => {
    await handleAcceptPayment();
    await handleCreateInvoice();
    await handleSendInvoice();
  };

  //enviar via correo la factura al cliente
  const handleSendInvoice = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/sendinvoiceemail/${selectedInvoiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error sending invoice email");
      }
    } catch (error) {
      console.error("Error sending invoice email:", error);
    }
  };

  //mostrar el carrito de compras relacionado al pago
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (selectedPaymentId) {
        try {
          const response = await fetch(
            `http://localhost:3001/getcartbypaymentid/${selectedPaymentId}`
          );
          const data = await response.json();
          setCartDetails(data);
        } catch (error) {
          console.error("Error fetching payment details:", error);
        }
      }
    };

    fetchPaymentDetails();
  }, [selectedPaymentId]);

  // Get current payments for pagination
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle sort
  const handleSort = (field: keyof Payments) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Open modal
  const openModal = (
    payment: Payments,
    mode: "view" | "approve" | "reject" = "view"
  ) => {
    setCurrentPayment(payment);
    setSelectedPaymentId(payment.id);
    setModalMode(mode);

    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPayment(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: Payments["payment_status"]) => {
    switch (status) {
      case 0: // Assuming "pending" corresponds to 0
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-marfil-suave">
      {/* Admin header */}
      <header className="bg-azul-noche text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-dorado-elegante mr-3" />
            <h1 className="text-2xl font-bold">
              Payment Verification Dashboard
            </h1>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin"
              className="text-sm bg-transparent hover:bg-azul-noche/50 text-white px-4 py-2 rounded-md transition-colors"
            >
              Administrar Libros
            </Link>
            <Link
              href="/auth/login"
              className="text-sm bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro px-4 py-2 rounded-md transition-colors"
            >
              LogOut
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Page header with actions */}
          <div className="p-6 border-b border-gris-medio/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gris-oscuro">
              Payment Verifications
            </h2>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders, customers..."
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

              {/* Status filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(
                      e.target.value as
                        | "all"
                        | "pending"
                        | "approved"
                        | "rejected"
                    )
                  }
                  className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante appearance-none w-full md:w-48"
                >
                  <option value="all">All Statuses</option>
                  <option value="0">Pending</option>
                  <option value="1">Approved</option>
                  <option value="2">Rejected</option>
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
              </div>

              {/* Refresh button */}
              <button
                onClick={fetchPayments}
                className="inline-flex items-center bg-marfil-suave hover:bg-gris-medio/20 text-gris-oscuro px-4 py-2 rounded-md transition-colors"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Payments table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-marfil-suave">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    <button
                      onClick={() => handleSort("id")}
                      className="flex items-center focus:outline-none"
                    >
                      Número de Pago
                      {sortField === "id" && (
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
                      onClick={() => handleSort("amount")}
                      className="flex items-center focus:outline-none"
                    >
                      Amount
                      {sortField === "amount" && (
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
                      onClick={() => handleSort("created_at")}
                      className="flex items-center focus:outline-none"
                    >
                      Date
                      {sortField === "created_at" && (
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
                      onClick={() => handleSort("payment_status")}
                      className="flex items-center focus:outline-none"
                    >
                      Status
                      {sortField === "payment_status" && (
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gris-medio/20">
                {currentPayments.length > 0 ? (
                  currentPayments.map((payments) => (
                    <tr key={payments.id} className="hover:bg-marfil-suave/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gris-oscuro">
                          {payments.id}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gris-oscuro">
                          ${parseFloat(payments.amount).toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gris-medio">
                          {formatDate(payments.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payments.payment_status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openModal(payments, "view")}
                          className="text-azul-noche hover:text-dorado-elegante mr-3"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {payments.payment_status === 0 && (
                          <>
                            <button
                              onClick={() => openModal(payments, "approve")}
                              className="text-green-600 hover:text-green-800 mr-3"
                              title="Approve Payment"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openModal(payments, "reject")}
                              className="text-red-500 hover:text-red-700"
                              title="Reject Payment"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gris-medio"
                    >
                      No payments found. Try adjusting your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredPayments.length > 0 && (
            <div className="px-6 py-4 bg-white border-t border-gris-medio/20 flex items-center justify-between">
              <div className="text-sm text-gris-medio">
                Showing{" "}
                <span className="font-medium">{indexOfFirstPayment + 1}</span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastPayment, filteredPayments.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredPayments.length}</span>{" "}
                payments
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
        </div>
      </main>

      {/* Modal for payment details/approval/rejection */}
      {isModalOpen && currentPayment && (
        <div className="fixed inset-0 bg-gris-oscuro/75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="px-6 py-4 border-b border-gris-medio/20 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gris-oscuro">
                {modalMode === "view"
                  ? "Payment Details"
                  : modalMode === "approve"
                  ? "Approve Payment"
                  : "Reject Payment"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column - Payment details */}
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-gris-oscuro mb-4">
                      Order Information
                    </h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-sm font-medium text-gris-medio flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-dorado-elegante" />
                        Order ID
                      </dt>
                      <dd className="text-sm text-gris-oscuro">
                        {currentPayment.id}
                      </dd>

                      <dt className="text-sm font-medium text-gris-medio flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-dorado-elegante" />
                        Amount
                      </dt>
                      <dd className="text-sm text-gris-oscuro">
                        ${parseFloat(currentPayment.amount).toFixed(2)}
                      </dd>

                      <dt className="text-sm font-medium text-gris-medio flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-dorado-elegante" />
                        Date
                      </dt>
                      <dd className="text-sm text-gris-oscuro">
                        {formatDate(currentPayment.created_at)}
                      </dd>

                      <dt className="text-sm font-medium text-gris-medio flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-dorado-elegante" />
                        Status
                      </dt>
                      <dd className="text-sm text-gris-oscuro">
                        {getStatusBadge(currentPayment.payment_status)}
                      </dd>
                    </dl>
                  </div>

                  {cartDetails.length > 0 ? (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-gris-oscuro mb-4">
                        Order Items
                      </h4>
                      <div className="border border-gris-medio/20 rounded-md overflow-hidden">
                        {/* Contenedor para scroll horizontal */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gris-medio/20">
                            <thead className="bg-marfil-suave">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                  Book
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                  Qty
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gris-medio/20">
                              {cartDetails.map((book, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gris-oscuro">
                                    {book.title}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gris-medio">
                                    {book.quantity}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gris-medio">
                                    ${Number(book.price).toFixed(2)}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gris-oscuro">
                                    $
                                    {(
                                      Number(book.price) * book.quantity
                                    ).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gris-medio">
                      No items found in the cart.
                    </p>
                  )}
                </div>

                {/* Right column - Payment screenshot */}
                <div>
                  <h4 className="text-lg font-medium text-gris-oscuro mb-4">
                    Payment Screenshot
                  </h4>
                  <div className="border border-gris-medio/20 rounded-md overflow-hidden bg-marfil-suave p-2">
                    <div className="relative aspect-[3/4] w-full">
                      <img
                        src={
                          currentPayment.payment_proof_url || "/placeholder.svg"
                        }
                        alt="Payment screenshot"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-center">
                    <a
                      href={currentPayment.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gris-medio/30 rounded-md shadow-sm text-sm font-medium text-gris-oscuro bg-white hover:bg-marfil-suave"
                    >
                      <Download className="mr-2 h-5 w-5 text-gris-medio" />
                      Download Screenshot
                    </a>
                  </div>
                </div>
              </div>

              {/* Modal actions */}
              <div className="mt-8 flex justify-end space-x-3 border-t border-gris-medio/20 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gris-medio/30 rounded-md text-gris-oscuro hover:bg-marfil-suave"
                >
                  {modalMode === "view" ? "Close" : "Cancel"}
                </button>

                {modalMode === "approve" && (
                  <button
                    onClick={handleApproveAndCreateInvoice}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Approve Payment
                  </button>
                )}

                {modalMode === "reject" && (
                  <button
                    type="button"
                    onClick={handleRejectPayment}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Reject Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
