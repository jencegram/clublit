//frontend/src/App.jsx

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { decodeToken } from 'react-jwt';
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import UsersBookshelf from "./components/UsersBookshelf";
import CreateBookClubForm from "./components/CreateBookClubForm";
import BookClubs from "./components/BookClubs";
import BookClubDetails from "./components/BookClubDetails";
import StateSelection from "./components/StateSelection";
import StateSpecificBookClubs from "./components/StateSpecificBookClub";
import ProfilePreferences from "./components/ProfilePreferences";
import ForumDetails from "./components/ForumDetails";
import AccountSettings from "./components/AccountSettings";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

     if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserId(decoded.userId); 
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} userId={userId}/>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<Login setLoginStatus={setIsLoggedIn} />}
        />
        <Route
          path="/signup"
          element={<Signup setLoginStatus={setIsLoggedIn} />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard userId={userId} />} />
          <Route
            path="/bookclubs"
            element={<BookClubs showOnlyMine={false} />}
          />
          <Route
            path="/mybookclubs"
            element={<BookClubs showOnlyMine={true} />}
          />
          <Route path="/usersbookshelf" element={<UsersBookshelf />} />
          <Route path="/usersbookshelf/:userId" element={<UsersBookshelf />} />
          <Route path="/createbookclub" element={<CreateBookClubForm />} />
          <Route path="/bookclubs/:clubId" element={<BookClubDetails />} />
          <Route path="/in-person-clubs" element={<StateSelection />} />
          <Route
            path="/in-person-clubs/:stateName"
            element={<StateSpecificBookClubs />}
          />
          <Route path="/forums/:forumId" element={<ForumDetails />} />
          <Route path="/profile/preferences" element={<ProfilePreferences />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
