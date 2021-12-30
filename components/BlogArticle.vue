<template>
  <div>
    <TitleBanner>
      <h1 class='text-cyan-500 text-2xl md:text-4xl'>{{ article.title }}</h1>
      <p class='text-xs text-cyan-500 py-1 font-sans'>{{ $moment(article.createdAt).format('MMMM Do, YYYY') }}</p>
    </TitleBanner>
    <article class="bg-gradient-to-b from-white dark:from-zinc-800 bg-white dark:bg-zinc-800 bg-opacity-70 max-w-4xl mx-auto px-10 py-6 lg:-mt-20 lg:rounded-lg" v-if='article'>
      <div class='flex gap-x-4 pb-4 rounded-r border-b dark:border-zinc-600 font-sans text-cyan-800 dark:text-cyan-400 text-sm font-normal italic'>
        <p class='text-rose-500 not-italic'>[<span class='text-cyan-600'>...</span>]</p>
        {{ article.description }}
      </div>
      <nuxt-content :document='article' class='text-gray-500 dark:text-gray-300' />
      <AuthorCard />
    </article>
  </div>
</template>

<script>
import TitleBanner from './TitleBanner'
import AuthorCard from './AuthorCard'
export default {
  name: 'BlogArticle',
  components: { AuthorCard, TitleBanner },
  props: {
    article: Object
  }
}
</script>

<style>
.nuxt-content-container p, .nuxt-content p {
  @apply my-2;
}

.nuxt-content-container a, .nuxt-content a {
  @apply text-cyan-600 dark:text-cyan-400 hover:underline;
}

.nuxt-content-container code, .nuxt-content code {
  @apply text-rose-500 dark:text-rose-400 text-sm;
}

.nuxt-content-container ol, .nuxt-content ol {
  @apply list-decimal list-inside py-2 ml-2;
}

.nuxt-content-container h2, .nuxt-content-container h3, .nuxt-content h2, .nuxt-content h3 {
  @apply text-cyan-600 dark:text-cyan-400 ;
}

.nuxt-content-container h2, .nuxt-content h2 {
  @apply text-lg mt-8 font-bold mb-1;
}

.nuxt-content-container h3, .nuxt-content h3 {
  @apply mt-1;
}

.nuxt-content-highlight {
  @apply relative
}

.nuxt-content-highlight > .filename {
  @apply hidden md:block  absolute right-0 text-gray-500 font-light z-10 mr-2 mt-1 text-xs font-mono;
}

.nuxt-content-highlight > .line-numbers {
  @apply md:pt-4 rounded
}

</style>

