import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/authcontext'
import Home from './components/Pages/Home.jsx'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;