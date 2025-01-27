const express = require('express');
const router = express.Router();
const Cve = require('../models/cve');

// Get paginated CVE list
router.get('/list', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const cves = await Cve.find().limit(limit).skip((page - 1) * limit);
    const totalRecords = await Cve.countDocuments();
    res.json({ totalRecords, results: cves });
});

// Filter by CVE ID, Year, Score, Last Modified N days
router.get('/filter', async (req, res) => {
    const { cveId, year, score, days } = req.query;
    let query = {};

    if (cveId) query.id = cveId;
    if (year) query.published = new RegExp(`^${year}`);
    if (score) query['metrics.cvssMetricV3.cvssData.baseScore'] = parseFloat(score);
    if (days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        query.lastModified = { $gte: date.toISOString() };
    }
    // ...existing code...
});