<template>
  <div v-if="email" class="rounded overflow-hidden shadow-lg p-4 bg-white">
    <div class="font-bold text-xl mb-2">{{ email.subject }}</div>
    <p class="text-gray-700 text-base">{{ email.content }}</p>
    <div class="mt-4">
      <span class="text-gray-600 text-sm">From: {{ email.from ? email.from.email : "" }}</span>
    </div>
    <div>
      <span class="text-gray-600 text-sm">Date: {{ formatDate(email.date) }}</span>
    </div>
  
    <div v-if="email.attachments && email.attachments.length > 0" class="mt-4">
      <div v-for="(attachment, index) in email.attachments" :key="index" class="mt-2">
        <img :src="attachment" alt="" class="h-32 w-48">
      </div>
    </div>
    <div v-else class="mt-4 text-gray-600 text-sm">
      No attachments available
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
defineProps({
  email: {
    type: Object,
    required: true,
    default: {},
  },
});

const getFullUrl = (attachment) => {
  return `localhost:5000/${attachment}`;
};

const formatDate = (date) => dayjs(date).format("MMM D, YYYY h:mm A");
</script>
