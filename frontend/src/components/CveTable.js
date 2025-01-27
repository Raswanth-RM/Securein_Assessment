import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CveTable = () => {
    const [cves, setCves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook to navigate to details page

    useEffect(() => {
        axios.get('http://localhost:5000/cves/list?page=1&limit=10')
            .then(response => {
                setCves(response.data.vulnerabilities || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Failed to fetch data');
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Function to handle row click and navigate to details page
    const handleRowClick = (cveId) => {
        navigate(`/cves/list/${cveId}`);
    };

    return (
        <div style={{ margin: '0 50px' }}>
            {/* Add centered CVE List heading */}
            <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>CVE List</h1>
            
            <h2 style={{ textAlign: 'left', fontWeight: 'bold', color: 'black' }}>Total Records: {cves.length}</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', textAlign: 'center' }}>
                <thead>
                    <tr>
                        <th style={headerStyle}>CVE ID</th>
                        <th style={headerStyle}>Identifier</th>
                        <th style={headerStyle}>Published Date</th>
                        <th style={headerStyle}>Last Modified Date</th>
                        <th style={headerStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {cves.length > 0 ? (
                        cves.map(cve => (
                            <tr key={cve.cve.id} style={rowStyle} onClick={() => handleRowClick(cve.cve.id)}>
                                <td style={cellStyle}>{cve.cve.id}</td>
                                <td style={cellStyle}>{cve.cve.sourceIdentifier}</td>
                                <td style={cellStyle}>{new Date(cve.cve.published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                <td style={cellStyle}>{new Date(cve.cve.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                <td style={cellStyle}>{cve.cve.vulnStatus}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={cellStyle}>No CVEs available.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

// Styles
const headerStyle = {
    border: '1px solid #ddd', 
    padding: '10px', 
    backgroundColor: '#f4f4f4', 
    fontWeight: 'bold'
};

const rowStyle = {
    borderBottom: '1px solid #ddd',
    cursor: 'pointer'
};

const cellStyle = {
    border: '1px solid #ddd', 
    padding: '10px'
};

export default CveTable;
