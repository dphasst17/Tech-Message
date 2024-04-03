export const setLocalStorage = (key:string,value:any) => {
    return localStorage.setItem(key,JSON.stringify(value))
}
export const getLocalStorage = (key:string,value:any) => {
    return JSON.parse(localStorage.getItem(key) || value)
}
export const removeLocalStorage = (key:string) => {
    return localStorage.removeItem(key)
}