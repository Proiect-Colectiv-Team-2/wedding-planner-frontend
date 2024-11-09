import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import MyEvents from "./pages/Events/MyEvents.jsx";
import CreateEvent from "./pages/Events/CreateEvent.jsx";
import EditEvent from "./pages/Events/EditEvent.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/myevents" element={<MyEvents />} />
                    <Route path="/create-event" element={<CreateEvent />} />
                    <Route path="/edit-event/:id" element={<EditEvent />} />
                    {/* Add other routes here */}
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
