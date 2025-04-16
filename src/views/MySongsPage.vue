<template>
    <div class="my-songs-page">
      <h1>My Songs</h1>
      <p>Here you can manage the songs you own.</p>
  
      <div class="content-area">
        <div class="song-list">
          <p v-if="loading">Loading your songs...</p>
          <p v-else-if="mySongs.length === 0">You don't own any songs yet. <router-link to="/create">Create one</router-link> or <router-link to="/marketplace">buy one</router-link>!</p>
          <!-- Wiederverwendbare Song-Karte -->
          <SongCard
            v-else
            v-for="song in mySongs"
            :key="song.id"
            :song="song"
            @click="selectSong(song)"
            :class="{ selected: selectedSong && selectedSong.id === song.id }"
          />
        </div>
  
        <div class="song-detail-view" v-if="selectedSong">
          <h2>Manage Song: {{ selectedSong.name }}</h2>
           <SongDetail :song="selectedSong" context="my-songs" />
  
           <!-- Management-Sektion -->
           <div class="management-section">
              <h4>Ownership Info</h4>
              <p><strong>Owner:</strong> You ({{ userAddress }})</p> <!-- Annahme: userAddress ist verfügbar -->
               <p><strong>NFT ID:</strong> {{ selectedSong.nftId || 'N/A' }}</p>
               <p><strong>Type:</strong> {{ selectedSong.nftType || 'Ownership-NFT' }}</p> <!-- Annahme -->
  
              <h4>Sell Your Song NFT</h4>
               <div v-if="!selectedSong.isForSale">
                  <div class="form-group">
                      <label for="sell-price">Set Price (e.g., ETH):</label>
                      <input type="text" id="sell-price" v-model="sellPrice" placeholder="0.1">
                  </div>
                  <button class="sell-button" @click="listForSale(selectedSong)" :disabled="!sellPrice">List for Sale</button>
               </div>
               <div v-else>
                  <p><strong>Currently listed for sale at:</strong> {{ selectedSong.price }}</p>
                   <button class="unlist-button" @click="unlistFromSale(selectedSong)">Remove from Sale</button>
               </div>
               <!-- Logo Exchange? Unklar was gemeint ist. Evtl. Metadaten ändern? -->
               <button class="edit-metadata-button" @click="editMetadata(selectedSong)">Edit Metadata (Placeholder)</button>
           </div>
  
        </div>
         <div class="song-detail-view placeholder" v-else>
            <p>Select one of your songs from the list to manage it.</p>
         </div>
      </div>
    </div>
  </template>
  
  <script>
  import SongCard from '@/components/SongCard.vue';
  import SongDetail from '@/components/SongDetail.vue';
  
  export default {
    name: 'MySongsPage',
    components: {
      SongCard,
      SongDetail
    },
    data() {
      return {
        loading: false,
        mySongs: [], // Songs des eingeloggten Users, vom Backend/Blockchain
        selectedSong: null,
        userAddress: '0x123...abc', // Beispiel-Adresse des Users
        sellPrice: '', // Preis für den Verkauf
      };
    },
    methods: {
      fetchMySongs() {
        this.loading = true;
        console.log('Fetching songs owned by:', this.userAddress);
        // --- HIER DATEN VOM BACKEND/BLOCKCHAIN LADEN (nur die des Users) ---
        // Beispiel-Daten simulieren:
        setTimeout(() => {
          this.mySongs = [
            { id: 1, name: 'Synthwave Dream', genre: 'Synthwave', cover: 'https://via.placeholder.com/100?text=Song1', owner: this.userAddress, nftId: '101', nftContract: '0xabc...', isForSale: false, price: null, nftType: 'Ownership-NFT' },
            { id: 5, name: 'My Generated Track', genre: 'Electronic', cover: 'https://via.placeholder.com/100?text=Song5', owner: this.userAddress, nftId: '105', nftContract: '0xdef...', isForSale: true, price: '0.08 ETH', nftType: 'Ownership-NFT' },
          ];
          this.loading = false;
        }, 1000);
      },
      selectSong(song) {
        this.selectedSong = song;
        this.sellPrice = ''; // Preis-Input zurücksetzen
      },
      listForSale(song) {
          if (!this.sellPrice || isNaN(parseFloat(this.sellPrice))) {
               alert('Please enter a valid price.');
               return;
          }
          console.log(`Listing song ${song.id} for sale at ${this.sellPrice} ETH`);
          // --- HIER INTERAKTION MIT SMART CONTRACT (Listing) ---
          alert(`Listing ${song.name} for ${this.sellPrice} ETH (Placeholder)`);
          // Update UI (idealerweise nach Bestätigung der Blockchain)
          song.isForSale = true;
          song.price = `${this.sellPrice} ETH`;
          this.sellPrice = ''; // Reset input
      },
      unlistFromSale(song) {
          console.log(`Removing song ${song.id} from sale`);
          // --- HIER INTERAKTION MIT SMART CONTRACT (Unlisting) ---
          alert(`Removing ${song.name} from sale (Placeholder)`);
           // Update UI (idealerweise nach Bestätigung der Blockchain)
          song.isForSale = false;
          song.price = null;
      },
       editMetadata(song) {
           console.log(`Editing metadata for song ${song.id}`);
           // --- HIER LOGIK ZUM ÄNDERN VON METADATEN (z.B. Genre, Name?) ---
           // Könnte einen Modal-Dialog öffnen
           alert(`Editing metadata for ${song.name} (Placeholder)`);
       }
    },
    created() {
      // Hier müsste die User-Adresse her (z.B. von Metamask)
      // this.userAddress = ... get from wallet connection ...
      this.fetchMySongs();
    },
  };
  </script>
  
  <style scoped>
  /* Ähnliches Layout wie Marketplace, wiederverwenden oder anpassen */
  .my-songs-page {
     padding-bottom: 50px;
  }
  
  .content-area {
    display: flex;
    gap: 30px;
  }
  
  .song-list {
    flex: 1;
    max-height: 60vh;
    overflow-y: auto;
    border: 1px solid #eee;
    padding: 10px;
    border-radius: 4px;
  }
  .song-list .song-card {
    margin-bottom: 10px;
    border: 1px solid transparent;
  }
  .song-list .song-card.selected {
      border-color: #42b983;
      background-color: #e9f7f0;
  }
  
  .song-detail-view {
    flex: 2;
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
  
  .management-section {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #eee;
  }
  .management-section h4 {
      margin-bottom: 10px;
  }
  .management-section p {
      margin: 5px 0;
      font-size: 0.9em;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  .form-group label {
    display: block;
    margin-bottom: 3px;
    font-size: 0.9em;
  }
  .form-group input[type="text"] {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100px; /* Kleinere Breite für Preis */
  }
  
  .sell-button, .unlist-button, .edit-metadata-button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 5px;
  }
  
  .sell-button {
    background-color: #2196F3; /* Blau für Verkaufen */
    color: white;
  }
  .sell-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
  }
  .sell-button:hover:not(:disabled) {
    background-color: #1a78c2;
  }
  
  .unlist-button {
    background-color: #f44336; /* Rot für Entfernen */
    color: white;
  }
  .unlist-button:hover {
    background-color: #d32f2f;
  }
  .edit-metadata-button {
      background-color: #ffc107; /* Gelb für Bearbeiten */
      color: #333;
  }
  .edit-metadata-button:hover {
      background-color: #eeb100;
  }
  
  </style>