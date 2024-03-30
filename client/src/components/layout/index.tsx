import { useLocation } from "react-router-dom";
import Header from "./header";
import Auth from "../../pages/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()
    return location.pathname !== "/auth" ?
        <section className="w-full !h-screen flex flex-wrap content-between justify-center">
            <Header />
            <main className="w-full h-[92vh]" >
                <div className="content w-full h-full">{children}</div>
            </main>
        </section>
        : <Auth />


}

export default Layout;