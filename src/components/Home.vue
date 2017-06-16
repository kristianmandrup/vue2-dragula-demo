<template>
  <section id="home">
    <h1>Vue2 Dragula plugin</h1>
    <section class="text">
      This demo app aims to demonstrate use of the
      <a href="https://github.com/kristianmandrup/vue2-dragula">vue2-dragula</a> plugin.
      <p>
        Currently we show off using the global app service and named services.
      </p>
      <p>
        Please report any at
        <a href="https://github.com/kristianmandrup/vue2-dragula/issues">issues/bugs</a>
      </p>
      <p>
        Also feel free to improve this demo app. We would love a better UI/UX experience such as showcasing how to dynamically add/remove element styling when doing drag'n drop (ie. in response to drag events) which makes the user experience more slick.
      </p>
    </section>
  </section>
</template>
<script>
export default {
  created() {
    console.log('Home created')
  },
  mounted() {
    console.log('Home mounted')
  }
}
</script>
