import React from "react"
import WalletInfo from "./Wallet"

const Navbar = () => {
    return (
        <div className="flex items-center">

            <h1 className="text-4xl text-white font-bold mb-4 ">Identity DApp</h1>     
            <div className="ml-auto">
            <WalletInfo/>  
            
            </div>

     
            
          
            
        </div>

     

    )

}
export default Navbar
 


