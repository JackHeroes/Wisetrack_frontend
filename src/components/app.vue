<template>
    <v-app-bar permanent>
        <v-app-bar-title>Teste</v-app-bar-title>
        <v-btn text to="/home">Home</v-btn>
        <v-btn text>{{ user }}</v-btn>
        <v-btn prepend-icon="mdi-logout" text @click="logout"></v-btn>
    </v-app-bar>
</template>
<script>
   
</script>
<style scoped>
    .v-app-bar.v-toolbar {
        background: var(--black);
        color: var(--white);
    }
</style>