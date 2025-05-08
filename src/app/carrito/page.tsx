import Navbar from "@/app/components/navbar";
import CartSummary from "@/app/components/cart-summary";

export default function Carrito (){
    return(
        <div className="bg-white">
            <Navbar/>
            <div className="pt-10">
                <CartSummary/>
            </div>
        </div>
    );
}