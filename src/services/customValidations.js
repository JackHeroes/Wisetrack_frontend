export function alpha(value) {
    const alphaRegex = /^[a-zA-ZÀ-ú\s]*$/;
    return alphaRegex.test(value);
}

export function strongPassword(value) {
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;
    return passwordRegex.test(value);
}