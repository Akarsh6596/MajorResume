const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const apiRoutes = require("./API/API"); 
app.use(cors());
app.use("/api", apiRoutes);

const PORT = 5173;
const MONGO_URI = "mongodb://127.0.0.1:27017"; // Fixing the MongoDB connection URI{ useUnifiedTopology: true }

// Connect to MongoDB

MongoClient.connect(MONGO_URI )
  .then(client => {
    const db = client.db("majorDB");
    const summaryCollection = db.collection("summary");

    // Store collection in app locals for global access
    app.set("summaryCollection", summaryCollection);

    console.log("Connected to MongoDB and summary collection initialized");
  })
  .catch(err => console.error("Database connection error:", err));



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
