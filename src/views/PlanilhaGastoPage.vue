<template>
    <v-app>
        <SystemMenu/>
        <SystemSidebar/>
        <v-main class="d-flex justify-center align-center"></v-main>
        <SystemFooter/>
        <SystemMessage
            v-if="message"
            :key="messageKey"
            :message="message"
            :type="messageType">
        </SystemMessage>
    </v-app>
</template>
<script>
    import { mapGetters } from 'vuex';
  
    export default {
        data() {
            return {
                messageKey: 0,
            };
        },
        computed: {
            ...mapGetters(['message', 'messageType'])
        },
    }
</script>
<style scoped>
</style>