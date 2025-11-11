<template>
  <section class="shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5 sm:p-6 bg-white">
      <h2 class="text-3xl my-2 py-2 text-center text-jet-black font-bold">
        ABOUT
      </h2>
      <p class="text-gray-700 leading-relaxed">
        Mini Url is a simple URL shortening service that allows you to shorten
        long URLs into short and manageable links.
      </p>
      <p class="mt-4 text-gray-700 leading-relaxed">
        The app is built using Vue.js, Tailwind CSS, and Express. It is a single
        page application that uses Express back-end for authentication and
        MongoDB for data storage. The app is responsive and works on desktop,
        tablet, and mobile devices.
      </p>
    </div>
  </section>

  <section class="bg-white shadow sm:rounded-lg" id="pricing">
    <div class="px-4 py-5 sm:p-6">
      <h2 class="text-3xl my-2 py-2 text-center text-jet-black">PRICING</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div
          v-for="plan in plans"
          :key="plan.name"
          class="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <h3 class="text-xl font-semibold text-gray-900">{{ plan.name }}</h3>
          <p class="text-2xl font-bold text-secondary-100 mt-4">{{ plan.price }}</p>
          <ul class="mt-6 space-y-3">
            <li
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start"
            >
              <svg
                class="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span class="text-sm text-gray-600">{{ feature }}</span>
            </li>
          </ul>
          <button
            @click="subscribe(plan.name)"
            :disabled="plan.name === 'Free' || isRedirecting"
            class="mt-8 w-full font-medium py-2 px-4 rounded-md transition-colors"
            :class="{
                // Conditional styling based on plan/state
                'bg-primary-200 hover:bg-red-700 hover:text-secondary-200 text-black': plan.name !== 'Free' && !isRedirecting,
                'bg-gray-400 text-gray-600 cursor-not-allowed': plan.name === 'Free' || isRedirecting
            }"
          >
            {{ plan.name === 'Free' ? 'Current Plan' : (isRedirecting ? 'Redirecting...' : 'Choose Plan') }}
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="bg-white shadow sm:rounded-lg" id="contact">
    <div class="px-4 py-5 sm:p-6">
      <h2 class="text-3xl my-2 py-2 text-center text-jet-black">CONTACT</h2>
      <div class="grid grid-cols-2 gap-4 mt-3">
        <div>
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Feel free to reach out to us!
          </h3>
          <p class="mt-2 max-w-xl text-sm text-gray-500">
            If you have any questions or feedback, please feel free to reach out
            to us. We would love to hear from you!
          </p>
        </div>
        <form class="space-y-6 p-4 border border-gray-200 rounded-lg">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <div class="mt-1">
              <input
                type="text"
                name="name"
                id="name"
                class="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <div class="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                class="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </div>
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700"
              >Message</label
            >
            <div class="mt-1">
              <textarea
                id="message"
                name="message"
                rows="4"
                class="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                required
              ></textarea>
            </div>
          </div>
          <div>
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-secondary-100 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useAuth } from "../store/auth";
import httpClient from '../plugins/interceptor';

const auth = useAuth();
const isRedirecting = ref(false); 
const authData = computed(() => auth.getAuthData);

const plans = ref([
  {
    name: "Free",
    price: "$0/month",
    features: ["Basic URL shortening", "Limited analytics"],
  },
  {
    name: "Pro",
    price: "$9.99/month",
    features: [
      "Advanced URL shortening",
      "Detailed analytics",
      "Custom domains",
    ],
  },
  {
    name: "Enterprise",
    price: "Contact us",
    features: ["All Pro features", "Dedicated support", "Custom solutions"],
  },
]);

onMounted(async () => {
  await auth.getProfileData();
});


// Added subscribe function for Stripe integration
const subscribe = async (planName) => {
    // NOTE: This assumes useAuth exposes a reactive 'isAuthenticated' or similar status
    if (!authData.value) {
        console.error("Authentication required to subscribe.");
        return;
    }
    
    isRedirecting.value = true;

    try {
        // 1. Call the Express backend to create the Checkout Session
        const response = await httpClient.post('/api/payments/create-checkout-session', {
            planName: planName,
            // Stripe requires absolute URLs for redirects
            successUrl: `${window.location.origin}/profile?payment=success`, 
            cancelUrl: `${window.location.origin}/pricing?payment=cancelled`, 
        });

        const { url } = response.data;
        
        if (url) {
            // 2. Redirect the user to the Stripe Checkout page
            window.location.href = url;
        } else {
            throw new Error("Stripe URL not returned.");
        }

    } catch (error) {
        console.error("Error creating Stripe Checkout session:", error);
        // Fallback UI error handling
        isRedirecting.value = false;
    }
};
</script>