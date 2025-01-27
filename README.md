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

## Setup

To get started with this project, follow the steps below:

### Prerequisites

- Node.js and npm installed. If not, you can download and install them from [here](https://nodejs.org/).

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/Securein_Assesment.git
   cd securein
   
