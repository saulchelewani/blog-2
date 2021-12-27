<template>
  <div class='bg-gray-200 min-h-screen font-serif font-light leading-7'>
    <div class='bg-zinc-900 border-b border-zinc-700'>
      <div class='container mx-auto px-10 py-2 text-gray-400 text-center flex justify-center'>
        <NuxtLink class='mx-4' id='home' to='/'>
          [<span class=''>...</span>]
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
#home.nuxt-link-exact-active {
  @apply text-rose-500;
}

#home.nuxt-link-exact-active > span, .nuxt-link-exact-active {
  @apply text-cyan-400;
}
</style>
