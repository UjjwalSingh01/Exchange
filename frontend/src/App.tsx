import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import Transfer from './pages/Transfer'
import { SendMoney } from './pages/SendMoney'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/transfer' element={<Transfer />} />
          <Route path='/sendMoney' element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </div>
      
  )
}

export default App
