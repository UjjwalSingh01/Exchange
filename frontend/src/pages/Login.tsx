import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


export default function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin() {
    try {
      const response = await axios.get('http://localhost:8787/api/v1/user/login', {
        email: email,
        password: password
      })

      localStorage.setItem("token", response.data.token)

      navigate('/dashboard')

    } catch (error) {
      console.error("Error in Login: " + error)
    }
  }

  return (
    <div>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Peter@gmail.com" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Spiderman" />
      <button onClick={() => {handleLogin()}}>Login</button>
    </div>
  )
}

