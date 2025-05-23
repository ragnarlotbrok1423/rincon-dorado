
import Image from "next/image";

export default function HeroSection() {

    return (
        <section className="bg-azul-noche">
            <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div className="mr-auto place-self-center lg:col-span-7">
                    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white">Descubre mundos a través de las páginas</h1>
                    <p className="max-w-2xl mb-6 font-light  lg:mb-8 md:text-lg lg:text-xl text-gray-400">
                        Explora nuestra colección cuidadosamente seleccionada de los mejores libros de todos los géneros y autores.</p>
                    <a href="#"
                       className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-dorado-elegante hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 ">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                  clip-rule="evenodd"></path>
                        </svg>
                    </a>
                    <a href="#"
                       className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center  border border-dorado-elegante rounded-lg  focus:ring-4 text-dorado-elegante   hover:bg-gray-700 focus:ring-gray-800">
                        Speak to Sales
                    </a>
                </div>
                <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <Image src="/alasSangre.png" alt="libro" width={250} height={348} />
                </div>
            </div>
        </section>
    );
}