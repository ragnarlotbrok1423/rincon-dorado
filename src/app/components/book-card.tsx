import Image from "next/image"
import Link from "next/link"

interface BookCardProps {
    id: number
    title: string
    author: string
    price: number
    image: string
    category: string

}

export default function BookCardSimple({
                                           id,
                                           title,
                                           author,
                                           price,
                                           image,
                                           category,

                                       }: BookCardProps) {




    return (
        <div className="overflow-hidden rounded-lg border border-oro-claro/20 bg-white shadow-md transition-all duration-200 hover:shadow-lg">
            {/* Imagen y badges */}
            <div className="relative pt-4 px-4">
                <div className="relative aspect-[2/3] rounded-md overflow-hidden shadow-md mx-auto">
                    <Image
                        src={image || "/placeholder.svg"}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>



            </div>

            {/* Contenido */}
            <div className="p-4">
                <div className="text-xs text-dorado-elegante font-medium mb-1">{category}</div>
                <Link href={`/libro/${id}`}>
                    <h3 className="font-serif font-bold text-gris-oscuro line-clamp-2 mb-1 hover:text-dorado-elegante transition-colors">
                        {title}
                    </h3>
                </Link>
                <p className="text-sm text-gris-medio mb-2">{author}</p>

                {/* Estrellas de valoración */}


                {/* Precio */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gris-oscuro">${price}</span>

                </div>
            </div>

            {/* Footer con botón */}
            <div className="p-4 pt-0">
                <button className="w-full bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro py-2 px-4 rounded-md flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Añadir al carrito
                </button>
            </div>
        </div>
    )
}
