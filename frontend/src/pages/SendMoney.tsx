import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export function SendMoney(){
    
    const [amount,setAmount] = useState("");
    const navigate = useNavigate();

    async function handleSend() {
        try {
            axios.post('http://localhost:8787/api/v1/transaction/decode/transfer', {
                amount: amount,
                to_id: ,
                to_name: ,
                from_name: 
            })
        } catch (error) {
            console.error("Error in Sending Money: ", error)
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <h1 className="mb-2 text-xl ">Exchange</h1>
            <input onChange={(e)=>{
                const value=e.target.value;
                setAmount(value);
            }} className="pl-2 mb-2 w-[30%] h-[40px] border-solid border-2 border-black" type="text" placeholder="Enter Amount"></input>
            
            <button onClick={() => {handleSend()}} className="bg-sky-500 rounded-md w-20 h-10" >Send</button>
        </div>
    )
} 