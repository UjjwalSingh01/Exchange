import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Register() {

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  async function handleRegister() {
    try {
      const response = await axios.post('http://localhost:8787/api/v1/user/register', {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password
      })

      localStorage.setItem("token", response.data.token)

      navigate('/dashboard')

    } catch (error) {
      console.error("Error in Register: ", error);
    }
  }

  return (
    <div>
      <input onChange={(e) => {setFirstname(e.target.value)}} placeholder="Peter" />
      <input onChange={(e) => {setLastname(e.target.value)}} placeholder="Parker" />
      <input onChange={(e) => {setEmail(e.target.value)}} placeholder="Peter@gmail.com" />
      <input onChange={(e) => {setPassword(e.target.value)}} placeholder="Spiderman" />
      <button onClick={() => {handleRegister()}}>Register</button>
    </div>
  )
}

