<template>
    <div class="home-page">
      <aside class="sidebar">
        <h3>Navigation/Info</h3>
        <ul>
          <li>Idea</li>
          <li>Importance</li>
          <li>six&eight (?)</li>
          <!-- Weitere Links/Infos -->
        </ul>
      </aside>
      <section class="main-content">
        <h2>Welcome to the AI Music Platform!</h2>
        <p>Bla bla bla, hier steht eine Beschreibung des Projekts, der Idee und des Werts.</p>
        <p>Noch mehr bla bla...</p>
  
        <div class="cta-box">
          <h3>Electric Your First Song!</h3>
          <p>Generate unique music with AI in minutes.</p>
          <router-link to="/create" class="cta-button">Create Now</router-link>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
  };
  </script>
  
  <style scoped>
  .home-page {
    display: flex;
    gap: 20px; /* Abstand zwischen Sidebar und Hauptinhalt */
  }
  
  .sidebar {
    flex: 0 0 200px; /* Feste Breite für die Sidebar */
    border-right: 1px solid #eee;
    padding-right: 20px;
  }
  
  .sidebar h3 {
    margin-top: 0;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar li {
    margin-bottom: 10px;
    cursor: pointer;
    color: #42b983;
  }
  .sidebar li:hover {
    text-decoration: underline;
  }
  
  .main-content {
    flex-grow: 1; /* Nimmt den restlichen Platz ein */
  }
  
  .cta-box {
    border: 2px solid #42b983;
    padding: 20px;
    margin-top: 30px;
    text-align: center;
    background-color: #e9f7f0;
    border-radius: 8px;
  }
  
  .cta-button {
    display: inline-block;
    padding: 10px 20px;
    background-color: #42b983;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 10px;
  }
  .cta-button:hover {
    background-color: #36a86e;
  }
  </style>