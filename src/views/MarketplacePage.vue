<template>
    <div class="marketplace-page">
      <h1>Song Marketplace</h1>
  
      <div class="controls">
        <input type="text" v-model="searchTerm" placeholder="Search Song Name or NFT Link...">
        <!-- Preis-Filter (vereinfacht) -->
        <select v-model="priceFilter">
          <option value="">All Prices</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
        <button @click="searchSongs">Search</button>
      </div>
  
      <div class="content-area">
        <div class="song-list">
           <p v-if="loading">Loading songs...</p>
           <p v-else-if="filteredSongs.length === 0">No songs found matching your criteria.</p>
          <!-- Wiederverwendbare Song-Karte -->
          <SongCard
            v-else
            v-for="song in filteredSongs"
            :key="song.id"
            :song="song"
            @click="selectSong(song)"
            :class="{ selected: selectedSong && selectedSong.id === song.id }"
          />
          <!-- Hier könnte Paginierung oder "Load More" hin -->
        </div>
  
        <div class="song-detail-view" v-if="selectedSong">
          <h2>Song Details</h2>
          <SongDetail :song="selectedSong" context="marketplace" />
           <!-- NFT Info -->
           <div class="nft-info">
              <h4>NFT Information</h4>
              <p><strong>NFT ID:</strong> {{ selectedSong.nftId || 'N/A' }}</p>
              <p><strong>Contract:</strong> {{ selectedSong.nftContract || 'N/A' }}</p>
               <p><strong>Type:</strong> {{ selectedSong.nftType || 'Copyright-NFT' }}</p> <!-- Annahme -->
              <!-- Link zum NFT auf einem Explorer (z.B. Etherscan) -->
              <a v-if="selectedSong.nftLink" :href="selectedSong.nftLink" target="_blank">View on Explorer</a>
           </div>
           <button class="buy-button" @click="buyNFT(selectedSong)">Buy NFT ({{ selectedSong.price || 'Price N/A' }})</button>
        </div>
         <div class="song-detail-view placeholder" v-else>
            <p>Select a song from the list to see details.</p>
         </div>
      </div>
    </div>
  </template>
  
  <script>
  import SongCard from '@/components/SongCard.vue'; // Wiederverwendbare Komponente
  import SongDetail from '@/components/SongDetail.vue'; // Wiederverwendbare Komponente
  
  export default {
    name: 'MarketplacePage',
    components: {
      SongCard,
      SongDetail
    },
    data() {
      return {
        searchTerm: '',
        priceFilter: '',
        loading: false,
        allSongs: [], // Hier kämen die Songs vom Backend/Blockchain
        selectedSong: null,
      };
    },
    computed: {
        // Einfache Filterung - in Realität eher Backend-seitig
       filteredSongs() {
         let songs = this.allSongs;
          if (this.searchTerm) {
              const lowerSearch = this.searchTerm.toLowerCase();
              songs = songs.filter(song =>
                  song.name.toLowerCase().includes(lowerSearch) ||
                  (song.nftLink && song.nftLink.toLowerCase().includes(lowerSearch))
              );
          }
           // Einfache Preis-Sortierung (wenn Preis vorhanden ist)
          if (this.priceFilter === 'low') {
               songs.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
          } else if (this.priceFilter === 'high') {
               songs.sort((a, b) => (b.price || -Infinity) - (a.price || -Infinity));
          }
         return songs;
       }
    },
    methods: {
      fetchSongs() {
        this.loading = true;
        console.log('Fetching marketplace songs...');
        // --- HIER DATEN VOM BACKEND LADEN ---
        // Beispiel-Daten simulieren:
        setTimeout(() => {
          this.allSongs = [
            { id: 1, name: 'Synthwave Dream', genre: 'Synthwave', price: '0.1 ETH', cover: 'https://via.placeholder.com/100?text=Song1', nftId: '101', nftContract: '0xabc...', nftLink: '#', nftType: 'Copyright-NFT' },
            { id: 2, name: 'Rock Anthem', genre: 'Rock', price: '0.05 ETH', cover: 'https://via.placeholder.com/100?text=Song2', nftId: '102', nftContract: '0xabc...', nftLink: '#', nftType: 'Copyright-NFT' },
            { id: 3, name: 'Pop Hit', genre: 'Pop', price: '0.2 ETH', cover: 'https://via.placeholder.com/100?text=Song3', nftId: '103', nftContract: '0xabc...', nftLink: '#', nftType: 'Copyright-NFT' },
            { id: 4, name: 'Lo-Fi Chill', genre: 'Lo-Fi', price: '0.02 ETH', cover: 'https://via.placeholder.com/100?text=Song4', nftId: '104', nftContract: '0xabc...', nftLink: '#', nftType: 'Copyright-NFT' },
          ];
          this.loading = false;
        }, 1500);
      },
      searchSongs() {
          console.log('Searching with:', this.searchTerm, 'and filter:', this.priceFilter);
          // In einer echten App würde dies einen neuen API-Call auslösen
          // Hier nutzen wir den computed `filteredSongs`
          this.selectedSong = null; // Auswahl zurücksetzen bei neuer Suche
      },
      selectSong(song) {
        this.selectedSong = song;
      },
      buyNFT(song) {
         console.log('Attempting to buy NFT for song:', song.id, 'for', song.price);
         // --- HIER BLOCKCHAIN-TRANSAKTION AUSLÖSEN ---
         alert(`Buying NFT for ${song.name} (Placeholder)`);
      }
    },
    created() {
      this.fetchSongs(); // Lade Songs beim Erstellen der Komponente
    },
  };
  </script>
  
  <style scoped>
  .marketplace-page {
     padding-bottom: 50px; /* Platz unten */
  }
  
  .controls {
    display: flex;
    gap: 15px;
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f0f0f0;
    border-radius: 8px;
  }
  
  .controls input[type="text"] {
    flex-grow: 1; /* Nimmt verfügbaren Platz */
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .controls select, .controls button {
    padding: 8px 15px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
  }
  .controls button {
      background-color: #42b983;
      color: white;
      border-color: #42b983;
  }
  .controls button:hover {
      background-color: #36a86e;
  }
  
  
  .content-area {
    display: flex;
    gap: 30px; /* Abstand zwischen Liste und Detailansicht */
  }
  
  .song-list {
    flex: 1; /* Nimmt verfügbaren Platz, passt sich an */
    max-height: 60vh; /* Beispielhöhe, damit es scrollbar wird */
    overflow-y: auto; /* Scrollen ermöglichen */
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 4px;
  }
  
  .song-list .song-card { /* Styling für Karten in der Liste */
    margin-bottom: 10px;
    border: 1px solid transparent; /* Rahmen für Auswahl */
  }
  .song-list .song-card.selected {
      border-color: #42b983;
      background-color: #e9f7f0;
  }
  
  
  .song-detail-view {
    flex: 2; /* Detailansicht ist breiter */
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    background-color: #fafafa;
  }
  .song-detail-view.placeholder {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #aaa;
      font-style: italic;
  }
  
  
  .nft-info {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
  }
  .nft-info h4 {
      margin-bottom: 10px;
  }
  .nft-info p {
      margin: 5px 0;
      font-size: 0.9em;
  }
  .nft-info a {
      color: #42b983;
      text-decoration: none;
  }
  .nft-info a:hover {
      text-decoration: underline;
  }
  
  .buy-button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #ff9800; /* Andere Farbe für Kaufen */
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
  }
  .buy-button:hover {
      background-color: #e68900;
  }
  
  </style>