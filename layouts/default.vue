<template>
  <div class='bg-gray-200 min-h-screen font-serif font-light leading-7'>
    <div class='bg-zinc-900 border-b border-zinc-700'>
      <div class='container mx-auto px-10 py-2 text-gray-400 text-center flex justify-center'>
        <NuxtLink class='' to='/'>
          <svg class='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                  d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'></path>
          </svg>
        </NuxtLink>
        <NuxtLink class='md:px-6 md:mx-4 px-2' to='/solutions'>
          Solutions
        </NuxtLink>
        <NuxtLink class='md:px-6 md:mx-4 px-2' to='/story'>
          The Story
        </NuxtLink>
        <NuxtLink class='md:px-6 md:mx-4 px-2' to='/about'>
          About
        </NuxtLink>
      </div>
    </div>
    <Nuxt />
    <div class='text-sm text-gray-400 text-center py-4 font-mono'>
      All rights reserved &copy; {{ new Date().getFullYear() }}
    </div>
  </div>
</template>

<style scoped>
.nuxt-link-exact-active {
  @apply text-cyan-400;
}
</style>
