import { useEffect, useState } from 'react'
import {Routes,Route, Navigate} from "react-router-dom"
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import {ToastContainer} from "react-toastify"
import MainPage from './pages/MainPage'
import { useAuthStore } from './store/useAuthStore'

function App() {

  const {authUser,checkAuth,isCheckingAuth} = useAuthStore();

useEffect(() => {
  checkAuth()
},[checkAuth])

    if (isCheckingAuth) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className='min-h-screen'>
      <ToastContainer
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
      <Routes>
        <Route path='/register' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/' element={authUser ? <MainPage /> : <Navigate to={"/login"} />} /> 

      </Routes>


    </div>
  )
}

export default App
