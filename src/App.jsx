import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
// import Register from './pages/Register'; // If applicable
import Home from './pages/Home';
import MyEvents from "./pages/Events/MyEvents.jsx";
import CreateEvent from "./pages/Events/CreateEvent.jsx";
import EditEvent from "./pages/Events/EditEvent.jsx";
import EventDetail from "./pages/Events/EventDetail.jsx";
import ParticipantsManagement from "./pages/Events/ParticipantsManagement.jsx";
import ScheduleManagement from "./pages/Events/ScheduleManagement.jsx";
import PhotosGallery from "./pages/Events/PhotosGallery.jsx";
import UploadPhoto from "./pages/Events/UploadPhoto.jsx";
// import ConfirmInvitation from "./pages/ConfirmInvitation.jsx";
import useAuth from "./hooks/useAuth.js";

const ProtectedRoute = ({ children, roles }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/" replace />;
    }

    if (roles && !roles.includes(currentUser.role)) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Login />} />
                    {/*<Route path="/register" element={<Register />} /> /!* Optional *!/*/}

                    {/*/!* Invitation Confirmation Route *!/*/}
                    {/*<Route path="/invite/:invitationLink" element={<ConfirmInvitation />} />*/}

                    {/* Protected Routes */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/myevents"
                        element={
                            <ProtectedRoute>
                                <MyEvents />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/create-event"
                        element={
                            <ProtectedRoute roles={['Organizer']}>
                                <CreateEvent />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/edit-event/:id"
                        element={
                            <ProtectedRoute roles={['Organizer']}>
                                <EditEvent />
                            </ProtectedRoute>
                        }
                    />

                    {/* denested route because it wouldnt redirect otherwise */}

                    <Route
                        path="/events/:id/schedule"
                        element={
                            <ProtectedRoute>
                                <ScheduleManagement />
                            </ProtectedRoute>        
                        }
                    />

                    <Route
                        path="/events/:id/*"
                        element={
                            <ProtectedRoute>
                                <EventDetail />
                            </ProtectedRoute>
                        }
                    >
                        {/* Nested Routes within EventDetail */}
                        <Route
                            path="participants"
                            element={
                                <ProtectedRoute roles={['Organizer']}>
                                    <ParticipantsManagement />
                                </ProtectedRoute>
                            }
                        />

                        

                        <Route
                            path="photos"
                            element={<PhotosGallery />}
                        />

                        <Route
                            path="upload-photo"
                            element={
                                <ProtectedRoute roles={['Participant']}>
                                    <UploadPhoto />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
