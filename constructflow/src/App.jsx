import { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setMessage("Please enter some text");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "submissions"), {
        text: inputText,
        timestamp: new Date(),
        date: new Date().toLocaleDateString(),
      });
      setMessage("Data submitted successfully!");
      setInputText("");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setMessage("Error submitting data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <h1>ConstructFlow</h1>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="input-group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here"
            disabled={isSubmitting}
            className="input-field"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}

export default App;
