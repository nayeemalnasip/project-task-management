import React from 'react';
import Dashboard from './pages/Dashboard';
import { NotificationProvider } from './context/NotificationContext';
import Notification from './components/Notification';
import Header from './components/Header';


import './styles/App.css';

function App() {
  return (
    <NotificationProvider>
      <div className="app-container">
       
        

        {/* Main content area: Header on top + Dashboard below */}
        <div className="main-content">
          <Header />
          <Dashboard />
        </div>

        {/* Notification container outside main content */}
        <Notification />
      </div>
    </NotificationProvider>
  );
}

export default App;
