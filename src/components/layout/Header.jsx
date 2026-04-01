import React, { useContext } from 'react';
import { ProjectContext } from '../../context/ProjectContext';

const Header = ({ toggleSidebar }) => {
  const { setCurrentView, theme, setTheme } = useContext(ProjectContext);
  return (
    <header className="global-header">
      <div className="header-left">
        <div className="hamburger" onClick={toggleSidebar}>☰</div>
        <div className="brand-name" onClick={() => setCurrentView('home')}>TaskMaster</div>
      </div>
      <div className="header-right">
        <div className={`toggle-theme ${theme === 'dark' ? 'toggle-flip' : ''}`} 
             onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          <div className="toggle-btn"></div>
        </div>
      </div>
    </header>
  );
};
export default Header;