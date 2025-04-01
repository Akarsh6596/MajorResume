import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [output, setOutput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
      if (file && file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        event.target.value = ""; // Reset file input
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file); 
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    setOutput("")
    setLoading(true); 
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setOutput(data.summary || data.error || "No summary generated.");
    } catch (error) {
      setOutput(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <h1>Upload a resume PDF and get an AI-generated summary using BART Abstractive Summarizer</h1>

      {/* Input group ensures label and input stay in one row */}
      <div className="home-input-group">
        <label htmlFor="home-fileUpload">Upload Resume (PDF):</label>
        <input id="home-fileUpload" type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      <button className="home-btn" onClick={handleUpload}>Upload and Summarize</button>

      {loading ? (
        <div className="home-loader-container">
          <div className="home-spinner"></div>
          <p>Processing...</p>
        </div>
      ) : ""}

      {output && (
        <div className="home-output-container">
          <h2>BART Generated Summary</h2>
          <div className="home-output-box">{output}</div>
        </div>
      )}
    </div>
  );
};

export default Home;
