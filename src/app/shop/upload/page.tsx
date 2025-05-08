"use client";
import Navbar from "@/app/components/navbar";
import FileUpload from "@/app/components/upload-file";
import {useState} from "react";




    export default function Upload() {
        const [showUpload, setShowUpload] = useState(false)

        return (
            <div className="bg-white">
                <Navbar/>
                <div className="pt-50 flex flex-col justify-center items-center">
                    <div className="max-w-md w-full  text-center">
                        <h1 className="text-3xl font-bold text-gris-oscuro mb-6">Sube un archivo para verificar tu pago</h1>
                        <p className="text-gris-medio mb-8">
                            Haz click en el boton para abrir el modal de subida de archivos. Puedes arrastrar y soltar archivos
                        </p>

                        <button
                            onClick={() => setShowUpload(true)}
                            className="focus:outline-none text-white bg-dorado-elegante hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 "
                        >
                           Verificar pago
                        </button>
                    </div>

                    {showUpload && <FileUpload/>}
                </div>
            </div>
        );
    }