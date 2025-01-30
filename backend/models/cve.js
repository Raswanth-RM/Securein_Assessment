const mongoose = require('mongoose');

const cveSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    sourceIdentifier: String,
    published: Date,
    lastModified: Date,
    vulnStatus: String,
    cveTags: [String],  // Stores tags related to the CVE
    descriptions: [
        {
            lang: String,
            value: String
        }
    ],
    metrics: {
        cvssMetricV2: [
            {
                source: String,
                type: String,
                cvssData: {
                    version: String,
                    vectorString: String,
                    baseScore: Number,
                    accessVector: String,
                    accessComplexity: String,
                    authentication: String,
                    confidentialityImpact: String,
                    integrityImpact: String,
                    availabilityImpact: String
                },
                baseSeverity: String,
                exploitabilityScore: Number,
                impactScore: Number,
                obtainAllPrivilege: Boolean,
                obtainUserPrivilege: Boolean,
                obtainOtherPrivilege: Boolean,
                userInteractionRequired: Boolean
            }
        ],
        cvssMetricV3: [
            {
                source: String,
                type: String,
                cvssData: {
                    version: String,
                    vectorString: String,
                    baseScore: Number,
                    baseSeverity: String,
                    exploitabilityScore: Number,
                    impactScore: Number,
                    attackVector: String,
                    attackComplexity: String,
                    privilegesRequired: String,
                    userInteraction: String,
                    scope: String,
                    confidentialityImpact: String,
                    integrityImpact: String,
                    availabilityImpact: String
                }
            }
        ]
    },
    weaknesses: [
        {
            source: String,
            type: String,
            description: [
                {
                    lang: String,
                    value: String
                }
            ]
        }
    ],
    configurations: [
        {
            nodes: [
                {
                    operator: String,
                    negate: Boolean,
                    cpeMatch: [
                        {
                            vulnerable: Boolean,
                            criteria: String,
                            matchCriteriaId: String
                        }
                    ]
                }
            ]
        }
    ],
    references: [
        {
            url: String,
            source: String
        }
    ]
});

module.exports = mongoose.model('CVE', cveSchema);
