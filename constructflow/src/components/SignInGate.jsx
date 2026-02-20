import { useState } from "react";
import AuthModal from "./AuthModal";
import "../styles/SignInGate.css";

function SignInGate({
  title = "Sign in required",
  message = "Please sign in to view this content.",
  showSignInButton = true,
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="signin-gate">
      <h2>{title}</h2>
      <p>{message}</p>
      {showSignInButton && (
        <button className="btn-primary" onClick={() => setShowAuthModal(true)}>
          Sign In
        </button>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default SignInGate;