const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 5000;

app.use(express.json());

app.get('/cves/list', async (req, res) => {
  try {
    
    const response = await axios.get('https://services.nvd.nist.gov/rest/json/cves/2.0');

    const data = response.data;
    if (!data.result || !data.result.CVE_Items) {
      throw new Error('Invalid data from NIST API');
    }

    res.json({
      vulnerabilities: data.result.CVE_Items, // Send the vulnerabilities data
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
