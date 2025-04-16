<template>
    <div class="song-detail">
       <img :src="song.cover || 'https://via.placeholder.com/200?text=No+Cover'" alt="Song Cover" class="detail-cover">
       <div class="detail-info">
          <h3>{{ song.name || 'Untitled Song' }}</h3>
          <p><strong>Genre:</strong> {{ song.genre || 'Unknown' }}</p>
          <p v-if="song.owner && context === 'my-songs'"><strong>Owner:</strong> You ({{ song.owner }})</p>
          <p v-if="song.owner && context === 'marketplace'"><strong>Current Owner:</strong> {{ song.owner }}</p> <!-- Im Marketplace eher den Owner anzeigen -->
  
          <!-- Placeholder für Beschreibung oder andere Metadaten -->
          <p><em>{{ song.details || 'No additional details available.' }}</em></p>
  
          <!-- Einfacher Audio Player Placeholder -->
          <div class="audio-player-placeholder">
             <span>Audio Player Placeholder for {{ song.name }}</span>
             <button>▶ Play</button>
          </div>
  
          <!-- Kontextabhängige Infos (z.B. Preis nur im Marketplace/wenn for sale) -->
           <p class="detail-price" v-if="context === 'marketplace' && song.price">
               <strong>Price:</strong> {{ song.price }}
           </p>
            <p class="detail-status" v-if="context === 'my-songs' && song.isForSale">
               <strong>Status:</strong> Listed for sale at {{ song.price }}
           </p>
            <p class="detail-status" v-if="context === 'my-songs' && !song.isForSale">
               <strong>Status:</strong> Not currently for sale
           </p>
  
       </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SongDetail',
    props: {
      song: {
        type: Object,
        required: true,
      },
      context: { // Um zu unterscheiden, wo die Komponente genutzt wird
        type: String,
        default: 'view', // Mögliche Werte: 'view', 'marketplace', 'my-songs'
      },
    },
  };
  </script>
  
  <style scoped>
  .song-detail {
    display: flex;
    gap: 20px;
    align-items: flex-start; /* Oben ausrichten */
  }
  
  .detail-cover {
    width: 150px; /* Größeres Bild in der Detailansicht */
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }
  
  .detail-info {
    flex-grow: 1;
  }
  
  .detail-info h3 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.5em;
  }
  
  .detail-info p {
    margin: 5px 0;
    line-height: 1.5;
  }
  .detail-info p em { /* Beschreibung */
      color: #666;
      display: block;
      margin-top: 10px;
  }
  
  .audio-player-placeholder {
      margin-top: 20px;
      padding: 15px;
      background-color: #eee;
      border: 1px solid #ddd;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9em;
      color: #555;
  }
  .audio-player-placeholder button {
      padding: 5px 10px;
      cursor: pointer;
  }
  
  
  .detail-price, .detail-status {
      margin-top: 15px;
      font-weight: bold;
  }
  .detail-price {
      color: #42b983;
      font-size: 1.2em;
  }
  .detail-status {
       color: #0277bd; /* Blau für Status */
  }
  </style>