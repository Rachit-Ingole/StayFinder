import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react'
import LandingPage from "./components/pages/LandingPage";
import NotFound from "./components/pages/NotFound";
import ServicePage from "./components/pages/ServicePage";
import AuthPage from "./components/pages/AuthPage";
import EmailVerification from "./components/pages/EmailVerification";
import ListingPage from "./components/pages/ListingPage";
import ListingDetail from "./components/pages/ListingDetail";

function App() {
  const [user,setUser] = useState({})

  useEffect(() => {
        const setUserFromLS = async ()=>{
          const authToken = localStorage.getItem('authToken');
          const res = await fetch('/api/v1/check-login', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          });
          if (res.success) {
            setUser({...req.user,...authToken})
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
          <Route path="/login" element={<AuthPage setUser={setUser} mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/list" element={<ListingPage user={user} setUser={setUser}/>} />
          <Route path="/listing/:listingId" element={<ListingDetail user={user} setUser={setUser}/>}/>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
