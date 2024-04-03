import Cookies from "js-cookie"
import { removeLocalStorage } from "./localStorage"
export const GetToken = () => {
    const tk = Cookies.get('tk')
    if (!tk) {
        removeLocalStorage('chatLog')
        removeLocalStorage('exp')
        return false;
    }
    return tk
}
export const SaveToken = (token: string, exp: number) => {
    return Cookies.set('tk', token, {
        expires: new Date(exp * 1000),
        path: "/",
    })
}