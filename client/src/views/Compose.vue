<template>
  <main class="shadow sm:rounded-lg" id="about">
    <div class="px-4 py-5">
      <h2 class="text-3xl my-2 py-2 text-center text-jet-black">COMPOSE</h2>
      <div class="flex flex-col items-center bg-gray-100 p-4 rounded-md">
        <p>Welcome to the email compose page</p>
      </div>
      <DashboardMenu />
      <form class="w-full max-w-lg mt-6" @submit.prevent="sentEmailUtil">
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="recepients">
            Select Recepients
          </label>
          <Combobox v-model="selected">
            <div class="relative mt-1">
              <div
                class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm"
              >
                <ComboboxInput
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  :displayValue="(person) => person.email"
                  @change="query = $event.target.value"
                />
                <ComboboxButton
                  class="inset-y-0 right-0 flex items-center pr-2"
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
                  class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
                >
                  <div
                    v-if="filteredPeople.length === 0 && query !== ''"
                    class="relative cursor-default select-none px-4 py-2 text-gray-700"
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
                      class="relative cursor-default select-none py-2 pl-10 pr-4"
                      :class="{
                        'bg-secondary-100 text-white': active,
                        'text-gray-900': !active,
                      }"
                    >
                      <span
                        class="block truncate"
                        :class="{
                          'font-medium': selected,
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
                          'text-teal-600': !active,
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
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="subject">
            Subject
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subject"
            v-model="subject"
            type="text"
            placeholder="Enter subject"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="body">
            Body
          </label>
          <textarea
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="body"
            v-model="body"
            rows="5"
            placeholder="Enter email body"
          ></textarea>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2" for="attachment">
            Attachment
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="attachment"
            type="file"
            @change="handleFileChange"
          />
        </div>
        <ul
          v-if="errorList.length > 0"
          class="list-disc list-inside text-danger my-3"
        >
          <li v-for="error in errorList" :key="error">{{ error }}</li>
        </ul>
        <div class="flex items-center justify-between">
          <button
            class="text-black bg-primary-200 hover:bg-secondary-100 hover:text-white transition-all duration-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            @click="sentEmailUtil"
          >
            Send
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
