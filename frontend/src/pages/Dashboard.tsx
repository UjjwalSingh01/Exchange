import { useEffect, useState } from 'react'
import Header  from '../component/Header';
import AmountCard from '../component/AmountCard'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

export function Dashboard() {

  const [user, setUser] = useState();
  const [transaction, setTransaction] = useState([]);
  const [account, setAccount] = useState([])
  
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
          
        } catch (error) {
          console.error("Error in Fetching Details: ", error);
        }
      };
  
      fetchDetails();
  })

  return (
    <>
        <Header name = {user.firstname} />
        <div>
            <AmountCard />
            <AmountCard />
        </div>
        <div>
            <input onChange={} placeholder='Transaction' />
            <button onClick={}>SEARCH</button>
        </div>
        {transaction.map(tx => {
            return  <div>
                <h1>{tx.to}</h1>
                <span>{tx.date}</span>
                <h2>{tx.amount}</h2>
            </div>
        })}
    </>
  )
}
