const axios = require('axios');
const Cve = require('../models/cve');
const dotenv = require('dotenv');
dotenv.config();

async function fetchAndStoreCves() {
    let startIndex = 0;
    const resultsPerPage = 1000;
    let totalRecords = 1;

    while (startIndex < totalRecords) {
        const response = await axios.get(process.env.CVE_API_URL, {
            params: { startIndex, resultsPerPage }
        });

        totalRecords = response.data.totalResults;
        const cveItems = response.data.vulnerabilities;

        for (let item of cveItems) {
            await Cve.updateOne({ id: item.cve.id }, item.cve, { upsert: true });
        }

        startIndex += resultsPerPage;
    }

    console.log('CVE Data Updated');
}

module.exports = fetchAndStoreCves;
