export function alpha(value) {
    const alphaRegex = /^[a-zA-ZÀ-ú\s]*$/;
    return alphaRegex.test(value);
}

export function maxIncome(value) {
    if (!value) return true;
    const formattedValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
    return formattedValue <= 1000000;
}

export function strongPassword(value) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
    return passwordRegex.test(value);
}