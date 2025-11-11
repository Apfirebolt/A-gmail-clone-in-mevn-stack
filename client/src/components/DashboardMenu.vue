<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <ul class="flex items-center justify-center space-x-1 px-4 py-3">
      <li>
        <router-link
          to="/inbox"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95"
          active-class="bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600"
        >
          <span class="mr-2">📥</span>
          Inbox
        </router-link>
      </li>
      <li>
        <router-link
          to="/sent"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95"
          active-class="bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600"
        >
          <span class="mr-2">📤</span>
          Sent
        </router-link>
      </li>
      <li>
        <router-link
          to="/trash"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95"
          active-class="bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600"
        >
          <span class="mr-2">🗑️</span>
          Trash
        </router-link>
      </li>
      <li>
        <router-link
          to="/important"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95"
          active-class="bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600"
        >
          <span class="mr-2">⭐</span>
          Important
        </router-link>
      </li>
      <li>
        <router-link
          to="/read"
          class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 active:scale-95"
          active-class="bg-blue-100 text-blue-700 font-semibold border-b-2 border-blue-600"
        >
          <span class="mr-2">📧</span>
          Read
        </router-link>
      </li>
      <li>
        <router-link
          to="/compose"
          class="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 active:scale-95 shadow-sm"
        >
          <span class="mr-2">✏️</span>
          Compose
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isSelected = ref(false);

const toggleSelection = () => {
  isSelected.value = !isSelected.value;
};
</script>
