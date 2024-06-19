<template>
    <v-footer class="d-flex justify-center align-center" 
    app 
    permanent 
    height="64px"
    order="-1"> 
        <p>© {{ currentYear }} WiseTrack | Todos os direitos reservados</p>
    </v-footer>
</template>    
<script>
    export default {
        name: 'SystemFooter',
        data() {
            return {
                currentYear: new Date().getFullYear()
            };
        }
    };
</script>
<style scoped>
    .v-footer {
        background-color: var(--black)!important;
        color: var(--white)!important;
        font-size: 0.8rem!important;
    }
</style>