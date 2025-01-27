const mongoose = require('mongoose');

// Define the schema for storing CVE vulnerabilities
const cveSchema = new mongoose.Schema({
    vulnerabilities: [
        {
            id: String,
            published: String,
            lastModified: String,
            description: String,
            severity: String,
            references: [String]
        }
    ]
});

module.exports = mongoose.model('CVE', cveSchema);
