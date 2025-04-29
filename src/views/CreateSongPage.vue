<template>
  <div class="create-song-page">
    <h1>Create a Song</h1>
    <div class="creation-form">
      <div class="left-panel">
        <div class="form-group">
          <label for="prompt">Prompt:</label>
          <textarea id="prompt" v-model="prompt" rows="5"
            placeholder="Describe the music you want to create (e.g., '80s synthwave track with driving bassline')..."></textarea>
        </div>

        <div class="form-group">
          <label for="genre">Genre (Liste):</label>
          <select id="genre" v-model="selectedGenre">
            <option disabled value="">Please select one</option>
            <option>Pop</option>
            <option>Rock</option>
            <option>Synthwave</option>
            <option>Classical</option>
            <option>Hip Hop</option>
            <!-- Weitere Genres von API oder fest definiert -->
          </select>
        </div>

        <div class="form-group">
          <label for="native-genre">Native Genre (Liste):</label>
          <p style="font-size: 0.8em; color: grey;">(Unklar, was hier gemeint ist - evtl. Subgenre? Vorerst wie oben)
          </p>
          <select id="native-genre" v-model="selectedNativeGenre">
            <option disabled value="">Please select one</option>
            <option>Subgenre A</option>
            <option>Subgenre B</option>
            <!-- Weitere Subgenres? -->
          </select>
        </div>

        <!-- Cover Upload/Link wurde durchgestrichen, optional hinzufügen:
          <div class="form-group">
            <label for="cover">Cover Art (Optional):</label>
            <input type="file" id="cover" @change="handleFileUpload">
            <span>OR</span>
            <input type="text" placeholder="Link to cover image" v-model="coverLink">
          </div>
          -->

        <button @click="generateSong" class="generate-button">Generate Song</button>
        <!-- Platzhalter für Ladeanzeige -->
        <div v-if="isLoading">Generating... please wait.</div>
        <!-- Platzhalter für Ergebnis/Fehler -->
        <div v-if="generatedSongUrl">
          Song generated! <a :href="generatedSongUrl" target="_blank">Listen</a>
          <button @click="mintNFT">Mint NFT</button> <!-- Nächster Schritt -->
        </div>
        <div v-if="error">{{ error }}</div>

      </div>
      <div class="right-panel">
        <div class="image-placeholder">
          <!-- Hier könnte das Cover-Bild angezeigt werden, wenn vorhanden -->
          <span>Cover Preview</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateSongPage',
  data() {
    return {
      prompt: '',
      selectedGenre: '',
      selectedNativeGenre: '',
      // coverFile: null,
      // coverLink: '',
      isLoading: false,
      generatedSongUrl: null, // Hier würde die URL vom Backend/Suno kommen
      error: null,
    };
  },
  methods: {
    // handleFileUpload(event) {
    //   this.coverFile = event.target.files[0];
    // },
    generateSong() {
      this.isLoading = true;
      this.error = null;
      this.generatedSongUrl = null;
      console.log('Generating song with:', {
        prompt: this.prompt,
        genre: this.selectedGenre,
        nativeGenre: this.selectedNativeGenre, // Was immer das bedeutet
        // cover: this.coverFile || this.coverLink,
      });

      // --- HIER WÜRDE DER API-AUFRUF AN DEIN BACKEND ERFOLGEN ---
      // Dein Backend würde dann die Suno API (oder ähnliches) aufrufen.
      // Beispielhafte Simulation:
      setTimeout(() => {
        if (this.prompt && this.selectedGenre) {
          // Simuliert erfolgreiche Generierung
          this.generatedSongUrl = 'https://example.com/path/to/generated/song.mp3'; // Platzhalter URL
          this.isLoading = false;
        } else {
          // Simuliert Fehler
          this.error = 'Please provide a prompt and select a genre.';
          this.isLoading = false;
        }
      }, 3000); // Simuliert 3 Sekunden Wartezeit
    },
    mintNFT() {
      console.log('Minting NFT for song:', this.generatedSongUrl);
      // --- HIER WÜRDE DIE LOGIK ZUM NFT MINTEN STARTEN ---
      // (Interaktion mit Backend/Smart Contract)
      alert('NFT Minting process started (Placeholder)');
    }
  },
};
</script>

<style scoped>
.create-song-page {
  max-width: 900px;
  margin: auto;
}

.creation-form {
  display: flex;
  gap: 30px;
  /* Abstand zwischen Formular und Bild */
}

.left-panel {
  flex: 2;
  /* Formular nimmt mehr Platz ein */
}

.right-panel {
  flex: 1;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group textarea,
.form-group select,
.form-group input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  /* Verhindert Überlaufen durch Padding */
}

.form-group textarea {
  min-height: 80px;
}

.generate-button {
  padding: 12px 25px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
}

.generate-button:hover {
  background-color: #36a86e;
}

.image-placeholder {
  width: 100%;
  height: 200px;
  /* Beispielhöhe */
  background-color: #eee;
  border: 1px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
  border-radius: 4px;
}

/* Styling für Lade-/Erfolgs-/Fehlermeldungen */
div[v-if] {
  margin-top: 15px;
  font-weight: bold;
}

div[v-if^="error"] {
  color: red;
}

div[v-if^="generatedSongUrl"] {
  color: green;
}
</style>