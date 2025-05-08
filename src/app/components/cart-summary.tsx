import { Trash2 } from "lucide-react"
import Link from "next/link";

const cartItems = [
    {
        id: 1,
        name: "Premium Leather Wallet",
        price: 59.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 3,
        name: "Smart Watch",
        price: 199.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        id: 4,
        name: "Portable Charger",
        price: 49.99,
        quantity: 1,
        image: "/placeholder.svg?height=80&width=80",
    },
]

export default function CartSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = 9.99
    const total = subtotal + shipping

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gris-oscuro mb-4">Carrito</h2>

            <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gris-medio/20">
                        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-16 h-16 object-contain" />
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gris-oscuro">{item.name}</h3>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-dorado-elegante font-semibold">${item.price}</span>
                                <div className="flex items-center">
                                    <button className="w-6 h-6 flex items-center justify-center border border-gris-medio/30 rounded-l-md">
                                        -
                                    </button>
                                    <span className="w-8 h-6 flex items-center justify-center border-t border-b border-gris-medio/30">
                    {item.quantity}
                  </span>
                                    <button className="w-6 h-6 flex items-center justify-center border border-gris-medio/30 rounded-r-md">
                                        +
                                    </button>
                                    <button className="ml-2 text-gris-medio hover:text-vino-profundo">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-2 text-sm mb-6">
                <div className="flex justify-between">
                    <span className="text-gris-medio">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gris-medio">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gris-medio/20">
                    <span className="font-semibold text-gris-oscuro">Total</span>
                    <span className="font-bold text-vino-profundo">${total.toFixed(2)}</span>
                </div>
            </div>
            <Link href="/shop/upload">
            <button className="w-full bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro py-3 rounded-md font-medium transition-colors">
                Seguir con la verificación del pago
            </button>
            </Link>

            <div className="mt-4 text-center text-xs text-gris-medio">
                <p>Free shipping on orders over $100</p>
                <p className="mt-1">Secure payment processing</p>
            </div>
        </div>
    )
}
