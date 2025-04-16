<template>
    <div id="app">
      <nav class="main-nav">
        <div class="logo">MusikApp</div>
        <div class="nav-links">
          <router-link to="/">Home</router-link>
          <router-link to="/songs">Songs</router-link>
          <router-link to="/marketplace">Marketplace</router-link> <!-- Annahme für "shot" -->
          <router-link to="/top-secrets">Top Secrets</router-link>
          <router-link to="/create">Create Song</router-link>
        </div>
        <div class="user-actions">
          <router-link to="/my-songs">My Songs</router-link>
          <!-- Hier käme Login/Profil Icon hin -->
          <span class="profile-icon">👤</span>
        </div>
      </nav>
      <main>
        <router-view/> <!-- Hier werden die Seiten geladen -->
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
  };
  </script>
  
  <style scoped>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  
  .main-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f8f8f8;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px; /* Platz vor dem Inhalt */
  }
  
  .logo {
    font-weight: bold;
    font-size: 1.5em;
  }
  
  .nav-links a {
    margin: 0 10px;
    text-decoration: none;
    color: #42b983;
    font-weight: bold;
  }
  
  .nav-links a.router-link-exact-active {
    color: #2c3e50;
    border-bottom: 2px solid #42b983;
  }
  
  .user-actions {
    display: flex;
    align-items: center;
  }
  
  .user-actions a {
     margin-right: 15px;
     text-decoration: none;
     color: #42b983;
     font-weight: bold;
  }
  
  .profile-icon {
    font-size: 1.5em;
    cursor: pointer; /* Zeigt an, dass es klickbar sein könnte */
  }
  
  main {
    padding: 0 20px; /* Etwas Platz an den Seiten */
  }
  </style>