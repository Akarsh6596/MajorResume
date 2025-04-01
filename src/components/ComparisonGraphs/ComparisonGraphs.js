import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
//import "./ComparisonV2.css";

const ComparisonGraphs = () => {
  //const [summaries, setSummaries] = useState([]);
  const [resumeNames, setResumeNames] = useState([]);
  const [bartData, setBartData] = useState([]);
  const [bertData, setBertData] = useState([]);
  const [actualData, setActualData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5173/api/summaries")
      .then((response) => response.json())
      .then((data) => {
       // setSummaries(data);
        setResumeNames(data.map((item) => item.name));
        setBartData(data.map((item) => item.bart_similarity));
        setBertData(data.map((item) => item.bert_similarity));
        setActualData(data.map((item) => item.actual_text_similarity));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage (%)",
          font: {
            size: 14,
            weight: "bold",
            color: "black",
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Resume Name",
          font: {
            size: 14,
            weight: "bold",
            color: "black", 
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h2>Resume Similarity Comparison</h2>
      
      {/* First Line Graph: BART vs BERT */}
      <h3>BART vs BERT Similarity</h3>
      <div style={{ height: "350px", width:"1000px",margin:"auto" }}>
        <Line
          data={{
            labels: resumeNames,
            datasets: [
              {
                label: "BART Similarity (%)",
                data: bartData,
                borderColor: "orange",
                backgroundColor: "rgba(255, 165, 0, 0.5)",
                fill: false,
              },
              {
                label: "BERT Similarity (%)",
                data: bertData,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.5)",
                fill: false,
              },
            ],
          }}
          options={lineChartOptions}
        />
      </div>

      {/* Second Line Graph: BART vs BERT vs Actual Text */}
      <h3>BART vs BERT vs Actual Text Similarity</h3>
      <div style={{ height: "350px",width:"1000px",margin:"auto" }}>
        <Line
          data={{
            labels: resumeNames,
            datasets: [
              {
                label: "BART Similarity (%)",
                data: bartData,
                borderColor: "orange",
                backgroundColor: "rgba(255, 165, 0, 0.5)",
                fill: false,
              },
              {
                label: "BERT Similarity (%)",
                data: bertData,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.5)",
                fill: false,
              },
              {
                label: "Actual Text Similarity (%)",
                data: actualData,
                borderColor: "teal",
                backgroundColor: "rgba(0, 128, 128, 0.5)",
                fill: false,
              },
            ],
          }}
          options={lineChartOptions}
        />
      </div>
    </div>
  );
};

export default ComparisonGraphs;
