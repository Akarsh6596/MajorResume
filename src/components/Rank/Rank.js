
import React, { useState } from "react";
import "./Rank.css";

const Rank = () => {
  const [name, setName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [similarities, setSimilarities] = useState([]);
  const [loading, setLoading] = useState(false); 

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

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

  const handleDescriptionChange = (event) => {
    setJobDescription(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile || !jobDescription || !name) {
      alert("Please enter your name, select a file, and enter a job description.");
      return;
    }
    setSimilarities("");
    setLoading(true); 
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", selectedFile);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("http://localhost:5000/rank-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data from server");
      }


      const data = await response.json();

      const sortedSimilarities = [
        { model: "BART (Abstractive)", similarity: data.bart_similarity, summary: data.bart_summary },
        { model: "BERT (Extractive)", similarity: data.bert_similarity, summary: data.bert_summary },
        { model: "Actual Text", similarity: data.actual_text_similarity, summary: "Actual text" }
      ].sort((a, b) => b.similarity - a.similarity);

      setSimilarities(sortedSimilarities);

      // Save data to MongoDB
      saveToDatabase(data);

    } catch (error) {
      alert("Error connecting to server: " + error.message);
    }
     finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to save received data to MongoDB
  const saveToDatabase = async (data) => {
    try {
      const response = await fetch("http://localhost:5173/api/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          job_description: data.job_description,
          bart_similarity: data.bart_similarity,
          bert_similarity: data.bert_similarity,
          actual_text_similarity: data.actual_text_similarity,
          bart_summary: data.bart_summary,
          bert_summary: data.bert_summary,
          actual_text: data.actual_text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save data to database");
      }

      alert("Data successfully saved to database!");
    } catch (error) {
      alert("Error saving data: " + error.message);
    }
  };

  return (
    <div className="rank-container">
  <h1>Resume Ranking Based on Job Description Similarity</h1>
  
  <div className="rank-inputfields">
    <div className="rank-input-group">
      <label htmlFor="rank-name">Name:</label>
      <input
        id="rank-name"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={handleNameChange}
      />
    </div>

    <div className="rank-input-group">
      <label htmlFor="rank-jobDescription">Job Description:</label>
      <textarea
        id="rank-jobDescription"
        className="rank-textareajd"
        placeholder="Enter Job Description"
        value={jobDescription}
        onChange={handleDescriptionChange}
      />
    </div>

    <div className="rank-input-group">
      <label htmlFor="rank-fileUpload">Upload Resume (PDF):</label>
      <input id="rank-fileUpload" type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  </div>

  <button className="rank-btn" disabled={loading} onClick={handleUpload}>
    Upload and Rank
  </button>

  {loading && (
    <div className="rank-loader-container">
      <div className="rank-spinner"></div>
      <p>Processing...</p>
    </div>
  )}

  {similarities.length > 0 && (
    <div className="rank-output-container">
      <h3>Similarity Rankings:</h3>
      <table className="rank-table">
  <thead>
    <tr>
      <th>Rank</th>
      <th>Model</th>
      <th>Similarity %</th>
    </tr>
  </thead>
  <tbody>
    {similarities.map((item, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.model}</td>
        <td>{item.similarity}%</td>
      </tr>
    ))}
  </tbody>
</table>

{/* Summary Section */}
<div className="rank-summary-container">
  <h3>Generated Summaries:</h3>
  {similarities.map((item, index) => (
    <div key={index} className="rank-summary-box">
      <h4>{item.model} Summary</h4>
      <p>{item.summary}</p>
    </div>
  ))}
</div>

    </div>
  )}
</div>

  );
};

export default Rank;
