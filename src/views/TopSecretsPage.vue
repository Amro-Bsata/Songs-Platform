<template>
  <div class="top-secrets-page">
    <!-- Haupttitel -->
    <h1><LockIcon :size="30" /> Top Secrets Area</h1>

    <!-- Nachricht, wenn KEIN Zugriff besteht -->
    <!-- Styling wie in deinem Beispiel mit spezifischen Farben -->
    <div v-if="!hasAccess" class="access-denied">
      <h2><BlockHelperIcon :size="30" /> Access Denied</h2>
      <p>You need a TOP-Fan NFT to access this exclusive content.</p>
      <p>Visit the <router-link to="/marketplace">Marketplace</router-link> to see if any are available!</p>
      <!-- Optional: Button, um die Prüfung erneut zu versuchen (simuliert) -->
      <!-- Diese Funktion ist im Prototype immer noch simuliert -->
      <button @click="checkNFTOwnership" class="retry-button">Check Access Again (Simulated)</button>
    </div>

    <!-- Inhalt, wenn (simulierter) Zugriff besteht: Liste und Detail (conditional) -->
    <div v-else class="content-area">
      <!-- Linke Seite: Liste der Songs -->
      <div class="song-list">
        <h3>Exclusive Songs</h3>
        <!-- Simulierter Ladezustand für die Liste -->
        <p v-if="isLoadingSongs" class="loading-songs">
          <LoadingIcon class="icon" :size="40" />
          <p>Loading exclusive song list (Simulated)...</p>
        </p>
        <p v-else-if="songsList.length === 0">No exclusive songs found (Simulated).</p>
        <!-- Liste der Song Cards -->
        <!-- Wiederverwendbare SongCard Komponente -->
        <SongCard
          v-else
          v-for="song in songsList"
          :key="song.id"
          :song="song"
          @click="selectSong(song)"
          :class="{ selected: selectedSong && selectedSong.id === song.id }"
        />
      </div>

      <!-- Rechte Seite: Song Detail & Tabs (wird nur angezeigt, wenn ein Song ausgewählt ist) -->
      <div class="song-detail-view" v-if="selectedSong">
        <h2>Details for: {{ selectedSong.name }}</h2>
        <!-- Song Details Abschnitt -->
        <div class="detail-summary">
             <img :src="selectedSong.cover || 'https://via.placeholder.com/150?text=No+Cover'" alt="Song Cover" class="detail-cover">
             <div class="detail-info">
                <h3>{{ selectedSong.name || 'Untitled Song' }}</h3>
                <p><strong>Genre:</strong> {{ selectedSong.genre || 'Unknown' }}</p>
                <p v-if="selectedSong.artist"><strong>Artist:</strong> {{ selectedSong.artist }}</p>
                 <!-- Einfacher Audio Player Placeholder für den Song selbst -->
                <div class="audio-player-placeholder">
                  <span>Audio Player Placeholder for {{ selectedSong.name }}</span>
                  <button>▶ Play</button>
                </div>
             </div>
        </div>

        <!-- Tabbed Interface für den exklusiven Inhalt (mit Platzhaltern) -->
        <div class="content-wrapper-tabs">
            <div class="tabs">
              <!-- Waveform Platzhalter wie in deinem Beispiel -->
              <div class="waveform-placeholder">~~~~~</div>
              <button @click="activeTab = 'channel'" :class="{ active: activeTab === 'channel' }">
                 <BroadcastIcon :size="20" /> Channel
              </button>
              <button @click="activeTab = 'mv'" :class="{ active: activeTab === 'mv' }">
                 <VideoIcon :size="20" /> MV
              </button>
              <button @click="activeTab = 'remixes'" :class="{ active: activeTab === 'remixes' }">
                 <AlbumIcon :size="20" /> Remixes
              </button>
              <!-- Extra Button wie in deinem Beispiel -->
              <button class="extra-button" title="Help/Info (Placeholder)">
                 <HelpCircleIcon :size="20" />
              </button>
            </div>

            <div class="tab-content">
              <!-- Inhalt für den Channel-Tab (Platzhalter) -->
              <div v-if="activeTab === 'channel'">
                <h2>Exclusive Channel Content</h2>
                <p>Behind-the-scenes, special announcements, etc.</p>
                <!-- Inhalt für Channel (Platzhalter wie in deinem Beispiel) -->
                <div class="content-placeholder">Channel Area for {{ selectedSong.name }}</div>
              </div>
              <!-- Inhalt für den MV-Tab (Platzhalter) -->
              <div v-if="activeTab === 'mv'">
                <h2>Official Music Video</h2>
                <p>Watch the exclusive official music video here.</p>
                <!-- Inhalt für MV (Video Player Platzhalter wie in deinem Beispiel) -->
                <div class="content-placeholder video">MV Area (Video Player Placeholder) for {{ selectedSong.name }}</div>
              </div>
              <!-- Inhalt für den Remixes-Tab (Platzhalter) -->
              <div v-if="activeTab === 'remixes'">
                <h2>Exclusive Remixes</h2>
                <p>Listen to or download special remixes.</p>
                <!-- Inhalt für Remixes (Liste von Audio-Dateien Platzhalter wie in deinem Beispiel) -->
                <div class="content-placeholder audio-list">Remix 1, Remix 2... for {{ selectedSong.name }}</div>
              </div>
            </div>
        </div>

      </div>
      <!-- Placeholder, wenn kein Song ausgewählt ist -->
      <div class="song-detail-view placeholder" v-else>
        <p>Select a song from the list to view exclusive content.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

