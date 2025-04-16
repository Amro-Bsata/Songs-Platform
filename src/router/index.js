import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CreateSongPage from '../views/CreateSongPage.vue'
import SongListPage from '../views/SongListPage.vue'
import MarketplacePage from '../views/MarketplacePage.vue'
import MySongsPage from '../views/MySongsPage.vue'
import TopSecretsPage from '../views/TopSecretsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/create',
    name: 'CreateSong',
    component: CreateSongPage
  },
  {
    path: '/songs', // Allgemeine Liste aller Songs
    name: 'SongList',
    component: SongListPage
  },
  {
    path: '/marketplace', // Kaufen/Verkaufen
    name: 'Marketplace',
    component: MarketplacePage
  },
  {
    path: '/my-songs', // Eigene Songs verwalten
    name: 'MySongs',
    component: MySongsPage
    // Hier könnte eine Route Guard hin, um sicherzustellen, dass der User eingeloggt ist
    // meta: { requiresAuth: true }
  },
  {
    path: '/top-secrets',
    name: 'TopSecrets',
    component: TopSecretsPage
     // Hier könnte eine Route Guard hin, die prüft, ob der User den TOP-Fan NFT hat
    // meta: { requiresTopFanNFT: true }
  },
  // Optional: Eine dedizierte Detailseite für Songs
  // {
  //   path: '/song/:id',
  //   name: 'SongDetailView',
  //   component: () => import(/* webpackChunkName: "song-detail" */ '../views/SongDetailViewPage.vue'), // Beispiel für Lazy Loading
  //   props: true // Übergibt :id als Prop an die Komponente
  // }
]

const router = createRouter({
    // history: createWebHistory(process.env.BASE_URL), // Alte, problematische Zeile auskommentieren oder löschen
    history: createWebHistory(), // <--- DIESE ZEILE VERWENDEN
    routes
  })

// Beispiel für eine einfache Route Guard (müsste Logik zum Prüfen enthalten)
// router.beforeEach((to, from, next) => {
//   const isLoggedIn = /* Logik zum Prüfen des Login-Status */;
//   const hasTopFanNFT = /* Logik zum Prüfen des NFT-Besitzes */;

//   if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
//     // Redirect zum Login oder zur Homepage
//     next({ name: 'Home' });
//   } else if (to.matched.some(record => record.meta.requiresTopFanNFT) && !hasTopFanNFT) {
//      // Redirect zur Homepage oder einer Info-Seite
//      next({ name: 'Home' });
//   }
//   else {
//     next(); // Erlaube Navigation
//   }
// })

export default router