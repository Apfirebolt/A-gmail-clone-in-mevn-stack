<template>
  <Disclosure as="nav" class="bg-secondary-100 shadow-lg" v-slot="{ open }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h2 class="text-2xl text-white font-bold tracking-tight">Emailer</h2>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex space-x-2">
              <span
                v-if="userData"
                class="text-gray-300 px-3 py-2 rounded-lg text-sm font-medium"
              >
                Welcome, {{ userData.username }}
              </span>
              <router-link
                to="/"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                >Home</router-link
              >
              <router-link
                v-if="!userData"
                to="/login"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                >Login</router-link
              >
              <router-link
                v-if="!userData"
                to="/register"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                >Register</router-link
              >
              <router-link
                v-if="userData"
                to="/logout"
                class="text-gray-300 hover:bg-red-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                @click.prevent="logoutUtil"
                >Log out</router-link
              >
              <router-link
                v-if="userData"
                to="/dashboard"
                class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                >Dashboard</router-link
              >
            </div>
          </div>
        </div>

        <div class="-mr-2 flex sm:hidden">
          <DisclosureButton
            class="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-200"
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden shadow-inner">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <span
          v-if="userData"
          class="text-white block px-3 py-2 rounded-lg text-base font-medium bg-gray-700/30"
        >
          Welcome, {{ userData.username }}
        </span>
        <router-link
          to="/"
          class="text-white hover:bg-gray-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >Home</router-link
        >
        <router-link
          v-if="!userData"
          to="/login"
          class="text-white hover:bg-gray-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >Login</router-link
        >
        <router-link
          v-if="!userData"
          to="/register"
          class="text-white hover:bg-gray-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >Register</router-link
        >
        <router-link
          v-if="userData"
          to="/logout"
          class="text-white hover:bg-red-600 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          @click.prevent="logoutUtil"
          >Log out</router-link
        >
        <router-link
          v-if="userData"
          to="/dashboard"
          class="text-white hover:bg-gray-700 block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200"
          >Dashboard</router-link
        >
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { computed } from "vue";
import { useAuth } from "../store/auth";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { MenuIcon, XIcon } from "@heroicons/vue/outline";

const auth = useAuth();
const userData = computed(() => auth.authData);

const logoutUtil = () => {
  auth.logout();
};
</script>
