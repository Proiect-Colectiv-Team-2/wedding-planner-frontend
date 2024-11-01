import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import MyEvents from "./pages/Events/MyEvents.jsx";
import CreateEvent from "./pages/Events/CreateEvent.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/myevents" element={<MyEvents />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
