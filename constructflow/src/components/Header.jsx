import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import "../styles/Header.css";

function Header({ title, role }) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleUserClick = () => {
    if (currentUser) {
      // Show user menu dropdown (future implementation)
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <h1>{title}</h1>
        </div>
        <div className="header-right">
          <button className="icon-btn">
            <span className="icon">🔔</span>
            <span className="badge">3</span>
          </button>

          {currentUser ? (
            <div className="user-menu">
              <div className="user-avatar">
                {currentUser.email?.[0].toUpperCase() || "U"}
              </div>
              <div className="user-info">
                <span className="user-email">{currentUser.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              className="user-icon-btn"
              onClick={handleUserClick}
              title="Sign In"
            >
              <span className="icon">👤</span>
            </button>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

export default Header;
