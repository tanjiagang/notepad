<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <img class="mx-auto h-12" src="/images/logo.svg" alt="Logo">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">{{ t('login.title') }}</h2>
        <p class="mt-2 text-sm text-gray-600">{{ t('login.subtitle') }}</p>
      </div>

      <!-- Login Form -->
      <form class="mt-8 space-y-6">
        <!-- Login Method Tabs -->
        <div class="flex border-b border-gray-200">
          <button
            type="button"
            class="flex-1 py-3 px-4 text-center font-medium"
            :class="{
              'border-b-2 border-green-500 text-green-600': loginMethod === 'password',
              'text-gray-500 hover:text-gray-700': loginMethod !== 'password'
            }"
            @click="loginMethod = 'password'"
          >
            {{ t('login.usernamePassword') }}
          </button>
          <button
            type="button"
            class="flex-1 py-3 px-4 text-center font-medium"
            :class="{
              'border-b-2 border-green-500 text-green-600': loginMethod === 'phone',
              'text-gray-500 hover:text-gray-700': loginMethod !== 'phone'
            }"
            @click="loginMethod = 'phone'"
          >
            {{ t('login.phone') }}
          </button>
        </div>

        <!-- Username Password Login -->
        <div v-if="loginMethod === 'password'" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">{{ t('login.username') }}</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="{{ t('login.usernamePlaceholder') }}"
              v-model="username"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">{{ t('login.password') }}</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="{{ t('login.passwordPlaceholder') }}"
              v-model="password"
            >
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                v-model="rememberMe"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">{{ t('login.rememberMe') }}</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-green-600 hover:text-green-500">{{ t('login.forgotPassword') }}</a>
            </div>
          </div>
        </div>

        <!-- Phone Login (Temporarily Disabled) -->
        <div v-else-if="loginMethod === 'phone'" class="space-y-4">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">{{ t('login.phone') }}</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="{{ t('login.phonePlaceholder') }}"
              v-model="phone"
              disabled
            >
          </div>

          <div class="flex space-x-2">
            <input
              id="verification-code"
              name="verification-code"
              type="text"
              class="appearance-none relative block flex-1 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              placeholder="{{ t('login.verificationCode') }}"
              disabled
            >
            <button
              type="button"
              class="whitespace-nowrap px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled
            >
              {{ t('login.getCode') }}
            </button>
          </div>

          <div class="text-sm text-gray-500">
            {{ t('login.phoneLoginNote') }}
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="button"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleLogin"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg v-if="!loading" class="h-5 w-5 text-green-500 group-hover:text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="animate-spin h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            <span v-if="!loading">{{ t('login.loginButton') }}</span>
            <span v-else>{{ t('login.loggingIn') || '登录中...' }}</span>
          </button>
        </div>

        <!-- Register Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            {{ t('login.dontHaveAccount') }}
            <a href="#" class="font-medium text-green-600 hover:text-green-500">{{ t('login.register') }}</a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

// Login method (password or phone)
const loginMethod = ref('password')
const loading = ref(false)

// Form data
const username = ref('')
const password = ref('')
const phone = ref('')
const rememberMe = ref(false)

// Handle login
const handleLogin = async () => {
  // Validate form
  if (loginMethod.value === 'password') {
    if (!username.value || !password.value) {
      ElMessage.warning(t('login.validationError'))
      return
    }

    loading.value = true
    try {
      await authStore.loginUser(username.value, password.value)
      ElMessage.success(t('login.success') || '登录成功')
      router.push('/')
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || error.message || t('login.failed'))
    } finally {
      loading.value = false
    }
  } else {
    // Phone login is temporarily disabled
    ElMessage.warning(t('login.phoneLoginDisabled'))
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>