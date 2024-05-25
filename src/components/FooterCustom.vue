<template>
    <v-footer class="d-flex justify-center align-center"> 
        <p>© {{ currentYear }} Teste | Todos os direitos reservados</p>
    </v-footer>
</template>    
<script>
    export default {
        name: 'FooterCustom',
        data() {
            return {
                currentYear: new Date().getFullYear()
            };
        }
    };
</script>
<style scoped>
    .v-footer {
        background-color: var(--black);
        color: var(--white);
        font-size: 0.8rem;
        max-height: 15%;
    }
</style>