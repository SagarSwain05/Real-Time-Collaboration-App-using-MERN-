// Import necessary modules
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [uploadedFile, setUploadedFile] = useState(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (page) => {
    setActivePage(page);
  };

  const handleFileUpload = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="menu-options">
          <p onClick={() => navigateTo('home')}>Home</p>
          <p>Your profile</p>
          <p onClick={() => navigateTo('documents')}>Documents</p>
          <p>Your repositories</p>
          <p>Your Copilot</p>
          <p>Your projects</p>
          <p>Your stars</p>
          <p>Your gists</p>
          <p>Your organizations</p>
          <p>Your enterprises</p>
          <p>Your sponsors</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header>
          <div className="menu-bar" onClick={toggleMenu}>
            &#9776;
          </div>
          <div className="document-icon" onClick={() => navigateTo('documents')}>
            📄
          </div>
          <div className="logo">CollabBody</div>
        </header>

        {activePage === 'home' && (
          <div>
            <div className="welcome-section">
              <h1>Welcome to CollabBody</h1>
              <p>
                Built like a spreadsheet, project tables give you a live canvas to
                filter, sort, and group issues and pull requests. Tailor them to
                your needs with custom fields and saved views.
              </p>
              <button className="learn-more">Learn more</button>
            </div>

            <div className="create-project">
              <h2>Create your first Project & other Documents public</h2>
              <p>
                A customizable, flexible tool for planning and tracking
                your work.
              </p>
              <button className="new-project">New project</button>
            </div>
          </div>
        )}

        {activePage === 'documents' && (
          <div className="documents-page">
            <div className="document-preview">
              {uploadedFile ? (
                <div>
                  <h2>Uploaded Document:</h2>
                  <p>{uploadedFile.name}</p>
                </div>
              ) : (
                <p>No document uploaded yet.</p>
              )}
            </div>
            <div className="upload-section">
              <h1>Upload Your Documents</h1>
              <p>Choose a document from your device to upload.</p>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} />
              <button className="upload-button">Upload</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
