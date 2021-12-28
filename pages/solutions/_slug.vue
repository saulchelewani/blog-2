<template>
  <div>
    <div class='h-[10rem] md:h-[20rem] bg-zinc-900 bg-gradient-to-r from-zinc-800 to-cyan-800'>
      <div class='container mx-auto h-full'>
        <div class='max-w-4xl mx-auto flex flex-col justify-center h-full px-10'>
          <h1 class='text-cyan-500 text-2xl md:text-4xl'>
            {{ article.title }}
          </h1>
          <p class='text-xs text-cyan-500 py-1 font-sans'>Created {{ $moment(article.createdAt).fromNow() }}</p>

        </div>
      </div>
    </div>
    <article class='bg-white max-w-4xl mx-auto px-10 py-6 lg:-mt-20 lg:rounded-lg' v-if='article'>
      <nuxt-content :document='article' class='text-gray-500' />
    </article>
  </div>

</template>

<script>

export default {
  async asyncData({ $content, params }) {
    const article = await $content('/', params.slug).fetch()

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
.nuxt-content-container p, .nuxt-content p {
  @apply my-2;
}

.nuxt-content-container a, .nuxt-content a {
  @apply text-cyan-600 hover:underline;
}

.nuxt-content-container code, .nuxt-content code {
  @apply text-rose-500 text-sm;
}

.nuxt-content-container ol, .nuxt-content ol {
  @apply list-decimal list-inside py-2 ml-2;
}

.nuxt-content-container h2, .nuxt-content-container h3, .nuxt-content h2, .nuxt-content h3 {
  @apply text-cyan-600 ;
}

.nuxt-content-container h2, .nuxt-content h2 {
  @apply text-lg mt-2 mb-1;
}

.nuxt-content-container h3, .nuxt-content h3 {
  @apply mt-1;
}
</style>
