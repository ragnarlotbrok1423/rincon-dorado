import BookCardSimple from "@/app/components/book-card"

// Datos de ejemplo para los libros
const featuredBooks = [
    {
        id: 1,
        title: "Alas de Sangre",
        author: "Rebecca Yarros",
        price: 19.99,
        image: "/alasSangre.png",
        category: "Ficción",

    },
    {
        id: 2,
        title: "La Sombra del Viento",
        author: "Carlos Ruiz Zafón",
        price: 22.99,
        image: "/placeholder.svg?height=450&width=300",
        category: "Misterio",

    },
    {
        id: 3,
        title: "Cien Años de Soledad",
        author: "Gabriel García Márquez",
        price: 18.99,

        image: "/placeholder.svg?height=450&width=300",

        category: "Clásicos",

    },
    {
        id: 4,
        title: "El Principito",
        author: "Antoine de Saint-Exupéry",
        price: 15.99,
        image: "/placeholder.svg?height=450&width=300",

        category: "Infantil",
    },
]

export default function Card() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredBooks.map((book) => (
                        <BookCardSimple key={book.id} {...book} />
                    ))}
                </div>
            </div>
        </section>
    )
}
