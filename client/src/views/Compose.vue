<template>
  <main class="shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5">
      <h2 class="text-3xl my-2 py-2 text-center text-jet-black">COMPOSE</h2>
      <div class="flex flex-col items-center bg-gray-100 p-4 rounded-md">
        <p>Welcome to the email compose page</p>
      </div>
      <DashboardMenu />
      <form
        class="w-full max-w-2xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-lg"
        @submit.prevent="sentEmailUtil"
      >
        <div class="mb-6">
          <label
            class="block text-gray-800 text-sm font-semibold mb-2"
            for="recepients"
          >
            Select Recipients
          </label>
          <Combobox v-model="selected">
            <div class="relative mt-1">
              <div
                class="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left border border-gray-300 focus-within:border-primary-200 focus-within:ring-2 focus-within:ring-blue-200 transition-all"
              >
                <ComboboxInput
                  class="w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none"
                  :displayValue="(person) => person.email"
                  @change="query = $event.target.value"
                />
                <ComboboxButton
                  class="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                </ComboboxButton>
              </div>
              <TransitionRoot
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                @after-leave="query = ''"
              >
                <ComboboxOptions
                  class="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-xl border border-gray-200 focus:outline-none"
                >
                  <div
                    v-if="filteredPeople.length === 0 && query !== ''"
                    class="relative cursor-default select-none px-4 py-3 text-gray-500"
                  >
                    Nothing found.
                  </div>

                  <ComboboxOption
                    v-for="person in filteredPeople"
                    as="template"
                    :key="person.id"
                    :value="person"
                    v-slot="{ selected, active }"
                  >
                    <li
                      class="relative cursor-pointer select-none py-3 pl-10 pr-4"
                      :class="{
                        'bg-primary-300 text-white': active,
                        'text-gray-900': !active,
                      }"
                    >
                      <span
                        class="block truncate"
                        :class="{
                          'font-semibold': selected,
                          'font-normal': !selected,
                        }"
                      >
                        {{ person.email }}
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 left-0 flex items-center pl-3"
                        :class="{
                          'text-white': active,
                          'text-blue-600': !active,
                        }"
                      >
                      </span>
                    </li>
                  </ComboboxOption>
                </ComboboxOptions>
              </TransitionRoot>
            </div>
          </Combobox>
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-800 text-sm font-semibold mb-2"
            for="subject"
          >
            Subject
          </label>
          <input
            class="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 leading-tight focus:outline-none focus:border-primary-200 focus:ring-2 focus:ring-blue-200 transition-all"
            id="subject"
            v-model="subject"
            type="text"
            placeholder="Enter subject"
          />
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-800 text-sm font-semibold mb-2"
            for="body"
          >
            Body
          </label>
          <textarea
            class="w-full py-3 px-4 border border-gray-300 rounded-md text-gray-700 leading-tight focus:outline-none focus:border-primary-200 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
            id="body"
            v-model="body"
            rows="8"
            placeholder="Enter email body"
          ></textarea>
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-800 text-sm font-semibold mb-2"
            for="attachment"
          >
            Attachment
          </label>
          <input
            class="w-full py-2 px-3 border border-gray-300 rounded-md text-gray-700 leading-tight focus:outline-none focus:border-primary-200 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            id="attachment"
            type="file"
            @change="handleFileChange"
          />
        </div>
        <ul
          v-if="errorList.length > 0"
          class="list-disc list-inside text-red-600 bg-red-50 p-4 rounded-md mb-6"
        >
          <li v-for="error in errorList" :key="error" class="py-1">
            {{ error }}
          </li>
        </ul>
        <div class="flex items-center justify-end gap-3">
          <button
            class="bg-secondary-100 hover:bg-secondary-200 text-white hover:text-black font-semibold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            type="button"
            @click="sentEmailUtil"
          >
            Send Email
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useEmailStore } from "../store/mail";
import { useAuth } from "../store/auth";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import DashboardMenu from "../components/DashboardMenu.vue";

const emailStore = useEmailStore();
const users = computed(() => emailStore.getUsers);
const authData = computed(() => useAuth().getAuthData);

let selected = ref(users[0]);
const subject = ref("");
const body = ref("");
const attachment = ref(null);
const errorList = ref([]);
let query = ref("");

let filteredPeople = computed(() =>
  query.value === ""
    ? users.value
    : users.value.filter((user) =>
        user.email
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""))
      )
);

const handleFileChange = (event) => {
  attachment.value = event.target.files[0];
};

const sentEmailUtil = async () => {
  errorList.value = [];
  if (!selected.value) {
    errorList.value.push("Please select a recepient");
  }
  if (!subject.value) {
    errorList.value.push("Please enter a subject");
  }
  if (!body.value) {
    errorList.value.push("Please enter a body");
  }
  if (errorList.value.length > 0) {
    return;
  }

  const emailData = {
    user: selected.value._id,
    subject: subject.value,
    content: body.value,
    from: {
      email: authData.value.email,
      name: authData.value.username,
    },
    attachment: attachment.value,
  };
  const emailFormData = new FormData();
  emailFormData.append("user", emailData.user);
  emailFormData.append("subject", emailData.subject);
  emailFormData.append("content", emailData.content);
  emailFormData.append("from", JSON.stringify(emailData.from));
  emailFormData.append("attachment", emailData.attachment);

  await emailStore.sendEmail(emailFormData);
  await emailStore.getEmailsAction();
};

onMounted(async () => {
  await emailStore.getUsersAction();
  await emailStore.getEmailsAction();
});
</script>
