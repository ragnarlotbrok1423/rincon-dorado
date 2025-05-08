"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
    FileText,
    Download,
    ChevronRight,
    Search,
    Filter,
    X,
    Clock,
    CheckCircle,
    XCircle,
    ChevronLeft,
    Eye,
    Printer,
    ArrowLeft,
    ShoppingBag,

} from "lucide-react"
import Navbar from "@/app/components/navbar"

// Types
interface Invoice {
    id: string
    orderId: string
    date: string
    amount: number
    status: "pending" | "approved" | "rejected"
    items: {
        id: number
        title: string
        quantity: number
        price: number
    }[]
    paymentMethod: string
    paymentDate?: string
    downloadUrl: string
}

// Mock data for invoices
const mockInvoices: Invoice[] = [
    {
        id: "INV-2023-001",
        orderId: "ORD-2023-001",
        date: "2023-05-15T14:30:00",
        amount: 45.97,
        status: "approved",
        items: [
            { id: 1, title: "The Great Adventure", quantity: 1, price: 19.99 },
            { id: 4, title: "Bedtime Stories", quantity: 2, price: 12.99 },
        ],
        paymentMethod: "Bank Transfer",
        paymentDate: "2023-05-16T10:15:00",
        downloadUrl: "#",
    },
    {
        id: "INV-2023-002",
        orderId: "ORD-2023-002",
        date: "2023-05-16T09:15:00",
        amount: 24.99,
        status: "approved",
        items: [{ id: 3, title: "The Science of Everything", quantity: 1, price: 24.99 }],
        paymentMethod: "Bank Transfer",
        paymentDate: "2023-05-17T11:30:00",
        downloadUrl: "#",
    },
    {
        id: "INV-2023-003",
        orderId: "ORD-2023-003",
        date: "2023-05-16T11:45:00",
        amount: 18.99,
        status: "rejected",
        items: [{ id: 5, title: "Fantasy World", quantity: 1, price: 18.99 }],
        paymentMethod: "Bank Transfer",
        downloadUrl: "#",
    },
    {
        id: "INV-2023-004",
        orderId: "ORD-2023-004",
        date: "2023-05-17T16:20:00",
        amount: 38.98,
        status: "pending",
        items: [{ id: 4, title: "Bedtime Stories", quantity: 3, price: 12.99 }],
        paymentMethod: "Bank Transfer",
        downloadUrl: "#",
    },
    {
        id: "INV-2023-005",
        orderId: "ORD-2023-005",
        date: "2023-05-18T10:05:00",
        amount: 29.99,
        status: "pending",
        items: [{ id: 6, title: "The History of Art", quantity: 1, price: 29.99 }],
        paymentMethod: "Bank Transfer",
        downloadUrl: "#",
    },
]


