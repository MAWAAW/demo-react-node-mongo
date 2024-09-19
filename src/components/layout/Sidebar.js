// src/components/layout/Sidebar.js
import React from 'react';

const Sidebar = () => {
  const handleCreateNewList = () => {
    // Logic to create a new task list
  };

  return (
    <div>
      <button onClick={handleCreateNewList}>Créer une nouvelle liste</button>
      {/* Ajouter la navigation vers différentes listes ici */}
    </div>
  );
};

export default Sidebar;