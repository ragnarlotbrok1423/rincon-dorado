import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export default function Home() {
  return (
    <div className="min-h-screen bg-oxford-blue">
      <h1
        className={`text-3xl font-bold pt-10 text-white font-roboto-condensed text-center  ${roboto.className}`}
      >
        Menú de navegación
      </h1>

        {/* Menu de navegacion */}

      <div className="flex-col justify-center mt-20">

          <div className="flex justify-center items-center gap-6">
              {/* card de plataforma digital */}
              <Link href="/shop">

              <div className="p-5 bg-sapphire rounded-lg shadow-lg  ">



                  <h2
                      className={`text-2xl font-bold text-white font-roboto-condensed text-center font-roboto`}
                  >
                      Plataforma Digital
                  </h2>
                  <Image
                      src="/shop.svg"
                      alt="Logo"
                      width={300}
                      height={200}                      className=" mt-5 mx-auto"
                  />
              </div>
              </Link>
              {/* card de interfaz de interacción */}

              <Link href="/carrito"  >
              <div className="p-5 bg-sapphire rounded-lg shadow-lg ">

                  <h2 className={`text-2xl font-bold text-white text-center ${roboto.className}`}>Interfaz de Interacción</h2>
                  <Image
                      src="/interaction.svg"
                      alt="interaccion"
                      width={300}
                      height={200}
                      className=" mt-5 mx-auto"
                  />
              </div>
              </Link>
              {/* card de Sistema de pago electronico */}
                <Link href="/shop/invoices">
              <div className="p-5 bg-sapphire rounded-lg shadow-lg">

                  <h2 className={`text-2xl font-bold text-white text-center ${roboto.className}`}>Sistema de Pago Electrónico</h2>
                  <Image
                      src="/payment.svg"
                      alt="interaccion"
                      width={300}
                      height={200}
                      className=" mt-5 mx-auto"
                  />
              </div>
                </Link>


          </div>




      </div>
    </div>
  );
}
