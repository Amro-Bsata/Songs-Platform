<template>
    <div class="top-secrets-page">
      <h1>Top Secrets Area</h1>
      <p v-if="!hasAccess">You need a TOP-Fan NFT to access this exclusive content.</p>
      <!-- Hier könnte eine Aufforderung zum Kauf/Erwerb des NFTs stehen -->
  
      <div v-if="hasAccess" class="content-wrapper">
        <div class="tabs">
           <!-- Waveform-Grafik (vereinfacht als div) -->
           <div class="waveform-placeholder">~~~~~</div>
          <button @click="activeTab = 'channel'" :class="{ active: activeTab === 'channel' }">Channel</button>
          <button @click="activeTab = 'mv'" :class="{ active: activeTab === 'mv' }">MV (Music Video)</button>
          <button @click="activeTab = 'remixes'" :class="{ active: activeTab === 'remixes' }">Remixes</button>
           <!-- Platzhalter-Button links? -->
           <button class="extra-button">?</button>
        </div>
  
        <div class="tab-content">
          <div v-if="activeTab === 'channel'">
            <h2>Exclusive Channel Content</h2>
            <p>Behind-the-scenes, special announcements, etc.</p>
            <!-- Inhalt für Channel -->
            <div class="content-placeholder">Channel Area</div>
          </div>
          <div v-if="activeTab === 'mv'">
            <h2>Official Music Video</h2>
            <p>Watch the exclusive official music video here.</p>
            <!-- Inhalt für MV (z.B. Video-Player) -->
             <div class="content-placeholder video">MV Area (Video Player Placeholder)</div>
          </div>
          <div v-if="activeTab === 'remixes'">
            <h2>Exclusive Remixes</h2>
            <p>Listen to or download special remixes.</p>
            <!-- Inhalt für Remixes (z.B. Liste von Audio-Dateien) -->
             <div class="content-placeholder audio-list">Remix 1, Remix 2...</div>
          </div>
        </div>
         <!-- Share Channel Button (durchgestrichen)
         <button>Share Channel</button>
         -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopSecretsPage',
    data() {
      return {
        hasAccess: false, // Dies würde durch Prüfung des NFT-Besitzes bestimmt
        activeTab: 'channel', // Standard-Tab
      };
    },
    methods: {
      checkNFTOwnership() {
        console.log('Checking if user owns a TOP-Fan NFT...');
        // --- HIER BLOCKCHAIN-ABFRAGE, OB DER USER DEN NÖTIGEN NFT BESITZT ---
        // Beispiel-Simulation:
        setTimeout(() => {
          // Zufällig oder basierend auf eingeloggtem User entscheiden
          this.hasAccess = Math.random() > 0.5; // Simuliert 50% Chance auf Zugriff
           if (!this.hasAccess) {
              console.warn("Access Denied: TOP-Fan NFT not found.");
           } else {
               console.log("Access Granted: TOP-Fan NFT found.");
           }
        }, 500);
      },
    },
    created() {
      this.checkNFTOwnership(); // Prüfung beim Laden der Seite
    },
  };
  </script>
  
  <style scoped>
  .top-secrets-page {
    max-width: 1000px;
    margin: auto;
  }
  .top-secrets-page > p { /* Hinweis, wenn kein Zugriff */
      color: red;
      font-weight: bold;
      text-align: center;
      padding: 20px;
      border: 1px solid red;
      background-color: #ffebee;
      border-radius: 5px;
  }
  
  .content-wrapper {
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden; /* Sorgt dafür, dass Kinder innerhalb bleiben */
  }
  
  .waveform-placeholder {
      text-align: center;
      font-size: 1.5em;
      color: #aaa;
      padding: 10px 0;
      background-color: #f5f5f5;
      border-bottom: 1px solid #eee;
  }
  
  
  .tabs {
    display: flex;
    background-color: #eee;
    border-bottom: 1px solid #ccc;
    position: relative; /* Für absolute Positionierung des Extra-Buttons */
  }
  
  .tabs button {
    padding: 15px 25px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    color: #555;
    border-right: 1px solid #ccc; /* Trennlinien zwischen Tabs */
    flex-grow: 1; /* Tabs füllen den Platz */
    text-align: center;
  }
  .tabs button:last-child {
      border-right: none;
  }
  
  
  .tabs button.active {
    background-color: white;
    color: #42b983;
    border-bottom: 3px solid #42b983;
    margin-bottom: -1px; /* Überlappt die untere Border der Tab-Leiste */
  }
  
  .tabs button:hover:not(.active) {
    background-color: #f5f5f5;
  }
  
  .tabs .extra-button {
      position: absolute;
      left: 10px; /* Positionierung links, wie in Skizze */
      top: 50%;
      transform: translateY(-50%);
      padding: 5px 10px;
      flex-grow: 0; /* Nicht wachsen lassen */
      border: 1px solid #ccc;
      border-radius: 50%; /* Rund machen, wie in Skizze */
      background-color: #ddd;
      min-width: 30px; /* Sicherstellen, dass es nicht zu klein wird */
      height: 30px;
  }
  
  
  .tab-content {
    padding: 25px;
    background-color: white;
  }
  
  .content-placeholder {
      min-height: 200px;
      background-color: #f9f9f9;
      border: 1px dashed #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #aaa;
      margin-top: 20px;
      border-radius: 4px;
  }
  .content-placeholder.video {
      background-color: #e0f2f7; /* Andere Farbe für Video-Bereich */
  }
  .content-placeholder.audio-list {
       background-color: #fff9c4; /* Andere Farbe für Audio-Bereich */
  }
  
  </style>