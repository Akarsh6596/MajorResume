import React, { useState } from "react";
import "./Bert.css"; 

const BERT = () => {
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
    setOutput("");
    setLoading(true); 
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/upload-pdf-bert", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setOutput(data.summary || data.error);
    } catch (error) {
      alert("Error connecting to server");
    }
    finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bert-container">
      <h1>Upload a resume PDF and get an AI-generated summary using BERT Extractive Summarizer</h1>

      {/* Input group with label & file input */}
      <div className="bert-input-group">
        <label htmlFor="bert-fileUpload">Upload Resume (PDF):</label>
        <input id="bert-fileUpload" type="file" accept="application/pdf" onChange={handleFileChange} />
      </div>

      <button className="bert-btn" onClick={handleUpload}>Upload and Summarize</button>

      {loading ? (
        <div className="bert-loader-container">
          <div className="bert-spinner"></div>
          <p>Processing...</p>
        </div>
      ) : ""}

      {output && (
        <div className="bert-output-container">
          <h2>BERT Generated Summary</h2>
          <div className="bert-output-box">{output}</div>
        </div>
      )}
    </div>
  );
};

export default BERT;
