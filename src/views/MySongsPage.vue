<template>
  <div class="my-songs-page">
    <!-- Haupttitel -->
    <h1>My Songs</h1>
    <p>Here you can manage the NFTs you own (Prototype: includes OWNER_NFTs, Fan NFTs, & Copyright NFTs).</p>

    <!-- Nachricht, wenn KEIN Zugriff besteht (z.B. Wallet nicht verbunden/Fehler beim Laden) -->
    <div v-if="!hasAccess" class="access-denied">
      <h2><BlockHelperIcon :size="30" /> Access Denied</h2>
      <p>Could not load your NFT list. In the full version, please ensure your wallet is connected and try again.</p>
       <!-- Optional: Button, um die simulierte Prüfung erneut zu versuchen -->
      <button @click="checkAndLoadMyNFTs" class="retry-button">Reload My NFTs (Simulated)</button>
    </div>

    <!-- Inhalt, wenn (simulierter) Zugriff besteht: Liste und Detail (conditional) -->
    <div v-else class="content-area">
      <!-- Linke Seite: Liste der Songs (NFTs) -->
      <div class="nft-list">
        <h3>My NFTs</h3>

        <!-- Filter für NFT-Typen -->
        <div class="filters">
           <label for="nft-filter">Show:</label>
           <select id="nft-filter" v-model="filterType">
             <option value="all">All NFTs</option>
             <option value="owner_nft">OWNER_NFTs</option>
             <option value="fan_nft">Fan NFTs</option>
             <option value="copyright_nft">Copyright NFTs</option>
           </select>
         </div>


        <!-- Simulierter Ladezustand für die Liste -->
        <p v-if="isLoadingNFTs" class="loading-nfts">
          <LoadingIcon class="icon" :size="40" />
          Loading your NFTs (Simulated)...
        </p>
        <p v-else-if="filteredNFTs.length === 0">No NFTs found for this filter (Simulated).</p>
        <!-- Liste der Song Cards -->
        <SongCard
          v-else
          v-for="nft in filteredNFTs"
          :key="nft.id"
          :song="nft"
          @click="selectNFT(nft)"
          :class="{ selected: selectedNFT && selectedNFT.id === nft.id }"
        />
      </div>

      <!-- Rechte Seite: NFT Detail & Management (wird nur angezeigt, wenn ein NFT ausgewählt ist) -->
      <div class="nft-detail-view" v-if="selectedNFT">
        <h2>Details for: {{ selectedNFT.name }}</h2>
        <!-- NFT Details Abschnitt -->
        <div class="detail-summary">
             <img :src="selectedNFT.cover || 'https://via.placeholder.com/150?text=No+Cover'" alt="NFT Cover" class="detail-cover">
             <div class="detail-info">
                <h3>{{ selectedNFT.name || 'Untitled NFT' }}</h3>
                <!-- Hier den Typ anzeigen, basierend auf der internen 'type' Eigenschaft -->
                <p><strong>Type:</strong> {{ formatNFTType(selectedNFT.type) }}</p> <!-- Funktion für bessere Anzeige -->
                <p><strong>Genre:</strong> {{ selectedNFT.genre || 'Unknown' }}</p>
                <p v-if="selectedNFT.artist"><strong>Artist:</strong> {{ selectedNFT.artist }}</p>
                <!-- Preis anzeigen, falls vorhanden (relevant für Ownership NFTs) -->
                <p class="detail-price" v-if="selectedNFT.price"><strong>Price:</strong> {{ selectedNFT.price }}</p>
                 <!-- Einfacher Audio Player Placeholder für den Song selbst -->
                <div class="audio-player-placeholder">
                  <span>Audio Player Placeholder for {{ selectedNFT.name }}</span>
                  <button>▶ Play</button>
                </div>
             </div>
        </div>

        <!-- Management Section (Nur für OWNER_NFTs und Copyright NFTs?) -->
        <!-- Bedingung: Zeige Management für OWNER_NFTs UND Copyright_NFTs -->
        <div v-if="selectedNFT.type === 'owner_nft' || selectedNFT.type === 'copyright_nft'" class="management-section">
            <h4>Manage This {{ formatNFTType(selectedNFT.type) }}</h4> <!-- Zeige Typ in der Überschrift -->
             <p>Owner: You (Simulated Address)</p>
             <p>NFT ID: {{ selectedNFT.nftId || 'N/A' }}</p>

             <!-- Verkauf-Optionen NUR für OWNER_NFTs anzeigen (gemäß JSON-Beispiel) -->
             <template v-if="selectedNFT.type === 'owner_nft'">
                 <h5>Sales Management</h5>
                 <div v-if="!selectedNFT.isForSale">
                   <div class="form-group">
                     <label for="sell-price">Set Price (e.g., ETH):</label>
                     <input type="text" id="sell-price" v-model="sellPrice" placeholder="0.1">
                   </div>
                   <button class="sell-button" @click="listForSale(selectedNFT)" :disabled="!sellPrice">List for Sale (Simulated)</button>
                 </div>
                 <div v-else>
                   <p><strong>Currently listed for sale at:</strong> {{ selectedNFT.price }}</p>
                   <button class="unlist-button" @click="unlistFromSale(selectedNFT)">Remove from Sale (Simulated)</button>
                 </div>
             </template>

            <!-- NEUES DIV HIER: Management für exklusive Inhalte (NUR für OWNER_NFTs) -->
            <!-- Dieses DIV wird NUR angezeigt, wenn selectedNFT.type === 'owner_nft' -->
            <div v-if="selectedNFT.type === 'owner_nft'" class="exclusive-content-management">
                <h5>Exclusive Content Management</h5>
                <!-- Bereich zum Ändern von Channel Messages -->
                <div class="management-block">
                    <h6>Channel Messages</h6>
                    <textarea placeholder="Edit exclusive message for this NFT..." rows="3"></textarea>
                    <button class="save-button">Save Message (Simulated)</button>
                </div>
                <!-- Bereich zum Ändern von MV -->
                 <div class="management-block">
                    <h6>Music Video (MV)</h6>
                    <input type="text" placeholder="Link to exclusive MV file..." />
                    <button class="upload-button">Upload MV (Simulated)</button>
                    <button class="save-button">Save MV Link (Simulated)</button>
                </div>
                <!-- Bereich zum Ändern von Remixen -->
                 <div class="management-block">
                    <h6>Remixes</h6>
                     <!-- Hier könntest du eine Liste der vorhandenen Remix-Placeholders und Optionen zum Hinzufügen/Entfernen simulieren -->
                    <p>Remix List Placeholder:</p>
                     <ul>
                         <li>Remix 1 <button class="remove-button">Remove (Simulated)</button></li>
                         <li>Remix 2 <button class="remove-button">Remove (Simulated)</button></li>
                     </ul>
                    <input type="text" placeholder="Link to new remix file..." />
                    <button class="upload-button">Upload Remix (Simulated)</button>
                    <button class="save-button">Add Remix (Simulated)</button>
                </div>
            </div>

             <!-- Allgemeine Management-Buttons (Placeholder) -->
             <!-- Können hier bleiben oder spezifischer in die Abschnitte verschoben werden -->
             <button class="edit-metadata-button" @click="editMetadata(selectedNFT)">Edit General Metadata (Placeholder)</button>
         </div>


         <!-- KEINE TABS HIER -->

      </div>
      <!-- Placeholder, wenn kein Song ausgewählt ist -->
      <div class="nft-detail-view placeholder" v-else>
        <p>Select one of your NFTs from the list to view details and manage (OWNER_NFTs & Copyright NFTs).</p> <!-- Angepasster Text -->
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

