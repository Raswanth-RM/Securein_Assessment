import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CveTable from './components/CveTable';
import CveDetails from './components/CveDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/cves/list" element={<CveTable />} />
                <Route path="/cves/list/:cveId" element={<CveDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
