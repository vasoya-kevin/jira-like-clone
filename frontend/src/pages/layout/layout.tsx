import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <main className="min-h-screen font-sans">
            {/* later: Navbar, Sidebar */}
            <Outlet />
        </main>
    );
};

export default Layout;
