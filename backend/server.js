const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the CORS middleware
const CVE = require('./models/cve'); // Import the model

const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend's origin
})); // This will allow all domains by default (you can restrict this to only allow specific domains if needed)
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cveDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Fetch and save CVE data
app.get('/cves/list', async (req, res) => {
    const { page, limit } = req.query;
    try {
        const response = await axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?startIndex=${(page - 1) * limit}&resultsPerPage=${limit}`);

        // Store vulnerabilities data
        const vulnerabilities = response.data.vulnerabilities.map(vul => ({
            id: vul.cve.id,
            published: vul.cve.published,
            lastModified: vul.cve.lastModified,
            description: vul.cve.descriptions[0]?.value || 'No description available',
            severity: vul.cve.metrics?.cvssMetricV2[0]?.baseSeverity || 'Unknown',
            references: vul.cve.references.map(ref => ref.url),
        }));

        // Save CVE data into MongoDB
        const newCve = new CVE({
            vulnerabilities: vulnerabilities
        });
        await newCve.save();

        res.json(response.data); // Send the response to the client
    } catch (error) {
        console.error("Error fetching CVEs:", error);
        res.status(500).json({ message: 'Failed to fetch CVE data' });
    }
});

// Fetch all saved CVE data
app.get('/cves/fetch', async (req, res) => {
    try {
        const cves = await CVE.find(); // Fetch all CVEs from MongoDB
        res.json(cves); // Return the data to the client
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch saved CVE data from the database' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
