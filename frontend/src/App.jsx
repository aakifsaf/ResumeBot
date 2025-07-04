import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar'; // Import the Navbar
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage
import CreateResumePage from './pages/CreateResumePage'; // Import CreateResumePage
import ResumePreviewPage from './pages/ResumePreviewPage'; // Import ResumePreviewPage
import MyResumesPage from './pages/MyResumesPage'; // Import MyResumesPage

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Navbar /> {/* Add the Navbar here */}
      
      {/* The main content area will now be responsible for its own height if needed */}
      {/* Typically, pages like HomePage will define their own min-height to fill viewport excluding navbar */}
      <main className="flex-grow">
        {/* Removed container and p-8 from here, pages will manage their own padding */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Home Route - Always Accessible */}
          <Route path="/" element={<HomePage />} />
          {/* Protected Routes: */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} /> {/* Default route for authenticated users */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="create-resume" element={<CreateResumePage />} />
            <Route path="resume/:id" element={<ResumePreviewPage />} />
            <Route path="my-resumes" element={<MyResumesPage />} />
            {/* Add other protected routes here */}
          </Route>
          {/* More routes for dashboard etc. will be added later */}
        </Routes>
      </main>

      {/* Optional: A simple footer can be added back if desired, but sticky nav is common */}
      {/* <footer className="bg-gray-800/50 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} AI Resume Composer. All rights reserved.</p>
      </footer> */}
    </div>
  );
}

export default App;
