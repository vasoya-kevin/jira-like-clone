import { Navbar } from "@/components";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="flex flex-col">
                <main className="flex-1 font-sans">
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default Layout;
