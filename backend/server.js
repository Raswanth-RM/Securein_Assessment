const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const app = express();
const PORT = 5000;

app.use(express.json());

// Function to fetch and store CVEs
const fetchAndStoreCVEs = async () => {
  try {
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');
    const data = response.data;
    if (!data.result || !data.result.CVE_Items) {
      throw new Error('Invalid data from NIST API');
    }

    // Data Cleansing
    const cleanedData = data.result.CVE_Items.map(cve => ({
      id: cve.cve.id,
      sourceIdentifier: cve.cve.sourceIdentifier,
      published: new Date(cve.cve.published).toISOString().split('T')[0], // Format date
      lastModified: new Date(cve.cve.lastModified).toISOString().split('T')[0], // Format date
      vulnStatus: cve.cve.vulnStatus,
      descriptions: cve.cve.descriptions.filter(desc => desc.lang === 'en'), // Filter English descriptions
      metrics: cve.metrics
    }));

    // Store cleanedData in your database here
    console.log('CVEs fetched and stored successfully');

  } catch (err) {
    console.error('Error fetching data:', err.message);
  }
};

// Schedule the task to run every hour
cron.schedule('0 * * * *', fetchAndStoreCVEs);

app.get('/cves/list', async (req, res) => {
  try {
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');

    const data = response.data;
    if (!data.result || !data.result.CVE_Items) {
      throw new Error('Invalid data from NIST API');
    }

    // Data Cleansing
    const cleanedData = data.result.CVE_Items.map(cve => ({
      id: cve.cve.id,
      sourceIdentifier: cve.cve.sourceIdentifier,
      published: new Date(cve.cve.published).toISOString().split('T')[0], // Format date
      lastModified: new Date(cve.cve.lastModified).toISOString().split('T')[0], // Format date
      vulnStatus: cve.cve.vulnStatus,
      descriptions: cve.cve.descriptions.filter(desc => desc.lang === 'en'), // Filter English descriptions
      metrics: cve.metrics
    }));

    res.json({
      vulnerabilities: cleanedData, // Send the cleaned vulnerabilities data
      totalResults: data.result.totalResults, // Send the total number of results
    });

  } catch (err) {
    console.error('Error fetching data:', err.message); // Log the error for debugging
    res.status(500).json({ message: 'Failed to fetch data from NIST API', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
