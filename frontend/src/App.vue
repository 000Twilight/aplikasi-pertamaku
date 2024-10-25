<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');

const getUser = async () => {
  try {
    const response = await fetch(`http://localhost:8081/mario/backend/api/user/${userId.value}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    users.value = await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
  }
};

const changeEmail = async () => {
  try {
    const response = await fetch(`http://localhost:8081/mario/backend/api/user/${userId.value}/change-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: newEmail.value }), 
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.text();
    console.log('Email updated successfully:', result);
  } catch (error) {
    console.error('Failed to update email:', error.message);
  }
};

</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
      <template v-for="user in users">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <hr />
      </template>
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>
