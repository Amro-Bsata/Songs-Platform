<template>
  <div class="song-card">
    <img :src="song.cover || 'https://via.placeholder.com/100?text=No+Cover'" alt="Song Cover" class="song-cover">
    <div class="song-info">
      <h4 class="song-name">{{ song.name || 'Untitled Song' }}</h4>
      <p class="song-genre">{{ song.genre || 'Unknown Genre' }}</p>
      <!-- Unklar was "13 shot" bedeutet, als Detail anzeigen -->
      <p class="song-details" v-if="song.details">{{ song.details }}</p>
      <!-- Preis anzeigen, wenn vorhanden (z.B. im Marketplace oder MySongs) -->
      <p class="song-price" v-if="song.price">{{ song.price }}</p>
    </div>
    <!-- Play Button (Platzhalter) -->
    <button class="play-button" @click.stop="playSong">▶</button>
  </div>
</template>

<script>
export default {
  name: 'SongCard',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
  methods: {
    playSong() {
      // Verhindert, dass der Klick auf die Karte auch ausgelöst wird
      // (falls die Karte selbst @click hat)
      // event.stopPropagation();
      console.log('Playing song:', this.song.name);
      alert(`Playing ${this.song.name} (Placeholder)`);
      // Hier könnte Audio-Playback-Logik starten
    }
  }
};
</script>

<style scoped>
.song-card {
  border: 1px solid #444;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #555;
  cursor: pointer;
  /* Zeigt an, dass man draufklicken kann */
  transition: box-shadow 0.2s ease-in-out;
  position: relative;
  /* Für absolute Positionierung des Play-Buttons */
}

.song-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.song-cover {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.song-info {
  flex-grow: 1;
  overflow: hidden;
}

.song-name {
  margin: 0 0 5px 0;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-genre,
.song-details,
.song-price {
  margin: 2px 0;
  font-size: 0.9em;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-price {
  font-weight: bold;
  color: #42b983;
}

.play-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.song-card:hover .play-button {
  opacity: 1;
}
</style>