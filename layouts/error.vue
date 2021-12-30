<template>
  <Banner large>
    <h1 class="text-rose-500 text-3xl md:text-6xl font-mono text-center">
      <span>[<span class="text-cyan-500">...{{ error.statusCode }}</span>]</span>
    </h1>
    <h2 class='text-cyan-400 font-mono text-center pt-8 hover:underline'><nuxt-link to='/'>Go to home page</nuxt-link></h2>
  </Banner>
</template>

<script>
import Banner from '../components/Banner'

export default {
  name: 'error',
  components: { Banner },
  props: ['error'],
  computed: {
    message() {
      return this.error.statusCode === 404
        ? 'page not found'
        : 'What they\'ll see with any other error code'
    }
  }
}
</script>

<style scoped>

</style>
