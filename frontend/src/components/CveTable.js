import React, { useState, useEffect } from "react";
import axios from "axios";

const CveTable = () => {
  const [cves, setCves] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  // Filters
  const [searchCveId, setSearchCveId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchCveData();
  }, [currentPage, resultsPerPage, searchCveId, startDate, endDate, status]);

  const fetchCveData = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/cves/list", {
        params: {
          page: currentPage,
          resultsPerPage,
          cveId: searchCveId || undefined, // Send only if entered
          startDate: startDate || undefined, // Send only if selected
          endDate: endDate || undefined,
          status: status || undefined, // Send only if selected
        },
      })
      .then((response) => {
        setCves(response.data.vulnerabilities || []);
        setTotalResults(response.data.totalResults || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div style={{ margin: "0 50px" }}>
      <h1 style={{ textAlign: "center", fontWeight: "bold", color: "black" }}>
        CVE List
      </h1>
      <h2 style={{ textAlign: "left", fontWeight: "bold", color: "black" }}>
        Total Records: {totalResults}
      </h2>

      {/* Filters */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by CVE ID"
          value={searchCveId}
          onChange={(e) => setSearchCveId(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={inputStyle}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={inputStyle}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
          <option value="">All Statuses</option>
          <option value="Published">Published</option>
          <option value="Modified">Modified</option>
        </select>
        <button onClick={fetchCveData} style={buttonStyle}>Apply Filters</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", textAlign: "center" }}>
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
            cves.map((cve) => (
              <tr key={cve.cve.id} style={rowStyle}>
                <td style={cellStyle}>{cve.cve.id}</td>
                <td style={cellStyle}>{cve.cve.sourceIdentifier}</td>
                <td style={cellStyle}>
                  {new Date(cve.cve.published).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </td>
                <td style={cellStyle}>
                  {new Date(cve.cve.lastModified).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
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

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  padding: "10px",
  marginRight: "10px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  padding: "10px 15px",
  backgroundColor: "#007BFF",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const headerStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  backgroundColor: "#f4f4f4",
  fontWeight: "bold",
};

const rowStyle = {
  borderBottom: "1px solid #ddd",
  cursor: "pointer",
};

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default CveTable;