export default function Invoices(){

    // State for invoices
    const [invoices] = useState<Invoice[]>(mockInvoices)
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices)

    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("all")

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [invoicesPerPage] = useState(5)

    // State for detailed view
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [showDetailView, setShowDetailView] = useState(false)

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        filterInvoices(term, filterStatus)
    }

    // Handle status filter
    const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as "all" | "pending" | "approved" | "rejected"
        setFilterStatus(status)
        filterInvoices(searchTerm, status)
    }

    // Filter invoices based on search term and status
    const filterInvoices = (term: string, status: "all" | "pending" | "approved" | "rejected") => {
        let result = [...invoices]

        // Apply search
        if (term) {
            const searchLower = term.toLowerCase()
            result = result.filter(
                (invoice) =>
                    invoice.id.toLowerCase().includes(searchLower) ||
                    invoice.orderId.toLowerCase().includes(searchLower) ||
                    invoice.items.some((item) => item.title.toLowerCase().includes(searchLower)),
            )
        }

        // Apply status filter
        if (status !== "all") {
            result = result.filter((invoice) => invoice.status === status)
        }

        setFilteredInvoices(result)
        setCurrentPage(1) // Reset to first page when filters change
    }

    // Get current invoices for pagination
    const indexOfLastInvoice = currentPage * invoicesPerPage
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice)
    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage)

    // Change page
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    // View invoice details
    const viewInvoiceDetails = (invoice: Invoice) => {
        setSelectedInvoice(invoice)
        setShowDetailView(true)
    }

    // Back to invoice list
    const backToInvoiceList = () => {
        setSelectedInvoice(null)
        setShowDetailView(false)
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
    const getStatusBadge = (status: Invoice["status"]) => {
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

    // Print invoice
    const printInvoice = () => {
        window.print()
    }

    return (
        <div className="min-h-screen flex flex-col bg-marfil-suave">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Page header */}
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gris-oscuro">Mis Facturas</h1>
                                <p className="text-gris-medio mt-1">Aquí puedes observar y descargar todas tu facturas</p>
                            </div>


                        </div>
                    </div>

                    {/* User navigation */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                        <div className="p-4 border-b border-gris-medio/20">
                            <nav className="flex space-x-4">
                                <Link
                                    href="/"
                                    className="text-gris-medio hover:text-dorado-elegante px-3 py-2 text-sm font-medium rounded-md"
                                >
                                    Panel Principal
                                </Link>
                                <Link
                                    href="/carrito"
                                    className="text-gris-medio hover:text-dorado-elegante px-3 py-2 text-sm font-medium rounded-md"
                                >
                                    <ShoppingBag className="w-4 h-4 inline-block mr-1" />
                                    Carrito
                                </Link>
                                <Link
                                    href="/shop/invoices"
                                    className="bg-marfil-suave text-dorado-elegante px-3 py-2 text-sm font-medium rounded-md"
                                >
                                    <FileText className="w-4 h-4 inline-block mr-1" />
                                    Facturas
                                </Link>

                            </nav>
                        </div>
                    </div>

                    {/* Invoice list view */}
                    {!showDetailView ? (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Filters */}
                            <div className="p-4 border-b border-gris-medio/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex flex-col md:flex-row gap-4">
                                    {/* Search */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Buscar Facturas ..."
                                            value={searchTerm}
                                            onChange={handleSearch}
                                            className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante w-full md:w-64"
                                        />
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
                                        {searchTerm && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm("")
                                                    filterInvoices("", filterStatus)
                                                }}
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
                                            onChange={handleStatusFilter}
                                            className="pl-10 pr-4 py-2 border border-gris-medio/30 rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante appearance-none w-full md:w-48"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gris-medio" />
                                    </div>
                                </div>
                            </div>

                            {/* Invoices table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-marfil-suave">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gris-oscuro uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gris-medio/20">
                                    {currentInvoices.length > 0 ? (
                                        currentInvoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-marfil-suave/50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <FileText className="h-5 w-5 text-dorado-elegante mr-3" />
                                                        <div>
                                                            <div className="text-sm font-medium text-gris-oscuro">{invoice.id}</div>
                                                            <div className="text-xs text-gris-medio">Order: {invoice.orderId}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gris-medio">{formatDate(invoice.date)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gris-oscuro">${invoice.amount.toFixed(2)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(invoice.status)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => viewInvoiceDetails(invoice)}
                                                        className="text-dorado-elegante hover:text-oro-claro mr-3"
                                                        title="View Invoice"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                    <a
                                                        href={invoice.downloadUrl}
                                                        className="text-azul-noche hover:text-dorado-elegante"
                                                        title="Download Invoice"
                                                        download
                                                    >
                                                        <Download className="h-5 w-5" />
                                                    </a>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-gris-medio">
                                                No invoices found. Try adjusting your search or filters.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {filteredInvoices.length > 0 && (
                                <div className="px-6 py-4 bg-white border-t border-gris-medio/20 flex items-center justify-between">
                                    <div className="text-sm text-gris-medio">
                                        Showing <span className="font-medium">{indexOfFirstInvoice + 1}</span> to{" "}
                                        <span className="font-medium">{Math.min(indexOfLastInvoice, filteredInvoices.length)}</span> of{" "}
                                        <span className="font-medium">{filteredInvoices.length}</span> invoices
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
                    ) : (
                        /* Invoice detail view */
                        selectedInvoice && (
                            <div className="bg-white rounded-lg shadow-md overflow-hidden" id="invoice-detail">
                                {/* Detail header */}
                                <div className="p-4 border-b border-gris-medio/20 flex justify-between items-center">
                                    <button
                                        onClick={backToInvoiceList}
                                        className="inline-flex items-center text-gris-oscuro hover:text-dorado-elegante"
                                    >
                                        <ArrowLeft className="h-5 w-5 mr-2" />
                                        Back to Invoices
                                    </button>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={printInvoice}
                                            className="inline-flex items-center px-3 py-1.5 border border-gris-medio/30 rounded-md text-sm text-gris-oscuro hover:bg-marfil-suave"
                                        >
                                            <Printer className="h-4 w-4 mr-2" />
                                            Print
                                        </button>
                                        <a
                                            href={selectedInvoice.downloadUrl}
                                            download
                                            className="inline-flex items-center px-3 py-1.5 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md text-sm transition-colors"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </a>
                                    </div>
                                </div>

                                {/* Invoice content */}
                                <div className="p-6">
                                    {/* Invoice header */}
                                    <div className="flex flex-col md:flex-row justify-between mb-8">
                                        <div>
                                            <div className="text-2xl font-bold text-dorado-elegante mb-1">ShopCart</div>
                                            <div className="text-gris-medio text-sm">123 Book Street, Reading, CA 90210</div>
                                            <div className="text-gris-medio text-sm">contact@shopcart.com</div>
                                            <div className="text-gris-medio text-sm">+1 (555) 123-4567</div>
                                        </div>
                                        <div className="mt-4 md:mt-0 md:text-right">
                                            <div className="text-xl font-bold text-gris-oscuro">{selectedInvoice.id}</div>
                                            <div className="text-gris-medio text-sm mt-1">Order: {selectedInvoice.orderId}</div>
                                            <div className="text-gris-medio text-sm">Date: {formatDate(selectedInvoice.date)}</div>
                                            <div className="mt-2">{getStatusBadge(selectedInvoice.status)}</div>
                                        </div>
                                    </div>

                                    {/* Customer info */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">Bill To:</h3>
                                        <div className="text-gris-oscuro">John Doe</div>
                                        <div className="text-gris-medio text-sm">123 Customer Street</div>
                                        <div className="text-gris-medio text-sm">Anytown, ST 12345</div>
                                        <div className="text-gris-medio text-sm">customer@example.com</div>
                                    </div>

                                    {/* Invoice items */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-medium text-gris-medio uppercase mb-4">Invoice Items</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gris-medio/20 border border-gris-medio/20 rounded-md">
                                                <thead>
                                                <tr className="bg-marfil-suave">
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-left text-xs font-medium text-gris-oscuro uppercase"
                                                    >
                                                        Item
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-center text-xs font-medium text-gris-oscuro uppercase"
                                                    >
                                                        Quantity
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-right text-xs font-medium text-gris-oscuro uppercase"
                                                    >
                                                        Price
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-4 py-3 text-right text-xs font-medium text-gris-oscuro uppercase"
                                                    >
                                                        Total
                                                    </th>
                                                </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gris-medio/20">
                                                {selectedInvoice.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3 text-sm text-gris-oscuro">{item.title}</td>
                                                        <td className="px-4 py-3 text-sm text-gris-medio text-center">{item.quantity}</td>
                                                        <td className="px-4 py-3 text-sm text-gris-medio text-right">${item.price.toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                                                            ${(item.quantity * item.price).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                                <tfoot>
                                                <tr className="bg-marfil-suave">
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                                                        Subtotal:
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                                                        ${selectedInvoice.amount.toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr className="bg-marfil-suave">
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">
                                                        Tax (0%):
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gris-oscuro text-right">$0.00</td>
                                                </tr>
                                                <tr className="bg-marfil-suave">
                                                    <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gris-oscuro text-right">
                                                        Total:
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-gris-oscuro text-right">
                                                        ${selectedInvoice.amount.toFixed(2)}
                                                    </td>
                                                </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Payment information */}
                                    <div className="mb-8">
                                        <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">Payment Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-gris-oscuro">
                                                    <span className="font-medium">Payment Method:</span> {selectedInvoice.paymentMethod}
                                                </div>
                                                {selectedInvoice.paymentDate && (
                                                    <div className="text-sm text-gris-oscuro">
                                                        <span className="font-medium">Payment Date:</span> {formatDate(selectedInvoice.paymentDate)}
                                                    </div>
                                                )}
                                                <div className="text-sm text-gris-oscuro">
                                                    <span className="font-medium">Payment Status:</span>{" "}
                                                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notes and terms */}
                                    <div className="border-t border-gris-medio/20 pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">Notes</h3>
                                                <p className="text-sm text-gris-oscuro">
                                                    Thank you for your purchase! If you have any questions about this invoice, please contact our
                                                    customer service.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gris-medio uppercase mb-2">Terms & Conditions</h3>
                                                <p className="text-sm text-gris-oscuro">
                                                    Payment is due within 15 days. Please make checks payable to ShopCart or use the bank account
                                                    information provided.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </main>


        </div>
    )

}