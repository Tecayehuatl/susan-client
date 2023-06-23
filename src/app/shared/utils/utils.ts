// This will return the grandTotal, with or without discount
export function getGrandTotal(price: number, porcentage: number): number {
    if (porcentage) {
        const discount = price * (+porcentage / 100);
        return price - +discount.toFixed(2);
    } else {
        return price;
    }
}
