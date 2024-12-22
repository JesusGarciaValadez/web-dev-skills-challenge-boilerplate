<template>
    <div v-if="isLoading" class="absolute top-0 right-0 mt-2 mr-2 flex items-center">
        <svg
            class="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l2 2-2 2V4a8 8 0 01-8 8z"
            ></path>
        </svg>
        <span class="ml-1 text-xs text-gray-500" dusk="loading-text">Loading...</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{ isLoading: boolean }>()
</script>