// Material Design Icons Importe
import LockIcon from 'vue-material-design-icons/Lock.vue'; // Bleibt im Titel
import BlockHelperIcon from 'vue-material-design-icons/BlockHelper.vue'; // Für "Denied"
import LoadingIcon from 'vue-material-design-icons/Loading.vue'; // Für Ladeanzeige der Liste

// SongCard Komponente importieren
import SongCard from '@/components/SongCard.vue';


export default {
  name: 'MySongsPage',
  components: {
    // Registriere Icons und SongCard
    LockIcon, // Auch wenn es nur im Titel ist
    BlockHelperIcon,
    LoadingIcon,
    SongCard, // Wichtig: SongCard hier registrieren
    // KEINE ICONS FÜR DIE TABS HIER
  },
  setup() {
    // State Variablen
    const hasAccess = ref(false); // Simulierter Zugriffsstatus (sollte hier immer true sein)
    const isLoadingNFTs = ref(false); // Ladezustand für die NFT-Liste
    const allMyNFTs = ref([]); // Raw Liste ALLER simulierten NFTs (Owner + Fan + Copyright)
    const selectedNFT = ref(null); // Der aktuell ausgewählte NFT
    // KEIN activeTab STATE HIER

    // Filter State
    const filterType = ref('all'); // 'all', 'owner_nft', 'fan_nft', 'copyright_nft'

    // Management State (für Ownership)
    const sellPrice = ref('');

    // Computed Property für gefilterte Liste, basierend auf filterType
    const filteredNFTs = computed(() => {
        if (filterType.value === 'all') {
            return allMyNFTs.value;
        } else {
            // Filtert nach dem internen 'type' Attribut
            return allMyNFTs.value.filter(nft => nft.type === filterType.value);
        }
    });

    // Funktion zur Formatierung des NFT-Typs für die Anzeige
    const formatNFTType = (type) => {
        switch (type) {
            case 'owner_nft': return 'OWNER_NFT';
            case 'fan_nft': return 'Fan NFT';
            case 'copyright_nft': return 'Copyright NFT';
            default: return type;
        }
    };


    // --- SIMULATIONS METHODEN ---

     // Simuliert das anfängliche Laden der NFTs (Access wird hier immer gewährt)
     function checkAndLoadMyNFTs() {
       console.log('Starting simulated NFT load for My Songs...');
       // In My Songs gehen wir davon aus, dass der Nutzer verbunden ist und Zugriff hat.
       hasAccess.value = true; // Immer true setzen für My Songs Prototype
       // Lade die simulierte NFT-Liste
       fetchMyNFTs();
     }


    // Simuliert das Laden der exklusiven NFT-Liste
    async function fetchMyNFTs() {
      console.log('Fetching my NFTs (Simulated)...');
      isLoadingNFTs.value = true; // Ladezustand für Liste aktivieren
      allMyNFTs.value = []; // Raw Liste leeren
      selectedNFT.value = null; // Auswahl zurücksetzen

      try {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simuliere Latenz beim Laden der Liste

        // SIMULIERTE ROHDATEN für My Songs (OWNER_NFT, Fan, Copyright)
        // Passe diese Daten an deine Bedürfnisse an!
        // Ich erfinde hier beispielhafte Daten für Copyright NFTs.
        const rawSimulatedData = {
          "FAN_NFT": [
            {
              "id": "fan-0", // Eindeutige ID
              "type": "fan_nft", // Interner Typ
              "owner": "0xF84513d7a08eCA55b520f20cD558F4485abEbc62",
              "song_name": "Fan Exclusive Track Alpha", // Eindeutigerer Name
              "styles": "Hip Hop",
              "uri": "https://example.com/simulated/fan-track.mp3", // Kann die Song-URL sein
              "artist": "Simulated Artist A",
              "cover": "https://via.placeholder.com/100?text=FAN1" // Spezifisches Cover
            },
             {
               "id": "fan-1",
               "type": "fan_nft",
               "owner": "0xF84513d7a08eCA55b520f20cD558F4485abEbc62",
               "song_name": "Secret Fan Remix Beta",
               "styles": "Electronic",
               "uri": "https://example.com/simulated/fan-remix.mp3",
               "artist": "Simulated Artist B",
                "cover": "https://via.placeholder.com/100?text=FAN2" // Spezifisches Cover
             }
          ],
          "OWNER_NFT": [
            {
              "id": "owner-0",
              "type": "owner_nft", // Interner Typ
              "owner": "0xF84513d7a08eCA55b520f20cD558F4485abEbc62",
              "nftId": "0", // NFT Token ID
              "song_name": "OWNER_NFT Synthwave Dream", // Eindeutigerer Name
              "styles": "Synthwave",
              "uri": "https://example.com/simulated/owner-synthwave.mp3",
              "artist": "Simulated Artist C",
              "copyright_nft_price": "0.08 ETH", // Preis für Verkauf (wenn gelistet)
              "isForSale": true, // Simulieren, dass dieser gelistet ist
              "cover": "https://via.placeholder.com/100?text=OWNER1" // Spezifisches Cover
            },
             {
              "id": "owner-1",
              "type": "owner_nft",
              "owner": "0xF84513d7a08eCA55b520f20cD558F4485abEbc62",
              "nftId": "1", // NFT Token ID
              "song_name": "My Generated Track Rock",
              "styles": "Rock",
              "uri": "https://example.com/simulated/owner-rock.mp3",
              "artist": "Simulated Artist D",
              "copyright_nft_price": null, // Nicht gelistet
              "isForSale": false, // Simulieren, dass dieser NICHT gelistet ist
              "cover": "https://via.placeholder.com/100?text=OWNER2" // Spezifisches Cover
            }
          ],
           "COPYRIGHT_NFT": [
            {
              "id": "copyright-0",
              "type": "copyright_nft", // Interner Typ
              "owner": "0xF84513d7a08eCA55b520f20cD558F4485abEbc62",
              "nftId": "c0", // NFT Token ID (Beispiel)
              "song_name": "Copyright Share Pop Hit", // Eindeutigerer Name
              "styles": "Pop",
              "uri": "https://example.com/simulated/copyright-pop.mp3", // Song URL
              "artist": "Simulated Artist E",
              // Copyright NFTs haben vielleicht keinen individuellen Preis/isForSale hier
               "cover": "https://via.placeholder.com/100?text=COPYRIGHT1" // Spezifisches Cover
            },
            {
              "id": "copyright-1",
              "type": "copyright_nft",
              "owner": "0xF84513d7a08eCA55b520f20cD558F4485abEbc62",
              "nftId": "c1",
              "song_name": "Copyright Bundle Ambient",
              "styles": "Ambient",
              "uri": "https://example.com/simulated/copyright-ambient.mp3",
              "artist": "Simulated Artist F",
               "cover": "https://via.placeholder.com/100?text=COPYRIGHT2" // Spezifisches Cover
            }
           ]
        };

        // Verarbeite die Rohdaten und erstelle ein standardisiertes Format für die SongCard
        // Die IDs in den Rohdaten könnten die tatsächlichen Token-IDs sein,
        // aber für Vue Listen brauchen wir stabile, eindeutige Keys.
        // Hier verwenden wir die simulierten IDs, da sie jetzt in den Rohdaten sind.
        const processNFTs = (items, type) => items.map(item => ({
             id: item.id, // Verwende die simulierte ID
             type: type, // Setze den internen Typ
             nftId: item.nftId || item.song_id || null, // Versuche NFT ID zu bekommen
             name: item.song_name,
             genre: item.styles,
             cover: item.cover || `https://via.placeholder.com/100?text=${type.replace('_NFT', '').toUpperCase()}`, // Platzhalter Cover, falls kein spezifisches
             artist: item.artist || 'Unknown Artist', // Sicherstellen, dass artist immer da ist
             url: item.uri, // Song URL (simuliert)
             price: item.copyright_nft_price || null, // Preis (nur für Ownership relevant)
             isForSale: item.isForSale || false, // Zum Verkaufen/Entfernen (nur für Ownership relevant)
             // Füge hier weitere relevante Properties hinzu, die du anzeigen willst
         }));


        const fanNFTs = processNFTs(rawSimulatedData.FAN_NFT, 'fan_nft');
        const ownerNFTs = processNFTs(rawSimulatedData.OWNER_NFT, 'owner_nft');
        const copyrightNFTs = processNFTs(rawSimulatedData.COPYRIGHT_NFT, 'copyright_nft');


        // Kombiniere alle Listen
        allMyNFTs.value = [...ownerNFTs, ...fanNFTs, ...copyrightNFTs];
        // filteredNFTs computed property kümmert sich um die Anzeige basierend auf filterType

        console.log('My NFTs loaded (Simulated):', allMyNFTs.value);

      } catch (error) {
        console.error('Error fetching my NFTs (Simulated):', error);
        // Wenn Laden fehlschlägt, zeige Access Denied (selten in My Songs Prototype)
        hasAccess.value = false;
      } finally {
        isLoadingNFTs.value = false; // Ladezustand deaktivieren
      }
    }


    // Funktion, die aufgerufen wird, wenn ein Song aus der Liste geklickt wird
    function selectNFT(nft) { // Umbenannt von selectSong
      console.log('NFT selected:', nft);
      selectedNFT.value = nft; // selectedNFT
      // Beim Auswählen eines NFTs setzen wir den aktiven Tab im Detailbereich
      // activeTab.value = 'channel'; // KEIN activeTab mehr
    }

     // --- MANAGEMENT SIMULATIONS (NUR FÜR OWNER_NFTs und evtl. Copyright) ---
     // Diese Methoden aktualisieren NUR den Frontend-State
     function listForSale(nft) { // Umbenannt von song
        if (!sellPrice.value || isNaN(parseFloat(sellPrice.value))) {
          alert('Please enter a valid price.');
          return;
        }
        console.log(`Simulating listing NFT ${nft.id} for sale at ${sellPrice.value} ETH`);
        // Finde den NFT in allMyNFTs und aktualisiere ihn
        const item = allMyNFTs.value.find(item => item.id === nft.id);
        if (item) {
            item.isForSale = true;
            item.price = `${sellPrice.value} ETH`;
        }
        sellPrice.value = ''; // Reset input
        alert(`Simulated: ${nft.name} listed for ${item.price}`);
     }

     function unlistFromSale(nft) { // Umbenannt von song
        console.log(`Simulating removing NFT ${nft.id} from sale`);
         const item = allMyNFTs.value.find(item => item.id === nft.id);
        if (item) {
            item.isForSale = false;
            item.price = null;
        }
        alert(`Simulated: ${nft.name} removed from sale`);
     }

     function editMetadata(nft) { // Umbenannt von song
       console.log(`Simulating editing metadata for NFT ${nft.id}`);
       alert(`Simulated: Editing metadata for ${nft.name}`);
       // Hier könnte ein Modal oder eine andere UI für die Bearbeitung erscheinen
     }

     // Simulierte Methoden für Content Management (Placeholder)
     function saveMessage(nftId) { console.log(`Simulating saving message for ${nftId}`); alert('Message saved (Simulated)'); }
     function saveMvLink(nftId) { console.log(`Simulating saving MV link for ${nftId}`); alert('MV link saved (Simulated)'); }
     function addRemix(nftId) { console.log(`Simulating adding remix for ${nftId}`); alert('Remix added (Simulated)'); }
     function removeRemix(nftId, remixId) { console.log(`Simulating removing remix ${remixId} for ${nftId}`); alert('Remix removed (Simulated)'); }


    // Beim Mounten der Komponente die simulierte Prüfung und das Laden starten
    onMounted(() => {
       checkAndLoadMyNFTs(); // Startet die simulierte Prüfung und lädt dann die NFTs
    });

    // Rückgabe der State-Variablen und Methoden für das Template
    return {
      hasAccess, // Zugriffsstate (sollte hier meist true sein)
      isLoadingNFTs, // Ladezustand für die Liste
      filteredNFTs, // Die GEFILTERTE Liste der NFTs für v-for
      selectedNFT, // Der ausgewählte NFT
      filterType, // Der ausgewählte Filter
      sellPrice, // Preis für Verkaufseingabe

      formatNFTType, // Funktion zur Anzeige des Typs
      checkAndLoadMyNFTs, // Methode zum Neuladen (z.B. bei Access Denied)
      selectNFT, // Methode zum Auswählen eines NFTs
      listForSale, // Simulierte Verkaufsmethode
      unlistFromSale, // Simulierte Entfernen-Methode
      editMetadata, // Simulierte Metadata-Methode
      // Simulierte Content Management Methoden
      saveMessage,
      saveMvLink,
      addRemix,
      removeRemix,
    };
  }
};
</script>

