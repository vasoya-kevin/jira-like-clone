import { Navbar } from "@/components";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Navbar />
            <main className="min-h-[calc(100vh-64px)] h-full font-sans">
                {/* later: Navbar, Sidebar */}
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
