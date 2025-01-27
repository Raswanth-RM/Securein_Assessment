import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CveDetails = () => {
    const { cveId } = useParams();
    const [cveDetails, setCveDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/cves/list?page=1&limit=10')
            .then(response => {
                if (response.data && response.data.vulnerabilities) {
                    const vulnerabilities = response.data.vulnerabilities;
                    const cve = vulnerabilities.find(v => v.cve.id === cveId);
                    if (cve) {
                        setCveDetails(cve.cve);
                    } else {
                        setError('CVE not found.');
                    }
                } else {
                    setError('Invalid API response.');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to fetch data from server.');
                setLoading(false);
            });
    }, [cveId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div style={{ padding: '0 20px' }}>
            {/* Display CVE ID */}
            <h1>{cveDetails.id}</h1>

            {/* Display Descriptions */}
            <h3>Descriptions:</h3>
            <ul>
                {cveDetails.descriptions.map((desc, index) => (
                    <li key={index}><strong>{desc.lang}:</strong> {desc.value}</li>
                ))}
            </ul>

            {/* Display Severity, Base Score on the same line */}
            {cveDetails.metrics.cvssMetricV2 && cveDetails.metrics.cvssMetricV2.length > 0 && (
                <div>
                    <h3>CVSS V2 Metrics:</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h5><strong>Severity: </strong>{cveDetails.metrics.cvssMetricV2[0].baseSeverity}</h5>
                        <h5 style={{ marginLeft: '10px' }}><strong>Score: </strong> <span style={{ color: 'red' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.baseScore}</span></h5>
                    </div>

                    {/* Display Vector String with label in the same line */}
                    <h5><strong>Vector String:</strong> {cveDetails.metrics.cvssMetricV2[0].cvssData.vectorString}</h5>
                </div>
            )}

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid black' }}>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Access Vector</th>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Access Complexity</th>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Authentication</th>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Confidentiality Impact</th>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Integrity Impact</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>Availability Impact</th>
                    </tr>
                </thead>
                <tbody>
                    {cveDetails.metrics.cvssMetricV2 && cveDetails.metrics.cvssMetricV2.length > 0 && (
                        <tr style={{ borderBottom: '1px solid black' }}>
                            <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.accessVector}</td>
                            <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.accessComplexity}</td>
                            <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.authentication}</td>
                            <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.confidentialityImpact}</td>
                            <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.integrityImpact}</td>
                            <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px' }}>{cveDetails.metrics.cvssMetricV2[0].cvssData.availabilityImpact}</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Display Exploitability and Impact Scores */}
            <h3>CPE:</h3>
            
            {/* New table with headings Criteria, Match Criteria ID, Vulnerable */}
            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', border: '1px solid black' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid black' }}>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Criteria</th>
                        <th style={{ textAlign: 'center', padding: '10px', borderRight: '1px solid black' }}>Match Criteria ID</th>
                        <th style={{ textAlign: 'center', padding: '10px' }}>Vulnerable</th>
                    </tr>
                </thead>
                <tbody>
                    {cveDetails.configurations && cveDetails.configurations.nodes && cveDetails.configurations.nodes[0].cpeMatch && (
                        cveDetails.configurations.nodes[0].cpeMatch.map((cpe, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid black' }}>
                                <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cpe.criteria}</td>
                                <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px', borderRight: '1px solid black' }}>{cpe.matchCriteriaId}</td>
                                <td style={{ textAlign: 'center', fontSize: '14px', padding: '10px' }}>{cpe.vulnerable ? 'Yes' : 'No'}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CveDetails;
