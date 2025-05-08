"use client"

import { useState, useEffect } from "react"
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
    User,
    FileText,
    Download,
    RefreshCw,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Types
interface Payment {
    id: number
    orderId: string
    customerId: number
    customerName: string
    amount: number
    date: string
    status: "pending" | "approved" | "rejected"
    screenshotUrl: string
    notes?: string
    books: {
        id: number
        title: string
        quantity: number
        price: number
    }[]
}

interface Customer {
    id: number
    name: string
    email: string
}

// Mock data for payments
const initialPayments: Payment[] = [
    {
        id: 1,
        orderId: "ORD-2023-001",
        customerId: 1,
        customerName: "John Smith",
        amount: 45.97,
        date: "2023-05-15T14:30:00",
        status: "pending",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        books: [
            { id: 1, title: "The Great Adventure", quantity: 1, price: 19.99 },
            { id: 4, title: "Bedtime Stories", quantity: 2, price: 12.99 },
        ],
    },
    {
        id: 2,
        orderId: "ORD-2023-002",
        customerId: 2,
        customerName: "Emily Johnson",
        amount: 24.99,
        date: "2023-05-16T09:15:00",
        status: "approved",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        notes: "Payment confirmed via bank transfer",
        books: [{ id: 3, title: "The Science of Everything", quantity: 1, price: 24.99 }],
    },
    {
        id: 3,
        orderId: "ORD-2023-003",
        customerId: 3,
        customerName: "Michael Brown",
        amount: 18.99,
        date: "2023-05-16T11:45:00",
        status: "rejected",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        notes: "Payment amount doesn't match order total",
        books: [{ id: 5, title: "Fantasy World", quantity: 1, price: 18.99 }],
    },
    {
        id: 4,
        orderId: "ORD-2023-004",
        customerId: 4,
        customerName: "Sarah Miller",
        amount: 38.98,
        date: "2023-05-17T16:20:00",
        status: "pending",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        books: [{ id: 4, title: "Bedtime Stories", quantity: 3, price: 12.99 }],
    },
    {
        id: 5,
        orderId: "ORD-2023-005",
        customerId: 5,
        customerName: "David Wilson",
        amount: 29.99,
        date: "2023-05-18T10:05:00",
        status: "pending",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        books: [{ id: 6, title: "The History of Art", quantity: 1, price: 29.99 }],
    },
    {
        id: 6,
        orderId: "ORD-2023-006",
        customerId: 6,
        customerName: "Jennifer Davis",
        amount: 22.99,
        date: "2023-05-18T14:50:00",
        status: "approved",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        notes: "Payment verified",
        books: [{ id: 7, title: "Cooking Masterclass", quantity: 1, price: 22.99 }],
    },
    {
        id: 7,
        orderId: "ORD-2023-007",
        customerId: 7,
        customerName: "Robert Williams",
        amount: 19.99,
        date: "2023-05-19T09:30:00",
        status: "pending",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        books: [{ id: 1, title: "The Great Adventure", quantity: 1, price: 19.99 }],
    },
    {
        id: 8,
        orderId: "ORD-2023-008",
        customerId: 8,
        customerName: "Lisa Thompson",
        amount: 15.99,
        date: "2023-05-19T13:15:00",
        status: "rejected",
        screenshotUrl: "/placeholder.svg?height=600&width=400",
        notes: "Screenshot unclear, requested new payment proof",
        books: [{ id: 2, title: "Mystery at Midnight", quantity: 1, price: 15.99 }],
    },
]

