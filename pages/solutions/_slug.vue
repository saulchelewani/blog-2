<template>
  <div>
    <div class="h-[10rem] md:h-[20rem] bg-zinc-900">
      <div class="container mx-auto h-full">
        <div class="flex flex-col justify-center items-center h-full">
          <h1 class="text-rose-500 text-3xl md:text-6xl font-mono">[<span class="text-cyan-400">...solutions</span>]</h1>
        </div>
      </div>
    </div>
    <article class='bg-white max-w-4xl mx-auto px-10 py-6 mt-8 rounded-lg'>
      <h1 class='text-xl py-4 text-amber-600'>{{ article.title }}</h1>
      <nuxt-content :document="article" class='text-gray-500' />
    </article>
  </div>

</template>

<script>
export default {
  name: "_slug",
  async asyncData ({ $content, params }) {
    const article = await $content('solutions', params.slug).fetch()

    return {
      article
    }
  }
}
</script>

<style lang='scss'>
.nuxt-content-container p {
  @apply mb-6;
}

</style>
