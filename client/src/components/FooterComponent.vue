<template>
  <footer class="bg-gray-800 text-white py-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-bold mb-3">Gmail Clone</h3>
          <p class="text-gray-300">A modern email client built with Vue.js</p>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-3">Quick Links</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-lg font-semibold mb-3">Contact</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Support</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">Feedback</a></li>
            <li><a href="#" class="text-gray-300 hover:text-white transition-colors">About</a></li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-700 mt-8 pt-6 text-center">
        <p class="text-gray-400">&copy; {{ currentYear }} Gmail Clone. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  setup() {
    const currentYear = computed(() => new Date().getFullYear());

    return {
      currentYear,
    };
  },
});
</script>

<style>
/* Add any custom styles here */
</style>
