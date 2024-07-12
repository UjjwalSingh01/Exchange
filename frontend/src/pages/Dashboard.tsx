import { useEffect, useState } from 'react'
import Header  from '../component/Header';
import AmountCard from '../component/AmountCard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

interface Account {
  balance: number,
  tt_credit: number,
  tt_debit: number
}

interface TransactionDetails {
  name: string,
  date: string,
  amount: number
}

export function Dashboard() {

  const [user, setUser] = useState("");

  const [transaction, setTransaction] = useState<TransactionDetails[]>([]);

  const [account, setAccount] = useState<Account>({
    balance: 0,
    tt_credit: 0,
    tt_debit: 0
  });
  
  const navigate = useNavigate()
 
  useEffect(() => {
    const fetchDetails = async () => {
  
        try {
          const response = await axios.get('http://localhost:8787/api/v1/transaction/decode/getDetails', {
            headers: { "Authorization": localStorage.getItem("token") }
          });
          
          setTransaction(response.data.transaction); 
          setUser(response.data.user);
          setAccount(response.data.account);

          // console.log(response.data.account)
          // console.log(response.data.transaction); 
          // console.log(response.data.user);
          
        } catch (error) {
          console.error("Error in Fetching Details: ", error);
        }
      };
  
      fetchDetails();
  }, [])

 
  return (
    <>
        <Header firstname={user}/>
        <div className='grid grid-cols-2 items-center gap-10 m-10'>
            <AmountCard heading='Balance' amount={account.balance}/>
            
            <div className='flex justify-center text-center' >
              <div className="block w-1/2 p-6 bg-white border border-gray-200 rounded-lg drop-shadow-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h1 onClick={async() => {navigate('/transfer')}} className="text-2xl">Send Money</h1>
              </div>
            </div>

            <AmountCard heading='Total Credit' amount={account.tt_credit}/>
            <AmountCard heading='Total Debit' amount={account.tt_debit}/>
        </div>
        <div className='flex justify-center'>
          <div className='flex justify-between w-10/12 gap-4'>
            
              {/* <div className='bg-red-300'>
                  <svg className="w-4 h-4 justify-center text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div> */}
              <div className=' w-full'>
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <input type="search" className="block ps-10 w-full text-lg text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
              </div>
              <button type="submit" className="text-white mb-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            
          </div>  
        </div>
        <div className='flex items-center flex-col'>
          {transaction.map((tx) => {
            return (
              <>
                <div className='flex mx-20 m-3 justify-between w-1/2 bg-slate-200 rounded-2xl'>
                  <div className='flex m-1 ml-10 gap-10 justify-center'>
                    <p className='text-xl py-1 px-2'>
                      {tx.name}
                    </p>
                  </div>
                  <p className='self-center text-sm px-2'>
                      {tx.date}
                  </p>
                  <p className='self-center text-xl m-1 mr-20 px-2 py-1'>
                    {tx.amount}
                  </p>
                </div>
              </>
            )
          })}
        </div>
         
    </>
  )
}
