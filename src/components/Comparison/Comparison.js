import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Comparison = () => {
  const [summaries, setSummaries] = useState([]);
  const [bartHigherCount, setBartHigherCount] = useState(0);
  const [bertHigherCount, setBertHigherCount] = useState(0);
  const [actualHigherCount, setActualHigherCount] = useState(0);
  const [bartHigherCount2, setBartHigherCount2] = useState(0);
  const [bertHigherCount2, setBertHigherCount2] = useState(0);
  const [totalResumes, setTotalResumes] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5173/api/summaries")
      .then((response) => response.json())
      .then((data) => {
        setSummaries(data);
        setTotalResumes(data.length);

        let bartCount = 0, bertCount = 0, actualCount = 0;
        let bartCount2 = 0, bertCount2 = 0;
        data.forEach((item) => {
          const highest = Math.max(item.bart_similarity, item.bert_similarity, item.actual_text_similarity);

          if (highest === item.bart_similarity) {
            bartCount++;
          } else if (highest === item.bert_similarity) {
            bertCount++;
          } else if (highest === item.actual_text_similarity) {
            actualCount++;
          }
        });
        data.forEach((item) => {
          if (item.bart_similarity > item.bert_similarity) {
            bartCount2++;
          } else if (item.bert_similarity > item.bart_similarity) {
            bertCount2++;
          }
          // actualSum+=item.actual_text_similarity;
         //console.log(item.actual_text_similarity);
          // bartSum += item.bart_similarity;
          // bertSum += item.bert_similarity;
        });
        setBartHigherCount2(bartCount2);
        setBertHigherCount2(bertCount2);
       // console.log(bartCount,bertCount,actualCount)
        setBartHigherCount(bartCount);
        setBertHigherCount(bertCount);
        setActualHigherCount(actualCount);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ width: "50%",height:"250px", margin: "auto", textAlign: "center" }}>
      <h2>Resume Similarity Comparison</h2>
      <h3>Total Resumes: {totalResumes}</h3>

      {/* Overall Similarity Count */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", width: "940px" }}>
  <div style={{ 
    width: "900px", 
    marginLeft: "-20%", 
    display: "flex", 
    justifyContent: "space-between", 
    flexWrap: "wrap", 
    gap: "0px" 
  }}>
    <div style={{ marginBottom: "30px", width: "420px" }}>
      <h3>Comparision of similarity Count between BART v/s BERT v/s Actual text </h3>
      <Bar
        data={{
          labels: ["BART Higher Count", "BERT Higher Count", "Actual Text Higher Count"],
          datasets: [
            {
              label: "Number of Resumes",
              data: [bartHigherCount, bertHigherCount, actualHigherCount],
              backgroundColor: ["green", "red", "yellow"],
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true, 
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
    <div style={{ marginBottom: "30px", width: "420px" }}>
      <h3>Comparion of BERT v/s BART Similarity Count</h3>
      <Bar
        data={{
          labels: ["BART Higher Count", "BERT Higher Count"],
          datasets: [
            {
              label: "Number of Resumes",
              data: [bartHigherCount2, bertHigherCount2],
              backgroundColor: ["rgba(75, 192, 192, 0.6)", "red"],
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  </div>
</div>

      {/* Per-Resume Similarity Charts */}
      <h3>Per-Resume Similarity</h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          gap: "20px",
          width:"1100px",
          marginLeft:"-25%",
          
        }}
      >
        {summaries.map((item, index) => (
          <div
            key={index}
            style={{
              width: "30%",
              minWidth: "280px",
              maxWidth: "400px",
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <h4>{item.name}'s-resume</h4>
            <Bar
              data={{
                labels: ["BART", "BERT", "Actual Text"],
                datasets: [
                  {
                    label: "Similarity (%)",
                    data: [item.bart_similarity, item.bert_similarity, item.actual_text_similarity],
                    backgroundColor: ["green", "red", "yellow"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comparison;
