import { useEffect, useState } from 'react'
import  Header  from '../component/Header'
import axios from 'axios'

export default function Transfer() {

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {

        try {

            const response = await axios.get('http://localhost:8787/api/v1/user/users', {
              filter: filter,
              headers: { "Authorization": localStorage.getItem("token") }
            });

            setUsers(response.data.message)
            
          } catch (error) {
            console.error("Error in Fetching Todos: ", error);
          }
    };

    fetchUsers();
  }, [users]); 


  return (
    <>
        <Header />
        <div className="p-5">
            <h1 className="text-2xl"><b>Your Balance: ₹{balance=='' ? '...loading' : balance.toFixed(3)}</b></h1>
        </div>
        <div>
            <h1 className="text-xl px-5"><b>Users</b></h1>
        </div>
        <div className="mx-6 pt-2">
            <input onChange={(e) => {setFilter(e.target.value)}} className="w-full border-2 px-2 h-9" type="text" placeholder="Search users..."></input>
            <button onClick={() => {handleSearch()}}>Search</button>
        </div>
        <div>
            {user.map((usr)=>{
                if(usr.username!=localStorage.getItem('username')){
                return <div className="flex justify-between pt-4 p-3 border-b-2">
                    <div>{usr.firstName.toUpperCase() + " " + usr.lastName.toUpperCase()}</div>
                    <div><button className="border-2 px-1 py-0.5 bg-black text-white rounded-md" onClick={()=>{
                        localStorage.setItem("to",usr._id);
                        navigate('/Payments');
                    }}>Send Money</button></div>
                </div>
                }
            })}
        </div>
    </>
  )
}

