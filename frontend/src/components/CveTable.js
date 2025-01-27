import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CveTable = () => {
  const [cves, setCves] = useState([]);          // CVE records to be displayed
  const [totalResults, setTotalResults] = useState(0);  // Total number of results for pagination
  const [loading, setLoading] = useState(true);   // Loading state
  const [error, setError] = useState(null);       // Error state
  const [currentPage, setCurrentPage] = useState(1);     // Current page
  const [resultsPerPage, setResultsPerPage] = useState(10); // Results per page

  useEffect(() => {
    // Fetch CVE data from backend API with pagination
    axios.get(`http://localhost:5000/cves/list`, {
      params: {
        page: currentPage,
        resultsPerPage: resultsPerPage,
      }
    })
    .then(response => {
      setCves(response.data.vulnerabilities || []);
      setTotalResults(response.data.totalResults || 0);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message || 'Failed to fetch data');
      setLoading(false);
    });
  }, [currentPage, resultsPerPage]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div style={{ margin: '0 50px' }}>
      {/* CVE List heading */}
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: 'black' }}>CVE List</h1>
      <h2 style={{ textAlign: 'left', fontWeight: 'bold', color: 'black' }}>
        Total Records: {totalResults}
      </h2>
      
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
              <tr key={cve.cve.id} style={rowStyle}>
                <td style={cellStyle}>{cve.cve.id}</td>
                <td style={cellStyle}>{cve.cve.sourceIdentifier}</td>
                <td style={cellStyle}>
                  {new Date(cve.cve.published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td style={cellStyle}>
                  {new Date(cve.cve.lastModified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
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

      {/* Pagination Controls */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Styles for table
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
