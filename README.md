# SecureIn_Assessment

This is a simple web application built using React, which fetches and displays CVE (Common Vulnerabilities and Exposures) details from a backend API. The application allows users to view detailed information about a specific CVE, including descriptions, severity, CVSS metrics, CPE (Common Platform Enumeration) matches, and more.

## Features

- Displays a list of CVEs fetched from the backend API.
- Clicking on a CVE ID navigates to a detailed view of the selected CVE.
- Displays descriptions in multiple languages.
- Shows CVSS V2 metrics including severity, score, and vector string.
- Displays a table with criteria, match criteria ID, and vulnerable status for CPE matches.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js (Express) with MongoDB (Assumed from your stack).
- **API Communication**: Axios
- **Routing**: React Router
- **State Management**: React `useState` and `useEffect`

## Backend API

The backend exposes two main endpoints:

### 1. `/api/cves`

- **Method**: `GET`
- **Parameters**:
  - `page`: Page number for pagination (default: 1)
  - `per_page`: Number of results per page (default: 10)
  - `year`: Filter by CVE year
  - `score`: Filter by CVSS score
  - `modified_days`: Filter by CVE's last modified date (in days)
  - `sort_by`: Sort results by a field (e.g., `published_date`)
  - `sort_order`: Sort order (`asc` or `desc`)

### 2. `/api/cves/<cve_id>`

- **Method**: `GET`
- **Parameters**:
  - `cve_id`: The unique identifier of the CVE to fetch details for.



## Setup

To get started with this project, follow the steps below:

### Prerequisites

- Node.js and npm installed. If not, you can download and install them from [here](https://nodejs.org/).

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/Securein_Assesment.git
   cd securein

## Output Screenshots
![Screenshot 2025-01-27 171555](https://github.com/user-attachments/assets/310193ab-84f2-49ec-b3f2-ebab329b67d8)
![Screenshot 2025-01-27 171623](https://github.com/user-attachments/assets/ca7d26f2-f94b-42f8-8009-c517937c28e1)
![Screenshot 2025-01-27 170906](https://github.com/user-attachments/assets/c7351865-dad5-4614-9cf2-0e7d0c683eef)