<style scoped>
/* --- Styling basierend auf den Werten im CSS deines Originalbeispiels --- */

.my-songs-page {
  max-width: 1200px; /* Etwas breiter für Liste+Detail */
  margin: 20px auto;
  padding: 20px; /* Padding hinzugefügt, falls in base/main.css nicht global gesetzt */
   /* Hintergrund und Textfarbe kommen wahrscheinlich aus base.css.
      Wenn du spezifische # Farben willst, müsstest du base.css überschreiben
      oder hier direkt setzen. Wir orientieren uns an deinem Beispiel-CSS: */
  background-color: var(--color-background); /* Nutzt base.css, oft dunkel */
  color: var(--color-text); /* Nutzt base.css, oft hell bei dunklem BG */
}

.my-songs-page h1 {
  /* Styling aus base.css/App.vue kann übernommen werden */
  color: var(--color-heading); /* Akzentfarbe oder wie gewünscht */
  border-bottom: 1px solid var(--color-border); /* Trennlinie wie in base.css */
  padding-bottom: 10px;
  margin-bottom: 20px;
  display: flex; /* Für Icon */
  align-items: center; /* Für Icon */
  gap: 10px; /* Für Icon */
}

.my-songs-page > p { /* P unter h1 (die Beschreibung) */
    color: var(--color-text); /* Textfarbe aus base.css */
    margin-bottom: 20px;
}


