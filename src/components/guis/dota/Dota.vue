<template>
<div>
  <div class="row">
    <AccountIdInput @changeAccountId="setAccountId"/>
  </div>
  <div class="row">
    <Dashboard v-if="accountId !== null" :account-id="Number(accountId)"/>
  </div>
</div>
</template>

<script>
import AccountIdInput from "@/components/guis/dota/AccountIdInput";
import Dashboard from "@/components/guis/dota/Dashboard";

export default {
  name: "Dota",
  components: {Dashboard, AccountIdInput},
  data() {
    return {
      accountId: null,
      accountIdKey: "account_id"
    }
  },
  mounted() {
    this.accountId = localStorage.getItem(this.accountIdKey)
  },
  methods: {
    setAccountId(accountId) {
      this.accountId = accountId;
      localStorage.setItem(this.accountIdKey, accountId)
    }
  }
}
</script>

<style scoped>

</style>