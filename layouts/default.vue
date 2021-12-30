<template>
  <div class="dark:bg-zinc-900 bg-gray-200 min-h-screen flex flex-col font-serif font-light leading-8 bg-[url('/dots.png')] bg-bottom bg-repeat-x">
    <div class='bg-zinc-900'>
      <nav class='container mx-auto px-10 py-2 text-gray-400 text-center flex justify-center'>
        <NuxtLink class='mx-4 pr-1 text-rose-500' id='home' to='/'>
          [<span class='text-cyan-500'>...</span>]
        </NuxtLink>
        <NuxtLink class='md:px-6 md:mx-4 px-2' to='/solutions'>
          Solutions
        </NuxtLink>
        <NuxtLink class='md:px-6 md:mx-4 px-2' to='/story'>
          <span class='hidden md:inline-block'>The &nbsp;</span>Story
        </NuxtLink>
        <NuxtLink class='md:px-6 md:mx-4 px-2' to='/about'>
          About
        </NuxtLink>
      </nav>
    </div>
    <div  class=" ">

    <Nuxt />
    </div>
    <div class='text-sm text-gray-400 text-center py-4 font-mono bg-zinc-900 mt-8'>
      <nuxt-link to='/' class='text-rose-500'>[<span class='text-cyan-500'>...</span>]</nuxt-link>
      &copy {{ new Date().getFullYear() }} All rights reserved
    </div>
  </div>
</template>

<style scoped>
#home.nuxt-link-exact-active {
  @apply text-rose-500;
}

#home.nuxt-link-exact-active > span,
nav .nuxt-link-exact-active,
nav .nuxt-link-active:not(#home) {
  @apply text-cyan-400;
}

</style>
