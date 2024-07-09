export const currencyFormatter = (params) => {
    return params.value ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(params.value) : '';
};