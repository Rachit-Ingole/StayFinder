import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import LandingPage from "./components/pages/LandingPage";
import NotFound from "./components/pages/NotFound";
import ServicePage from "./components/pages/ServicePage";
import AuthPage from "./components/pages/AuthPage";
import EmailVerification from "./components/pages/EmailVerification";
import ListingPage from "./components/pages/ListingPage";

function App() {
  const [user,setUser] = useState({})

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
          <Route path="/list" element={<ListingPage />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
