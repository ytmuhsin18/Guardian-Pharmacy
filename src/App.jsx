import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Medicines from './pages/Medicines';
import Doctors from './pages/Doctors';
import LabTests from './pages/LabTests';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import MedicineDetails from './pages/MedicineDetails';
import MobileNavbar from './components/MobileNavbar';
import WhatsAppButton from './components/WhatsAppButton';
import CustomerNotification from './components/CustomerNotification';

import SurgicalProducts from './pages/SurgicalProducts';
import Physiotherapy from './pages/Physiotherapy';

function App() {
  return (
    <Router>
      <div className="page-layout">

        <Navbar />
        <CustomerNotification />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/medicine/:id" element={<MedicineDetails />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/surgical-products" element={<SurgicalProducts />} />
            <Route path="/physiotherapy" element={<Physiotherapy />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
        <Footer />
        <MobileNavbar />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;
