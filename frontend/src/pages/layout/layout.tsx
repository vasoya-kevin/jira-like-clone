import { Navbar } from "@/components";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="min-h-screen font-sans">
            {/* later: Navbar, Sidebar */}
            <Navbar />
            <Outlet />
        </main>
    );
};

export default Layout;
