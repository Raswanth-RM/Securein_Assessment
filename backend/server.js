const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5001;

mongoose.connect('mongodb://localhost:27017/cveDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const cveSchema = new mongoose.Schema({
    cve: {
        id: String,
        sourceIdentifier: String,
        published: Date,
        lastModified: Date,
        status: String
    }
});

const CVE = mongoose.model('CVE', cveSchema);

app.use(cors());
app.use(express.json());

app.get('/cves/list', async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        
        // Fetch the CVEs from the database with pagination
        const cves = await CVE.find()
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        // Data cleansing: Remove any records with missing necessary fields
        const cleanedCves = cves.filter(cve => {
            // Ensure each CVE has an ID, published date, and status
            return cve.cve && cve.cve.id && cve.cve.published && cve.cve.status;
        });

        // Optional: Format dates to ISO format (if necessary)
        cleanedCves.forEach(cve => {
            if (cve.cve.published) {
                cve.cve.published = new Date(cve.cve.published).toISOString(); // Convert to ISO string if not already
            }
            if (cve.cve.lastModified) {
                cve.cve.lastModified = new Date(cve.cve.lastModified).toISOString(); // Same for lastModified
            }
        });

        // Get the total count of CVEs for pagination
        const totalRecords = await CVE.countDocuments();

        // Send the cleaned and paginated response
        res.json({ totalRecords, results: cleanedCves });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch CVEs' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
