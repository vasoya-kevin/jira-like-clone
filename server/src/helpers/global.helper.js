export const isProduction = (value) => {
    console.log('value: ', value);
    return value?.toUpperCase() === "PRODUCTION"
}