<template>
  <button @click="login">Login with MetaMask</button>
  <button @click="fetchProtectedData">Fetch Protected Data</button>

</template>

<script>
import { ethers } from 'ethers';
import axios from 'axios';

export default {
  name: 'MetaMaskLogin',
  methods: {
    async login() {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // 1. Fetch nonce from backend
      const { data } = await axios.get('http://localhost:5000/api/nonce', {
        params: { address }
      });
      const nonce = data.nonce;

      // 2. Sign the nonce
      const signature = await signer.signMessage(nonce);

      // 3. Send signature to server for verification
      const resp = await axios.post('http://localhost:5000/api/login', {
        address,
        signature
      });

      if (resp.data.success) {
        console.log('Authenticated:', resp.data.address);
        const token = resp.data.access_token;
        localStorage.setItem('access_token', token);
        // Store session token or proceed
      } else {
        console.error('Auth failed', resp.data.error);
      }
    },
    async fetchProtectedData() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found!');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Protected data:', response.data);
      } catch (error) {
        console.error('Access denied or error:', error.response?.data || error.message);
      }
    }
  }
};
</script>