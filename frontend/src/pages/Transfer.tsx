import { useEffect, useState } from 'react'
import  Header  from '../component/Header'
import axios from 'axios'
import AmountCard from '../component/AmountCard';
import { useNavigate } from 'react-router-dom';

interface toDetails {
  to_fname: string,
  to_lname: string, 
  to_id: string,
  from_name: string
}

export default function Transfer() {

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("")
  const [balance, setBalance] = useState(0);
  const [user, setUser] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {

        try {

            const response = await axios.get('http://localhost:8787/api/v1/user/decode/users', {
                params : { filter: filter } ,
                headers: { "Authorization": localStorage.getItem('token') } 
              });

            setUsers(response.data.message)
            setBalance(response.data.balance)
            setUser(response.data.user)
            
          } catch (error) {
            console.error("Error in Fetching Users: ", error);
          }
    };

    fetchUsers();
  }, [filter]); 


  return (
    <>
        <Header firstname={user}/>
        <div className="p-5">
            {/* <h1 className="text-2xl"><b>Your Balance: ₹{balance=='' ? '...loading' : balance.toFixed(3)}</b></h1> */}
            <AmountCard heading='Balance' amount={balance}/>
        </div>
        <div>
            <h1 className="text-xl px-5"><b>Users</b></h1>
        </div>
        
        <div className='flex justify-center'>
          <div className='flex justify-between w-10/12 gap-4 mb-4'>
            
              {/* <div className='bg-red-300'>
                  <svg className="w-4 h-4 justify-center text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
              </div> */}
              <div className=' w-full'>
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <input 
                  onChange = {async (e)=>{
                    setFilter(e.target.value)
                  }}
                  type="search" className="block ps-10 w-full text-lg text-gray-900 border border-gray-300 rounded-2xl bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
              </div>
              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            
          </div>  
        </div>
        <div className='flex items-center flex-col'>
            {users.map((usr: toDetails)=>{
                // if(usr.username!=localStorage.getItem('username')){
                return (
                  <div className='flex mx-20 border-2 m-3 justify-between w-3/4 bg-slate-200 rounded-xl'>
                    <div className='flex m-1 ml-10 gap-10 justify-center'>
                    <p className='text-xl py-1 px-2'>
                      {usr.to_fname + " " + usr.to_lname}
                    </p>
                  </div>
                    <div className='self-center mr-6'>
                      <button className="border-2 justify-center px-3 py-1 bg-black text-white rounded-md" onClick={()=>{

                        const to = JSON.stringify(usr)

                        localStorage.setItem("to" , to);
                        navigate('/sendMoney');
                    }}>Send Money</button></div>
                  </div>
                )
                // }
            })}
        </div>
    </>
  )
}

