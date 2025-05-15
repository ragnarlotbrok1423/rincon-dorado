import Navbar from "@/app/components/navbar";
import SearchBar from "@/app/components/seach-bar";
import HeroSection from "@/app/components/hero-section";
import { Roboto } from "next/font/google";
import Card from "@/app/components/card";


const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function Shop (){

    return(
        <div className="bg-white">
            <Navbar />
            <HeroSection />
            <div className="pt-10">

                <h1 className={`text-3xl font-bold text-gris-oscuro ${roboto.className}  text-center mt-10 mb-10`}>
                    Millones de Historias en un Solo Lugar
                </h1>

                <SearchBar />
                <div className="mt-10">
                    <Card />
                </div>

            </div>

        </div>
    )
}