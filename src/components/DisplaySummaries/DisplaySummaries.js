import React, { useEffect, useState } from "react";
import "./DisplaySummaries.css";

const DisplaySummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummaries();
  }, []);

  const fetchSummaries = async () => {
    try {
      const response = await fetch("http://localhost:5173/api/summaries");
      if (!response.ok) throw new Error("Failed to fetch summaries");

      const data = await response.json();
      setSummaries(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Loading summaries...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="displaysummaries-container">
  <h2>Saved Resume Summaries</h2>
  {summaries.length === 0 ? (
    <p>No summaries available</p>
  ) : (
    <table className="displaysummaries-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Job Description</th>
          <th>BART Summary</th>
          <th>BERT Summary</th>
          <th>Actual Text</th>
        </tr>
      </thead>
      <tbody>
        {summaries.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.job_description}</td>
            <td>{item.bart_summary}</td>
            <td>{item.bert_summary}</td>
            <td>{item.actual_text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

  );
};

export default DisplaySummaries;
