const express = require("express");
const expressAsyncHandler = require("express-async-handler");

const router = express.Router();

// Middleware to parse JSON requests
router.use(express.json());

// GET all summaries
router.get("/summaries", expressAsyncHandler(async (req, res) => {
    const summaryCollection = req.app.get("summaryCollection");

    try {
        const summaries = await summaryCollection.find().toArray();
        res.status(200).json(summaries);
    } catch (error) {
        console.error("Error fetching summaries:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));

// POST new resume ranking data (Ensuring no duplicate name)
router.post("/save-data", expressAsyncHandler(async (req, res) => {
    const summaryCollection = req.app.get("summaryCollection");

    try {
        const { name, job_description, bart_similarity, bert_similarity, actual_text_similarity, bart_summary, bert_summary, actual_text } = req.body;

        // Check if an entry with the same name already exists
        const existingEntry = await summaryCollection.findOne({ name });

        if (existingEntry) {
            return res.status(400).json({ message: "An entry with this name already exists" });
        }

        const newEntry = {
            name,
            job_description,
            bart_similarity,
            bert_similarity,
            actual_text_similarity,
            bart_summary,
            bert_summary,
            actual_text,
            createdAt: new Date()
        };

        await summaryCollection.insertOne(newEntry);
        res.status(201).json({ message: "Data saved successfully!" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get("/test", (req, res) => {
    res.status(200).json({ message: "API is working!" });
});
module.exports = router;
