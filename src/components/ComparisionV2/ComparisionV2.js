import React, { useEffect, useState } from "react";
import "chart.js/auto";
import "./ComparisionV2.css";

const ComparisonV2 = () => {
  const [summaries, setSummaries] = useState([]);
  const [totalResumes, setTotalResumes] = useState(0);
  const [bartPerfAvg, setBartPerfAvg] = useState(0);
  const [bertPerfAvg, setBertPerfAvg] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5173/api/summaries")
      .then((response) => response.json())
      .then((data) => {
        setSummaries(data);
        setTotalResumes(data.length);

        let bartPerfSum = 0,
          bertPerfSum = 0;

        data.forEach((item) => {
          let bartPerf = (item.bart_similarity / item.actual_text_similarity) * 100;
          let bertPerf = (item.bert_similarity / item.actual_text_similarity) * 100;

          bartPerfSum += bartPerf;
          bertPerfSum += bertPerf;
        });

        setBartPerfAvg((bartPerfSum / data.length).toFixed(2));
        setBertPerfAvg((bertPerfSum / data.length).toFixed(2));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="comp-container">
      <h2>Resume Similarity Comparison</h2>
      <h3>Total Resumes: {totalResumes}</h3>

      {/* Per-Resume Similarity Table */}
      <h3>Similarity Index</h3>
      <table className="comp-table">
        <thead>
          <tr>
            <th>Resume Name</th>
            <th>BART Similarity (%)</th>
            <th>BERT Similarity (%)</th>
            <th>Actual Text Similarity (%)</th>
            <th>BART Performance (%)</th>
            <th>BERT Performance (%)</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((item, index) => {
            const bartPerf = ((item.bart_similarity / item.actual_text_similarity) * 100).toFixed(2);
            const bertPerf = ((item.bert_similarity / item.actual_text_similarity) * 100).toFixed(2);

            return (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.bart_similarity.toFixed(2)}</td>
                <td>{item.bert_similarity.toFixed(2)}</td>
                <td>{item.actual_text_similarity.toFixed(2)}</td>
                <td>{bartPerf}</td>
                <td>{bertPerf}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Summary Table with Averages */}
      <h3>Overall Performance Summary</h3>
      <table className="comp-summary-table">
        <thead>
          <tr>
            <th>Model</th>
            <th>Overall Performance (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BART</td>
            <td>{bartPerfAvg}</td>
          </tr>
          <tr>
            <td>BERT</td>
            <td>{bertPerfAvg}</td>
          </tr>
        </tbody>
      </table>

      <div className="comp-margbtm"></div>
    </div>
  );
};

export default ComparisonV2;