export default function PaysRequest(){


    // State for payments data
    const [payments, setPayments] = useState<Payment[]>(initialPayments)
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>(initialPayments)

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [paymentsPerPage] = useState(5)

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")
    const [sortField, setSortField] = useState<keyof Payment | null>(null)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

    // State for modal
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentPayment, setCurrentPayment] = useState<Payment | null>(null)
    const [rejectionReason, setRejectionReason] = useState("")
    const [approvalNotes, setApprovalNotes] = useState("")
    const [modalMode, setModalMode] = useState<"view" | "approve" | "reject">("view")

    // Apply filters and search
    useEffect(() => {
        let result = [...payments]

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(
                (payment) =>
                    payment.orderId.toLowerCase().includes(term) ||
                    payment.customerName.toLowerCase().includes(term) ||
                    payment.books.some((book) => book.title.toLowerCase().includes(term)),
            )
        }

        // Apply status filter
        if (filterStatus !== "all") {
            result = result.filter((payment) => payment.status === filterStatus)
        }

        // Apply sorting
        if (sortField) {
            result = result.sort((a, b) => {
                if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
                if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
                return 0
            })
        }

        setFilteredPayments(result)
        setCurrentPage(1) // Reset to first page when filters change
    }, [payments, searchTerm, filterStatus, sortField, sortDirection])

    // Get current payments for pagination
    const indexOfLastPayment = currentPage * paymentsPerPage
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage
    const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment)
    const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage)

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    // Handle sort
    const handleSort = (field: keyof Payment) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    // Open modal
    const openModal = (payment: Payment, mode: "view" | "approve" | "reject" = "view") => {
        setCurrentPayment(payment)
        setModalMode(mode)
        setRejectionReason("")
        setApprovalNotes("")
        setIsModalOpen(true)
    }

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentPayment(null)
        setRejectionReason("")
        setApprovalNotes("")
    }

    // Handle payment approval
    const handleApprovePayment = () => {
        if (currentPayment) {
            const updatedPayments = payments.map((payment) =>
                payment.id === currentPayment.id
                    ? {
                        ...payment,
                        status: "approved" as const,
                        notes: approvalNotes || "Payment approved",
                    }
                    : payment,
            )
            setPayments(updatedPayments)
            closeModal()
        }
    }

    // Handle payment rejection
    const handleRejectPayment = () => {
        if (currentPayment) {
            const updatedPayments = payments.map((payment) =>
                payment.id === currentPayment.id
                    ? {
                        ...payment,
                        status: "rejected" as const,
                        notes: rejectionReason || "Payment rejected",
                    }
                    : payment,
            )
            setPayments(updatedPayments)
            closeModal()
        }
    }

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    // Get status badge
    const getStatusBadge = (status: Payment["status"]) => {
        switch (status) {
            case "pending":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
                )
            case "approved":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
                )
            case "rejected":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
                )
        }
    }

    return (
        <div className="min-h-screen bg-marfil-suave">
            {/* Admin header */}
            <header className="bg-azul-noche text-white py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <DollarSign className="h-8 w-8 text-dorado-elegante mr-3" />
                        <h1 className="text-2xl font-bold">Payment Verification Dashboard</h1>
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
                        <h2 className="text-xl font-bold text-gris-oscuro">Payment Verifications</h2>
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
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                    className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante appearance-none w-full md:w-48"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
                            </div>

                            {/* Refresh button */}
                            <button
                                onClick={() => setPayments([...initialPayments])}
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
                                    <button onClick={() => handleSort("orderId")} className="flex items-center focus:outline-none">
                                        Order ID
                                        {sortField === "orderId" && (
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
                                    <button onClick={() => handleSort("customerName")} className="flex items-center focus:outline-none">
                                        Customer
                                        {sortField === "customerName" && (
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
                                    <button onClick={() => handleSort("amount")} className="flex items-center focus:outline-none">
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
                                    <button onClick={() => handleSort("date")} className="flex items-center focus:outline-none">
                                        Date
                                        {sortField === "date" && (
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
                                    <button onClick={() => handleSort("status")} className="flex items-center focus:outline-none">
                                        Status
                                        {sortField === "status" && (
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
                                currentPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-marfil-suave/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gris-oscuro">{payment.orderId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gris-oscuro">{payment.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gris-oscuro">${payment.amount.toFixed(2)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gris-medio">{formatDate(payment.date)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(payment.status)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => openModal(payment, "view")}
                                                className="text-azul-noche hover:text-dorado-elegante mr-3"
                                                title="View Details"
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            {payment.status === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => openModal(payment, "approve")}
                                                        className="text-green-600 hover:text-green-800 mr-3"
                                                        title="Approve Payment"
                                                    >
                                                        <CheckCircle className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openModal(payment, "reject")}
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
                                    <td colSpan={6} className="px-6 py-4 text-center text-gris-medio">
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
                                Showing <span className="font-medium">{indexOfFirstPayment + 1}</span> to{" "}
                                <span className="font-medium">{Math.min(indexOfLastPayment, filteredPayments.length)}</span> of{" "}
                                <span className="font-medium">{filteredPayments.length}</span> payments
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-md border border-gris-medio/30 text-gris-medio hover:text-gris-oscuro disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
                                ))}
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
                            <button onClick={closeModal} className="text-gris-medio hover:text-gris-oscuro">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Modal content */}
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left column - Payment details */}
                                <div>
                                    <div className="mb-6">
                                        <h4 className="text-lg font-medium text-gris-oscuro mb-4">Order Information</h4>
                                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                                                <FileText className="w-4 h-4 mr-2 text-dorado-elegante" />
                                                Order ID
                                            </dt>
                                            <dd className="text-sm text-gris-oscuro">{currentPayment.orderId}</dd>

                                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                                                <User className="w-4 h-4 mr-2 text-dorado-elegante" />
                                                Customer
                                            </dt>
                                            <dd className="text-sm text-gris-oscuro">{currentPayment.customerName}</dd>

                                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                                                <DollarSign className="w-4 h-4 mr-2 text-dorado-elegante" />
                                                Amount
                                            </dt>
                                            <dd className="text-sm text-gris-oscuro">${currentPayment.amount.toFixed(2)}</dd>

                                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                                                <Calendar className="w-4 h-4 mr-2 text-dorado-elegante" />
                                                Date
                                            </dt>
                                            <dd className="text-sm text-gris-oscuro">{formatDate(currentPayment.date)}</dd>

                                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-dorado-elegante" />
                                                Status
                                            </dt>
                                            <dd className="text-sm text-gris-oscuro">{getStatusBadge(currentPayment.status)}</dd>
                                        </dl>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-lg font-medium text-gris-oscuro mb-4">Order Items</h4>
                                        <div className="border border-gris-medio/20 rounded-md overflow-hidden">
                                            <table className="min-w-full divide-y divide-gris-medio/20">
                                                <thead className="bg-marfil-suave">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider"
                                                    >
                                                        Book
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider"
                                                    >
                                                        Qty
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider"
                                                    >
                                                        Total
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gris-medio/20">
                                                {currentPayment.books.map((book) => (
                                                    <tr key={book.id}>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gris-oscuro">{book.title}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gris-medio">{book.quantity}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gris-medio">
                                                            ${book.price.toFixed(2)}
                                                        </td>
                                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gris-oscuro">
                                                            ${(book.price * book.quantity).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                                <tfoot className="bg-marfil-suave">
                                                <tr>
                                                    <td colSpan={3} className="px-4 py-2 text-right text-sm font-medium text-gris-oscuro">
                                                        Total:
                                                    </td>
                                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gris-oscuro">
                                                        ${currentPayment.amount.toFixed(2)}
                                                    </td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {currentPayment.notes && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium text-gris-oscuro mb-2">Notes</h4>
                                            <div className="bg-marfil-suave p-3 rounded-md text-sm text-gris-oscuro">
                                                {currentPayment.notes}
                                            </div>
                                        </div>
                                    )}

                                    {/* Approval/Rejection form */}
                                    {modalMode === "approve" && (
                                        <div className="mt-4">
                                            <label htmlFor="approval-notes" className="block text-sm font-medium text-gris-oscuro mb-1">
                                                Approval Notes (Optional)
                                            </label>
                                            <textarea
                                                id="approval-notes"
                                                rows={3}
                                                value={approvalNotes}
                                                onChange={(e) => setApprovalNotes(e.target.value)}
                                                className="w-full px-3 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante"
                                                placeholder="Add any notes about this payment approval..."
                                            />
                                        </div>
                                    )}

                                    {modalMode === "reject" && (
                                        <div className="mt-4">
                                            <label htmlFor="rejection-reason" className="block text-sm font-medium text-gris-oscuro mb-1">
                                                Rejection Reason <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                id="rejection-reason"
                                                rows={3}
                                                value={rejectionReason}
                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                className="w-full px-3 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante"
                                                placeholder="Explain why this payment is being rejected..."
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Right column - Payment screenshot */}
                                <div>
                                    <h4 className="text-lg font-medium text-gris-oscuro mb-4">Payment Screenshot</h4>
                                    <div className="border border-gris-medio/20 rounded-md overflow-hidden bg-marfil-suave p-2">
                                        <div className="relative aspect-[3/4] w-full">
                                            <Image
                                                src={currentPayment.screenshotUrl || "/placeholder.svg"}
                                                alt="Payment screenshot"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-center">
                                        <a
                                            href={currentPayment.screenshotUrl}
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
                                        type="button"
                                        onClick={handleApprovePayment}
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
                                        disabled={!rejectionReason.trim()}
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
    )


}