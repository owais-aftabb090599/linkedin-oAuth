
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserDashboard from "./pages/UserDashboard";
import InvestorDahsboard from "./pages/InvestorDahsboard";

function App() {

  // const token = document.cookie = "authToken";
  // console.log(token);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/UserDashboard" element={<UserDashboard />} />
          <Route path="/InvestorDashboard" element={<InvestorDahsboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
