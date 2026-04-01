import React, { useContext, useState, useEffect } from 'react';
import { ProjectContext } from '../../context/ProjectContext';
import AddProjectModal from '../modals/AddProjectModal';

const HomeView = () => {
  const { projects, setActiveProjectId, setCurrentView } = useContext(ProjectContext);
  const [showModal, setShowModal] = useState(false);
  const [locationStr, setLocationStr] = useState(''); // State to hold the location

  const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  // Fetch location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
            .then(res => res.json())
            .then(data => {
              const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || "Unknown place";
              setLocationStr(`, ${city}, ${data.address.country}`);
            })
            .catch(err => console.log("Failed to fetch location data:", err));
        },
        (err) => console.log("Geolocation permission denied or failed.", err)
      );
    }
  }, []);

  return (
    <div className="view-container active">
      <h1 className="hero-title">Welcome back, Srijan</h1>
      
      {/* Date and dynamic location string */}
      <p className="hero-sub">- {dateStr}{locationStr}</p>
      
      <div className="project-grid">
        <div className="create-project" onClick={() => setShowModal(true)}>
          <span style={{fontSize: '18px', fontWeight: '700'}}>+ Create New Project</span>
        </div>
        {projects.map(p => (
          <div key={p.id} className="project-link-card" onClick={() => { setActiveProjectId(p.id); setCurrentView('dashboard'); }}>
            <h3>{p.name}</h3>
          </div>
        ))}
      </div>
      {showModal && <AddProjectModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default HomeView;