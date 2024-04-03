import { useLocation } from "react-router-dom";
import Auth from "../../pages/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const location = useLocation()
    return location.pathname !== "/auth" ?
        <section className="w-full !h-screen flex flex-wrap content-start justify-center">
            <main className="w-full h-[99vh]" >
                <div className="content w-full h-full">{children}</div>
            </main>
        </section>
        : <Auth />


}

export default Layout;