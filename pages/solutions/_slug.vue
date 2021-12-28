<template>
  <div>
    <div class='h-[10rem] md:h-[20rem] bg-zinc-900'>
      <div class='container mx-auto h-full'>
        <div class='flex flex-col justify-center items-center h-full'>
          <h1 class='text-rose-500 text-3xl md:text-6xl font-mono'>[<span class='text-cyan-400'>...solutions</span>]
          </h1>
        </div>
      </div>
    </div>
    <article class='bg-white max-w-4xl mx-auto px-10 py-6 mt-8 rounded-lg' v-if='article'>
      <h1 class='text-xl pt-4 text-amber-600'>{{ article.title }}</h1>
      <nuxt-content :document='article' class='text-gray-500' />
    </article>
  </div>

</template>

<script>

export default {
  async asyncData({ $content, params }) {
    const article = await $content('solutions', params.slug).fetch()

    return {
      article
    }
  },
  data() {
    return {
      article: null
    }
  }
}
</script>

<style>
.nuxt-content-container p {
  @apply my-2;
}

.nuxt-content-container a {
  @apply text-cyan-600 hover:underline;
}

.nuxt-content-container code {
  @apply text-rose-500 text-sm;
}

.nuxt-content-container ol {
  @apply list-decimal list-inside py-2 ml-2;
}

.nuxt-content-container h2, .nuxt-content-container h3 {
  @apply text-amber-600 ;
}

.nuxt-content-container h2 {
  @apply text-lg mt-2 mb-1;
}

.nuxt-content-container h3 {
  @apply mt-1;
}


</style>