.access-denied {
  color: #ff6b6b; /* Rot */
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
    font-weight: normal; /* Standard Gewicht */
    color: var(--color-text); /* Textfarbe */
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

.nft-list { /* Umbenannt */
  flex: 1; /* Nimmt verfügbaren Platz ein */
  max-width: 350px; /* Etwas breiter für die Liste */
  overflow-y: auto; /* Scrollbar, wenn Liste zu lang wird */
  border: 1px solid #444; /* Borderfarbe aus deinem Beispiel */
  padding: 10px;
  border-radius: 4px;
  background-color: #555; /* Hintergrund aus deinem Beispiel */
}
.nft-list h3 { /* Angepasst */
    margin-top: 0;
    color: #f2f2f2; /* Heller Text */
    border-bottom: 1px solid #444; /* Trennlinie wie im Beispiel */
    padding-bottom: 8px;
    margin-bottom: 10px;
}

.nft-list .filters { /* Angepasst */
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #444;
    display: flex;
    align-items: center;
    gap: 10px;
}
.nft-list .filters label { /* Angepasst */
    font-weight: bold;
    color: #f2f2f2;
    font-size: 0.9em;
}
.nft-list .filters select { /* Angepasst */
    padding: 5px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #666;
    color: white;
    font-size: 0.9em;
}


/* Styling für SongCard innerhalb der Liste */
.nft-list .song-card { /* Angepasst */
    margin-bottom: 10px; /* Abstand zwischen den Karten */
    background-color: #666; /* Hintergrund für Karten */
    border: 1px solid #555; /* Border für Karten */
    cursor: pointer; /* Visueller Hinweis, dass man klicken kann */
}
.nft-list .song-card:hover { /* Angepasst */
    background-color: #777; /* Hover-Hintergrund für Karten */
}
.nft-list .song-card.selected { /* Angepasst */
    border-color: #42b983; /* Akzentfarbe für ausgewählte Karte */
    background-color: #555; /* Hintergrund für ausgewählte Karte */
}


.loading-nfts { /* Umbenannt */
  text-align: center;
  padding: 20px;
  color: #f2f2f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.loading-nfts .icon { /* Umbenannt */
    color: #42b983; /* Akzentfarbe */
    font-size: 40px;
    animation: spinner 1.5s linear infinite;
}


.nft-detail-view { /* Umbenannt */
  flex: 2; /* Nimmt mehr Platz ein */
  border: 1px solid #444; /* Borderfarbe aus deinem Beispiel */
  padding: 20px;
  border-radius: 8px;
  background-color: #555; /* Hintergrund aus deinem Beispiel */
  display: flex; /* Inhalt der Detailansicht flexibel anordnen */
  flex-direction: column; /* Elemente untereinander */
  gap: 20px; /* Abstand zwischen den Sektionen */
}

.nft-detail-view.placeholder { /* Umbenannt */
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
/* Spezifisches Styling für den Preis im Detail */
.detail-summary .detail-info p.detail-price {
    font-weight: bold;
    color: #42b983; /* Akzentfarbe */
    font-size: 1em; /* Standard Größe */
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

/* Container für Management UND Content Management */
.management-and-content-sections {
    display: flex;
    flex-direction: column;
    gap: 20px; /* Abstand zwischen Sektionen */
}


/* Styling für Management Section (Owner/Copyright) */
.management-section {
    border: 1px solid #444;
    border-radius: 8px;
    padding: 15px;
    background-color: #666; /* Etwas heller als der NFT-Detail BG */
    color: #f2f2f2;
}
.management-section h4 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #f2f2f2;
    border-bottom: 1px solid #555;
    padding-bottom: 8px;
}
.management-section p {
    margin: 5px 0;
    font-size: 0.9em;
    color: #ccc;
}
.management-section .form-group {
    margin: 10px 0;
}
.management-section .form-group label {
    display: block;
    font-size: 0.8em;
    margin-bottom: 3px;
    color: #ccc;
}
.management-section .form-group input[type="text"] {
    padding: 5px 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #777;
    color: white;
    width: 100px; /* Kleinere Breite */
}
.management-section button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 5px;
}
.management-section .sell-button {
    background-color: #2196F3; /* Blau */
    color: white;
}
.management-section .sell-button:disabled {
   background-color: #999;
   cursor: not-allowed;
}
.management-section .unlist-button {
    background-color: #f44336; /* Rot */
    color: white;
}
.management-section .edit-metadata-button {
    background-color: #42b983; /* Grün */
    color: white;
}


/* Styling für Exclusive Content Management Section (NUR für OWNER_NFTs) */
.exclusive-content-management {
    border: 1px solid #444; /* Border wie Management Section */
    border-radius: 8px;
    padding: 15px;
    background-color: #666; /* Hintergrund wie Management Section */
    color: #f2f2f2;
}
.exclusive-content-management h5 {
     margin-top: 0;
     margin-bottom: 15px;
     color: #f2f2f2;
     border-bottom: 1px solid #555;
     padding-bottom: 8px;
}

.exclusive-content-management .management-block {
     margin-bottom: 20px; /* Abstand zwischen den Blöcken (Messages, MV, Remixes) */
     padding-bottom: 15px;
     border-bottom: 1px dashed #555; /* Gestrichelte Trennlinie */
}
.exclusive-content-management .management-block:last-child {
     border-bottom: none; /* Keine Linie unter dem letzten Block */
     padding-bottom: 0;
     margin-bottom: 0;
}

.exclusive-content-management .management-block h6 {
     margin-top: 0;
     margin-bottom: 10px;
     color: #ccc; /* Gedämpfter Text */
     font-size: 1em;
}

.exclusive-content-management textarea,
.exclusive-content-management input[type="text"] {
    width: 100%;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background-color: #777;
    color: white;
    box-sizing: border-box; /* Verhindert Überlaufen */
    margin-bottom: 10px; /* Abstand zu Buttons */
}
.exclusive-content-management textarea {
    min-height: 80px;
    resize: vertical; /* Nur vertikal skalierbar */
}

.exclusive-content-management button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    margin-right: 10px;
    margin-top: 5px; /* Abstand von Inputs/Textareas */
}
.exclusive-content-management .save-button {
     background-color: #4CAF50; /* Grün */
     color: white;
}
.exclusive-content-management .save-button:hover {
     background-color: #388E3C;
}
.exclusive-content-management .upload-button {
     background-color: #FFC107; /* Gelb */
     color: #333;
}
.exclusive-content-management .upload-button:hover {
     background-color: #FFA000;
}
.exclusive-content-management .remove-button {
    background-color: #f44336; /* Rot */
    color: white;
    padding: 4px 8px; /* Kleiner */
    font-size: 0.8em;
    font-weight: normal;
    margin-left: 10px;
    margin-right: 0;
}
.exclusive-content-management ul {
    list-style: none;
    padding: 0;
    margin-bottom: 15px;
}
.exclusive-content-management li {
    background-color: #777; /* Etwas heller als Block BG */
    padding: 8px 12px;
    border-radius: 4px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}


/* KEINE TABS HIER */


/* Spinner Icon */
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

  .nft-list { /* Angepasst */
    max-width: 100%; /* Liste nimmt volle Breite ein */
    overflow-y: visible; /* Kein Scrollen auf der Liste selbst */
    max-height: none; /* Keine feste Höhe */
  }

  .nft-list .filters { /* Angepasst */
       justify-content: center; /* Filter zentrieren */
       flex-wrap: wrap;
  }

  .nft-detail-view { /* Angepasst */
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

   .management-section button,
   .exclusive-content-management button {
       margin-right: 5px;
       margin-bottom: 5px; /* Abstand zwischen Buttons */
   }
    .exclusive-content-management li button { /* Remove Button in Liste */
        margin-right: 0;
        margin-bottom: 0;
    }
}

</style>