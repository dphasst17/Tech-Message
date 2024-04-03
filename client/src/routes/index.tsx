import { FC } from "react";
import Home from "../pages/home";
import Auth from "../pages/auth";


//PublicRoutes
const publicRoutes:{path:string,component:FC}[] = [
    { path: "/auth", component: Auth },
];

const privateRoutes:{path:string,component:FC}[] = [
    { path: "/", component: Home },

];
export { publicRoutes, privateRoutes};