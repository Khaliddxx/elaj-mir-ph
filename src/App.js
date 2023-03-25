import logo from "./logo.svg";
import { useState, useEffect } from "react";
import "./App.scss";
import Dashboard from "./Pages/Dashboard";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Navigate,
  Routes,
} from "react-router-dom";

import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";

import { UserContext } from "./Context/UserContext";

function App() {
  const [user, setUser] = useState({
    token: localStorage.getItem("token"),
    email: "",
    isAuthenticated: false,
    id: "",
    type: "",
  });
  const handleLogin = (token, email, id, type) => {
    localStorage.setItem("token", token);
    const newUser = {
      token,
      email: email,
      isAuthenticated: true,
      id: id,
      type: type,
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser({
      token: null,
      email: "",
      isAuthenticated: false,
      id: "",
      type: "",
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  return (
    <UserContext.Provider>
      <div className="App">
        {/* <Navigation></Navigation> */}
        <Router>
          <UserContext.Provider value={{ user, handleLogin }}>
            <div className="bar">
              {!user.isAuthenticated && (
                <>
                  <Link className="head-text" to="/login">
                    Login
                  </Link>
                  {/* <Link className="head-text" to="/register">
                    Register
                  </Link> */}
                </>
              )}

              {user.isAuthenticated && (
                <>
                  <Link className="head-text" to="/dashboard">
                    Dashboard
                  </Link>
                </>
              )}
              {user.isAuthenticated && user.type == "deliveryManager" && (
                <Link className="head-text" to="/register">
                  Add Pharmacy
                </Link>
              )}
              {user.isAuthenticated && user.type == "superAdmin" && (
                <Link className="head-text" to="/approval">
                  Approval
                </Link>
              )}
              {user.isAuthenticated && (
                <button className="logout-btn head-text" onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            </Routes>
          </UserContext.Provider>
        </Router>
      </div>
    </UserContext.Provider>
  );
}

export default App;
