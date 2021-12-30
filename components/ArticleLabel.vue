<template>
  <span
    :class='color'
    class='uppercase text-xs bg-cyan-100 text-cyan-600 p-1 rounded font-sans font-semibold'
  >
    {{ type }}
  </span>
</template>

<script>
export default {
  name: 'ArticleLabel',
  props: {
    type: {
      validator: function(value) {
        return ['solution', 'about', 'story'].indexOf(value) !== -1
      }
    }
  },
  computed: {
    color() {
      let match = {
        'solution': 'bg-amber-100 text-amber-700',
        'story': 'bg-indigo-100 text-indigo-600',
        'about': 'bg-cyan-100 text-cyan-600'
      }
      return match[this.type]
    }
  }
}
</script>

<style scoped>

</style>