// Material Design Icons Importe
import LockIcon from 'vue-material-design-icons/Lock.vue';
import BlockHelperIcon from 'vue-material-design-icons/BlockHelper.vue'; // Passendes Icon für "Denied"
import BroadcastIcon from 'vue-material-design-icons/Broadcast.vue'; // Icon für Channel
import VideoIcon from 'vue-material-design-icons/Video.vue'; // Icon für MV
import AlbumIcon from 'vue-material-design-icons/Album.vue'; // Icon für Remixes
import HelpCircleIcon from 'vue-material-design-icons/HelpCircle.vue'; // Icon für ? Button
import LoadingIcon from 'vue-material-design-icons/Loading.vue'; // Für Ladeanzeige der Liste


// SongCard Komponente importieren
import SongCard from '@/components/SongCard.vue';


export default {
  name: 'TopSecretsPage',
  components: {
    // Registriere Icons und SongCard
    LockIcon,
    BlockHelperIcon,
    BroadcastIcon,
    VideoIcon,
    AlbumIcon,
    HelpCircleIcon,
    LoadingIcon,
    SongCard, // Wichtig: SongCard hier registrieren
  },
  setup() {
    // State Variablen
    const hasAccess = ref(false); // Simulierter Zugriffsstatus, startet ohne Zugriff
    const isLoadingSongs = ref(false); // Ladezustand für die Songliste
    const songsList = ref([]); // Liste der exklusiven Songs
    const selectedSong = ref(null); // Der aktuell ausgewählte Song
    const activeTab = ref('channel'); // Aktueller Tab im Detailbereich

    // --- SIMULATIONS METHODEN ---

    // Simuliert die Prüfung des NFT-Besitzes (frontend-seitig gesteuert)
    function checkNFTOwnership() {
      // Diese Funktion wird jetzt hauptsächlich vom created() und dem Retry-Button aufgerufen.
      // Sie simuliert den Zugriff und löst dann das Laden der Songs aus, wenn erfolgreich.
      console.log('Checking if user owns a TOP-Fan NFT (Simulated)...');
      // Simuliere eine kleine Verzögerung für die Prüfung selbst
      // Optional: isLoadingSongs.value = true; // Ladezustand aktivieren, wenn Prüfung schnell ist
      // Wenn die Prüfung länger dauern soll, brauchst du einen separaten isLoading State dafür

      setTimeout(async () => { // async hier, weil fetchTopSecretSongs async ist
        // Zufällig entscheiden, ob Zugriff gewährt wird
        const accessGranted = Math.random() > 0.5; // 50% Chance für Zugriff
        hasAccess.value = accessGranted;

        if (!hasAccess.value) {
          console.warn("Access Denied (Simulated): TOP-Fan NFT not found.");
          songsList.value = []; // Liste leeren, wenn Zugriff verloren
          selectedSong.value = null; // Auswahl zurücksetzen
        } else {
          console.log("Access Granted (Simulated): TOP-Fan NFT found.");
          // Wenn Zugriff gewährt, lade die simulierte Songliste
          await fetchTopSecretSongs();
        }
        // Optional: isLoadingSongs.value = false; // Ladezustand deaktivieren
      }, 800); // Simuliert 800ms Wartezeit für die Prüfung
    }


    // Simuliert das Laden der exklusiven Songliste
    async function fetchTopSecretSongs() {
      console.log('Fetching exclusive song list (Simulated)...');
      isLoadingSongs.value = true; // Ladezustand für Liste aktivieren
      songsList.value = []; // Liste leeren

      try {
        await new Promise(resolve => setTimeout(resolve, 1200)); // Simuliere Latenz beim Laden der Liste

        // Simulierte Liste von exklusiven Songs
        songsList.value = [
          { id: 1, name: 'Secret Track Alpha', genre: 'Experimental', cover: 'https://via.placeholder.com/100?text=Secret+A', artist: 'Mystery Artist' },
          { id: 2, name: 'Hidden Remix Beta', genre: 'Electronic', cover: 'https://via.placeholder.com/100?text=Secret+B', artist: 'Stealth Producer' },
          { id: 3, name: 'Top Fan Anthem', genre: 'Pop', cover: 'https://via.placeholder.com/100?text=Secret+C', artist: 'The Exclusive Band' },
          // Füge mehr Songs hinzu, wenn du eine längere Liste testen möchtest
          // { id: 4, name: 'Mystic Melody', genre: 'Ambient', cover: 'https://via.placeholder.com/100?text=Secret+D', artist: 'Chill Creator' },
        ];
         console.log('Exclusive song list loaded (Simulated):', songsList.value);

      } catch (error) {
        console.error('Error fetching exclusive song list (Simulated):', error);
        // Optional: Hier eine Fehlermeldung für die Liste anzeigen
      } finally {
        isLoadingSongs.value = false; // Ladezustand für Liste deaktivieren
      }
    }


    // Funktion, die aufgerufen wird, wenn ein Song aus der Liste geklickt wird
    function selectSong(song) {
      console.log('Song selected:', song);
      selectedSong.value = song;
      activeTab.value = 'channel'; // Setze den Tab immer auf "Channel" beim Auswählen
      // Für diesen einfachen Prototyp laden wir keinen separaten Inhalt pro Song.
      // Die Inhalte in den Tabs sind statische Platzhalter.
    }


    // Beim Mounten der Komponente die simulierte Prüfung starten
    onMounted(() => {
       checkNFTOwnership(); // Starte die simulierte Prüfung
    });

    // Rückgabe der State-Variablen und Methoden für das Template
    return {
      hasAccess, // Nur dieser eine Zugriffsstate
      isLoadingSongs, // Ladezustand für die Liste
      songsList, // Die Liste der Songs
      selectedSong, // Der ausgewählte Song
      activeTab, // Der aktuelle Tab
      checkNFTOwnership, // Die simulierte Prüf-Methode für den Retry-Button
      selectSong, // Die Methode zum Auswählen eines Songs
      // exclusiveContent, contentError, isLoadingContent sind nicht mehr nötig,
      // da der Inhalt in den Tabs statisch ist
    };
  }
};
</script>

