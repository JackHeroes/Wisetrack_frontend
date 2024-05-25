<template>
    <v-footer class="d-flex justify-center align-center" app permanent order="-1"> 
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
        min-height: 64px;
    }
</style>