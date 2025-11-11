<template>
  <main class="shadow sm:rounded-lg" id="about">
    <div class="px-4 py-8 sm:px-6 lg:px-8">
      <h2 class="text-4xl font-bold text-center text-gray-900 mb-8">Dashboard</h2>
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
      <p class="text-center text-lg text-gray-700">
        Welcome back,
        <span v-if="authData" class="font-bold text-indigo-600">
        {{ authData.username }}
        </span>
        <span v-else class="font-semibold text-gray-500">Guest</span>
      </p>
      </div>
      <DashboardMenu />
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import DashboardMenu from "../components/DashboardMenu.vue";

import { useAuth } from "../store/auth";
import { useEmailStore } from "../store/mail";

const auth = useAuth();
const emailStore = useEmailStore();

const authData = computed(() => auth.getAuthData);

onMounted(() => {
  emailStore.getEmailsAction();
});

</script>