<style scoped>
/* --- Styling basierend auf den Werten im CSS deines Originalbeispiels --- */

.top-secrets-page {
  max-width: 1200px; /* Etwas breiter für Liste+Detail */
  margin: 20px auto;
  padding: 20px; /* Padding hinzugefügt, falls in base/main.css nicht global gesetzt */
   /* Hintergrund und Textfarbe kommen wahrscheinlich aus base.css.
      Wenn du spezifische # Farben willst, müsstest du base.css überschreiben
      oder hier direkt setzen. Wir orientieren uns an deinem Beispiel-CSS: */
  background-color: var(--color-background); /* Nutzt base.css, oft dunkel */
  color: var(--color-text); /* Nutzt base.css, oft hell bei dunklem BG */
}

.top-secrets-page h1 {
  /* Styling aus base.css/App.vue kann übernommen werden */
  color: var(--color-heading); /* Akzentfarbe oder wie gewünscht */
  border-bottom: 1px solid var(--color-border); /* Trennlinie wie in base.css */
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex; /* Für Icon */
  align-items: center; /* Für Icon */
  gap: 10px; /* Für Icon */
}

.top-secrets-page > p {
  /* Hinweis, wenn kein Zugriff */
  color: #ff6b6b; /* Rot, wie im letzten Beispiel */
  font-weight: bold;
  text-align: center;
  padding: 20px;
  border: 1px solid #444; /* Borderfarbe aus deinem Beispiel */
  background-color: #555; /* Hintergrund aus deinem Beispiel */
  border-radius: 5px;
  margin-top: 20px; /* Abstand nach oben */
}

