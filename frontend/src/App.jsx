import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react'
import LandingPage from "./components/pages/LandingPage";
import NotFound from "./components/pages/NotFound";
import ServicePage from "./components/pages/ServicePage";
import AuthPage from "./components/pages/AuthPage";
import EmailVerification from "./components/pages/EmailVerification";
import ListingPage from "./components/pages/ListingPage";
import ListingDetail from "./components/pages/ListingDetail";
import PaymentCompletion from "./components/pages/PaymentCompletion";
import BookingsPage from "./components/pages/BookingPage";

function App() {
  const [user,setUser] = useState({})
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
        const setUserFromLS = async ()=>{
          const authToken = localStorage.getItem('authToken');
          const res = await fetch(`${API_URL}/api/v1/check-login`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          if (data.success) {
            setUser({...data.user,token:authToken})
          }else{
            setUser({})
          }
        }
        setUserFromLS()
  },[])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage user={user} setUser={setUser} />} />
          <Route path="/homes" element={<LandingPage user={user} setUser={setUser} />} />
          <Route path="/services" element={<ServicePage user={user} setUser={setUser} />} />
          <Route path="/login" element={<AuthPage user={user} setUser={setUser} mode="login" />} />
          <Route path="/register" element={<AuthPage user={user} setUser={setUser} mode="register" />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/list" element={<ListingPage user={user} setUser={setUser}/>} />
          <Route path="/listing/:listingId" element={<ListingDetail user={user} setUser={setUser}/>}/>
          <Route path="/bookings" element={<BookingsPage user={user} setUser={setUser}/>}/>
          <Route path="/success" element={<PaymentCompletion mode={"success"}/>}/>
          <Route path="/cancel" element={<PaymentCompletion mode={"cancel"}/>}/>
          
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
