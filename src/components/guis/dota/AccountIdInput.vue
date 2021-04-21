<template>
  <div>
    <form class="form-inline">
      <div class="form-group mr-2">
        <label for="accountIdInput" class="sr-only">Account id</label>
        <input id="accountIdInput" v-model="accountId" type="text" class="form-control" placeholder="Account ID">
      </div>
      <button type="button" class="btn btn-primary" @click="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "AccountIdInput",
  data() {
    return {
      accountId: "",
      accountIdKey: "account_id"
    }
  },
  mounted() {
    this.accountId = localStorage.getItem(this.accountIdKey);
  },
  methods: {
    submit() {
      this.$emit('changeAccountId', this.accountId)
    }
  }
}
</script>

<style scoped>

</style>