.access-denied h2 {
   color: #ff6b6b; /* Rot für Überschrift */
   display: flex;
   align-items: center;
   justify-content: center;
   gap: 8px;
   margin-bottom: 15px;
}

.access-denied p {
    margin-bottom: 10px;
}

.access-denied a {
    color: #42b983; /* Akzentfarbe */
    text-decoration: underline;
}
.access-denied .retry-button {
    margin-top: 15px;
    padding: 8px 16px;
    background-color: #666; /* Dunkler Button */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
.access-denied .retry-button:hover {
    background-color: #777;
}


/* Flexbox Layout für Liste und Detailansicht */
.content-area {
  display: flex;
  gap: 30px; /* Abstand zwischen Liste und Detail */
  min-height: 500px; /* Mindesthöhe, damit Bereiche nicht zu klein werden */
}

.song-list {
  flex: 1; /* Nimmt verfügbaren Platz ein */
  max-width: 300px; /* Maximale Breite für die Liste */
  overflow-y: auto; /* Scrollbar, wenn Liste zu lang wird */
  border: 1px solid #444; /* Borderfarbe aus deinem Beispiel */
  padding: 10px;
  border-radius: 4px;
  background-color: #555; /* Hintergrund aus deinem Beispiel */
}
.song-list h3 {
    margin-top: 0;
    color: #f2f2f2; /* Heller Text */
    border-bottom: 1px solid #444; /* Trennlinie wie im Beispiel */
    padding-bottom: 8px;
    margin-bottom: 10px;
}

/* Styling für SongCard innerhalb der Liste */
.song-list .song-card {
    margin-bottom: 10px; /* Abstand zwischen den Karten */
    background-color: #666; /* Hintergrund für Karten */
    border: 1px solid #555; /* Border für Karten */
    cursor: pointer; /* Visueller Hinweis, dass man klicken kann */
}
.song-list .song-card:hover {
    background-color: #777; /* Hover-Hintergrund für Karten */
}
.song-list .song-card.selected {
    border-color: #42b983; /* Akzentfarbe für ausgewählte Karte */
    background-color: #555; /* Hintergrund für ausgewählte Karte */
}


.loading-songs { /* Ladezustand für die Liste */
  text-align: center;
  padding: 20px;
  color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.loading-songs .icon {
    color: #42b983; /* Akzentfarbe */
    font-size: 40px;
    animation: spinner 1.5s linear infinite;
}


.song-detail-view {
  flex: 2; /* Nimmt mehr Platz ein */
  border: 1px solid #444; /* Borderfarbe aus deinem Beispiel */
  padding: 20px;
  border-radius: 8px;
  background-color: #555; /* Hintergrund aus deinem Beispiel */
  display: flex; /* Inhalt der Detailansicht flexibel anordnen */
  flex-direction: column; /* Elemente untereinander */
  gap: 20px; /* Abstand zwischen Detail-Summary und Tabs */
}

.song-detail-view.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa; /* Gedämpfter Text wie im Beispiel */
  font-style: italic;
  min-height: 400px; /* Mindesthöhe im Placeholder-Zustand */
}

.detail-summary {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    border-bottom: 1px solid #444; /* Trennlinie */
    padding-bottom: 20px;
}
.detail-summary .detail-cover {
  width: 120px; /* Größe im Detail */
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}
.detail-summary .detail-info {
    flex-grow: 1;
    color: #f2f2f2; /* Heller Text */
}
.detail-summary .detail-info h3 {
    margin-top: 0;
    margin-bottom: 5px;
    color: #f2f2f2; /* Heller Text */
}
.detail-summary .detail-info p {
    margin: 5px 0;
    font-size: 0.9em;
    color: #f2f2f2; /* Heller Text */
}
.detail-summary .audio-player-placeholder {
  margin-top: 15px;
  padding: 10px;
  background-color: #666; /* Hintergrund */
  border: 1px solid #555; /* Border */
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
  color: #aaa; /* Gedämpfter Text */
}
.detail-summary .audio-player-placeholder button {
   padding: 5px 10px;
   cursor: pointer;
   background-color: #777; /* Button Hintergrund */
   color: #f2f2f2; /* Button Text */
   border: none; /* Kein Border wie im Beispiel */
   border-radius: 4px;
}


.content-wrapper-tabs {
    /* Hintergrund wird von .song-detail-view geerbt */
    border-radius: 8px; /* Erbe den Border-Radius des Elterncontainers */
    overflow: hidden;
}


.tabs {
  display: flex;
  background-color: #444; /* Hintergrund aus deinem Beispiel */
  border-bottom: 1px solid #444; /* Borderfarbe aus deinem Beispiel */
  position: relative;
  align-items: center;
  padding-right: 10px; /* Platz für Extra-Button, falls absolut positioniert */
}

.waveform-placeholder {
  padding: 0 15px;
  font-size: 1.5em;
  color: #aaa; /* Textfarbe aus deinem Beispiel */
  padding: 10px 0;
  background-color: #f5f5f5; /* Hintergrund aus deinem Beispiel */
  border-bottom: 1px solid #eee; /* Trennlinie aus deinem Beispiel */
  flex-shrink: 0;
  color: #aaa; /* Textfarbe aus deinem Beispiel */
  background-color: #f5f5f5; /* Hintergrund aus deinem Beispiel */
  border-bottom: 1px solid #eee; /* Borderfarbe aus deinem Beispiel */
}

.tabs button {
  padding: 15px 25px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  color: #555; /* Textfarbe aus deinem Beispiel */
  border-right: 1px solid #ccc; /* Borderfarbe aus deinem Beispiel */
  flex-grow: 1;
  text-align: center;
  display: flex; /* Für Icon und Text */
  align-items: center;
  justify-content: center;
  gap: 8px; /* Abstand zwischen Icon und Text */
  transition: background-color 0.2s ease;
}

.tabs button:last-of-type {
  border-right: none;
}


.tabs button.active {
  background-color: white; /* Hintergrund aus deinem Beispiel */
  color: #42b983; /* Akzentfarbe */
  border-bottom: 3px solid #42b983; /* Akzentfarbe */
  margin-bottom: -1px;
}

.tabs button:hover:not(.active):not(.extra-button) {
  background-color: #f5f5f5; /* Hintergrund aus deinem Beispiel */
}

.tabs .extra-button {
   /* Wie in deinem Beispiel */
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  padding: 5px 10px;
  flex-grow: 0;
  border: 1px solid #ccc; /* Borderfarbe aus deinem Beispiel */
  border-radius: 50%;
  background-color: #ddd; /* Hintergrund aus deinem Beispiel */
  min-width: 30px;
  height: 30px;
  color: #555; /* Textfarbe aus deinem Beispiel */
  display: flex; /* Für Icon */
  justify-content: center; /* Für Icon */
  align-items: center; /* Für Icon */
  font-weight: normal; /* Kein Bold */
  font-size: 1.2em; /* Größeres ? */
  z-index: 1; /* Sicherstellen, dass er über den Tabs liegt */
}
/* Abstand für die ersten Tabs, damit sie nicht vom Extra-Button überdeckt werden */
.tabs button:first-of-type {
    margin-left: 50px; /* Platz für den Extra-Button */
}


.tab-content {
  padding: 25px;
   /* Hintergrund aus deinem Beispiel */
  background-color: #555;
  color: #f2f2f2; /* Heller Text */
}

.tab-content h2 {
    color: #f2f2f2; /* Heller Text für Unterüberschriften */
    margin-top: 0;
    margin-bottom: 15px;
}
.tab-content p {
    margin-bottom: 15px;
}


.content-area-tab > div {
    /* Hintergrund für die Bereiche innerhalb der Tabs, wie im Beispiel */
    margin-top: 20px; /* Abstand */
    border: 1px dashed #ccc; /* Border wie im Beispiel */
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa; /* Textfarbe wie im Beispiel */
    border-radius: 4px;
    font-style: italic;
}
.content-area-tab .channel-post {
   /* Spezialstyling für Channel Posts, falls gewünscht */
   background-color: #666; /* Etwas heller als der Tab-Content BG */
   border: none; /* Kein dashed border für Posts */
   border-left: 3px solid #42b983; /* Akzentfarbe */
   padding: 15px;
   margin-bottom: 15px;
   color: #f2f2f2;
   display: block; /* Kein Flexbox mehr */
   text-align: left;
}
.content-area-tab .channel-post h4 {
   color: #f2f2f2;
   margin-top: 0;
   margin-bottom: 5px;
}
.content-area-tab .channel-post p {
    margin-bottom: 5px;
    color: #ccc;
}
.content-area-tab .channel-post small {
    color: #aaa;
    font-style: italic;
}


.content-placeholder {
  min-height: 200px;
   /* Hintergrund und Border aus deinem Beispiel */
  background-color: #555;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa; /* Textfarbe aus deinem Beispiel */
  margin-top: 20px;
  border-radius: 4px;
  font-style: italic;
}

.content-placeholder.video {
   /* Hintergrund aus deinem Beispiel */
  background-color: #333;
}

.content-placeholder.audio-list {
   /* Hintergrund aus deinem Beispiel */
  background-color: #777;
}

/* Spinner Icon */
.icon {
  animation: spinner 1.5s linear infinite;
  color: #42b983; /* Akzentfarbe */
  font-size: 40px;
}

@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Media Query für kleinere Bildschirme: Stapeln der Elemente */
@media (max-width: 768px) {
  .content-area {
    flex-direction: column; /* Liste und Detail stapeln */
    gap: 20px; /* Abstand anpassen */
  }

  .song-list {
    max-width: 100%; /* Liste nimmt volle Breite ein */
    overflow-y: visible; /* Kein Scrollen auf der Liste selbst */
    max-height: none; /* Keine feste Höhe */
  }

  .song-detail-view {
    flex: auto; /* Nimmt verfügbaren Platz ein */
  }
   .detail-summary {
       flex-direction: column; /* Bild und Info im Detail stapeln */
       align-items: center; /* Zentrieren */
       text-align: center;
   }
   .detail-summary .detail-info p {
       text-align: left; /* Text wieder linksbündig */
   }
   .tabs button {
       padding: 10px 15px; /* Weniger Padding auf kleinen Bildschirmen */
       font-size: 0.9em;
   }
    .tabs button:first-of-type {
       margin-left: 40px; /* Weniger Platz für Extra-Button auf kleinen Bildschirmen */
   }
   .tabs .extra-button {
        left: 5px; /* Näher am Rand */
   }
}

</style>