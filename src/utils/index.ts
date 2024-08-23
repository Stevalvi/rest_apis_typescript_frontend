
// Formateamos el precio
export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount)
}

export function toBoolean(str: string) {
    return str.toLowerCase() === "true" // Si es igual retorna un true y si es diferente retorna un false. De esa forma convertimos correctamente esa disponibilidad de string a boolean.
}