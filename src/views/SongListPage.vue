<template>
    <div class="song-list-page">
      <h1>All Songs</h1>
  
      <div class="filters">
        <label for="genre-filter">Filter by Genre:</label>
        <select id="genre-filter" v-model="selectedGenre" @change="filterSongs">
          <option value="">All Genres</option>
          <option>Pop</option>
          <option>Rock</option>
          <option>Synthwave</option>
          <option>Classical</option>
          <option>Hip Hop</option>
          <option>Lo-Fi</option>
          <!-- Weitere Genres dynamisch laden? -->
        </select>
        <!-- Weitere Filter (z.B. Sortierung) könnten hier hin -->
      </div>
  
      <div class="song-grid">
         <p v-if="loading">Loading songs...</p>
         <p v-else-if="displayedSongs.length === 0">No songs found{{ selectedGenre ? ' for genre ' + selectedGenre : '' }}.</p>
        <!-- Wiederverwendbare Song-Karte in einem Grid -->
        <SongCard
          v-else
          v-for="song in displayedSongs"
          :key="song.id"
          :song="song"
          @click="viewSongDetail(song)"
        />
      </div>
  
      <div class="pagination" v-if="filteredSongList.length > songsPerPage">
        <button @click="loadMore" :disabled="!canLoadMore">
          {{ canLoadMore ? 'Load More' : 'No More Songs' }}
        </button>
        <!-- Alternative: Seitenbasierte Paginierung -->
      </div>
       <!-- "Shar 25 more", "3 for test" - Interpretation als Load More Button -->
       <p class="debug-info">Showing {{ displayedSongs.length }} of {{ filteredSongList.length }} songs.</p> <!-- Info wie in Skizze -->
    </div>
  </template>
  
  <script>
  import SongCard from '@/components/SongCard.vue'; // Wiederverwenden
  
  export default {
    name: 'SongListPage',
    components: {
      SongCard,
    },
    data() {
      return {
        loading: false,
        allSongs: [], // Alle verfügbaren Songs vom Backend
        selectedGenre: '',
        currentPage: 1,
        songsPerPage: 9, // Wieviele Songs pro "Seite" oder pro Klick auf "Load More"
      };
    },
    computed: {
      // Filtert die Songs basierend auf dem Genre
      filteredSongList() {
        if (!this.selectedGenre) {
          return this.allSongs;
        }
        return this.allSongs.filter(song => song.genre === this.selectedGenre);
      },
      // Berechnet, welche Songs aktuell angezeigt werden sollen
      displayedSongs() {
          const end = this.currentPage * this.songsPerPage;
          return this.filteredSongList.slice(0, end);
      },
      // Prüft, ob noch mehr Songs geladen werden können
      canLoadMore() {
          return this.displayedSongs.length < this.filteredSongList.length;
      }
    },
    methods: {
      fetchAllSongs() {
        this.loading = true;
        console.log('Fetching all available songs...');
        // --- HIER ALLE SONGS VOM BACKEND LADEN ---
        // Beispiel-Daten simulieren:
        setTimeout(() => {
          this.allSongs = [
             { id: 1, name: 'Synthwave Dream', genre: 'Synthwave', cover: 'https://via.placeholder.com/150?text=Song1', details: '13 shot?' },
             { id: 2, name: 'Rock Anthem', genre: 'Rock', cover: 'https://via.placeholder.com/150?text=Song2', details: 'Details...' },
             { id: 3, name: 'Pop Hit', genre: 'Pop', cover: 'https://via.placeholder.com/150?text=Song3', details: 'Info...' },
             { id: 4, name: 'Lo-Fi Chill', genre: 'Lo-Fi', cover: 'https://via.placeholder.com/150?text=Song4', details: 'More info...' },
             { id: 5, name: 'Generated Track', genre: 'Electronic', cover: 'https://via.placeholder.com/150?text=Song5', details: 'AI generated' },
             { id: 6, name: 'Classical Piece', genre: 'Classical', cover: 'https://via.placeholder.com/150?text=Song6', details: 'Orchestral' },
             { id: 7, name: 'Hip Hop Beat', genre: 'Hip Hop', cover: 'https://via.placeholder.com/150?text=Song7', details: 'Instrumental' },
              // ... mehr Songs simulieren für Paginierung
              ...Array.from({ length: 20 }, (_, i) => ({
                  id: 100 + i,
                  name: `More Song ${i + 1}`,
                  genre: ['Pop', 'Rock', 'Lo-Fi', 'Synthwave'][i % 4],
                  cover: `https://via.placeholder.com/150?text=More${i + 1}`,
                  details: `Detail ${i + 1}`
              }))
          ];
          this.loading = false;
        }, 1200);
      },
      filterSongs() {
          // Wenn Filter geändert wird, Paginierung zurücksetzen
          this.currentPage = 1;
          console.log('Filtering by genre:', this.selectedGenre || 'All');
      },
      loadMore() {
          if (this.canLoadMore) {
              this.currentPage++;
               console.log(`Loading page ${this.currentPage}`);
          }
      },
      viewSongDetail(song) {
        console.log('Viewing details for song:', song.id);
        // Hier könnte man zu einer Detailseite navigieren oder ein Modal öffnen
        // Beispiel: Navigation zur Marketplace-Seite mit Vorauswahl?
        // Oder eine eigene Detailseite /songs/:id ?
        alert(`Viewing details for ${song.name} (Placeholder)`);
        // Beispiel-Navigation (erfordert Konfiguration in router/index.js):
        // this.$router.push({ name: 'SongDetailView', params: { id: song.id } });
      },
    },
    created() {
      this.fetchAllSongs(); // Lade alle Songs beim Erstellen
    },
  };
  </script>
  
  <style scoped>
  .song-list-page {
    max-width: 1200px;
    margin: auto;
    padding-bottom: 50px;
  }
  
  .filters {
    margin-bottom: 25px;
    padding: 15px;
    background-color: #f0f0f0;
    border-radius: 8px;
  }
  
  .filters label {
    margin-right: 10px;
    font-weight: bold;
  }
  
  .filters select {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .song-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Responsives Grid */
    gap: 20px; /* Abstand zwischen den Karten */
    margin-bottom: 30px;
  }
  
  /* Die SongCard-Komponente würde hier angezeigt werden */
  /* .song-grid > .song-card { ... zusätzliches Styling falls nötig ... } */
  
  .pagination {
    text-align: center;
    margin-top: 20px;
  }
  
  .pagination button {
    padding: 10px 25px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
  }
  .pagination button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  .pagination button:hover:not(:disabled) {
    background-color: #36a86e;
  }
  
  .debug-info {
      text-align: center;
      margin-top: 10px;
      color: #888;
      font-size: 0.9em;
      font-style: italic;
  }
  </style>