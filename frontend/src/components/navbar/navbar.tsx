import { useAuth } from "@/context/AuthContext";
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { ClipboardList, House, LogOut, User, UserPen } from "lucide-react";
import { Button } from "../ui/button";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import Logo from "../logo";

type UserRole = "user" | "admin";
type positions = "left" | "right";

type NavbarMenu = {
    label: string;
    path: string;
    permission: UserRole[];   // <-- array of roles
    icon: React.ReactNode;
    position: positions
};


const navbarMenu: NavbarMenu[] = [
    {
        label: "Dashboard",
        path: '/',
        permission: ['user', 'admin'],
        icon: <House size={16} />,
        position: 'left'
    },
    {
        label: "Users",
        path: '/users',
        permission: ['admin'],
        icon: <User size={16} />,
        position: 'left'
    },
    {
        label: "Ticket",
        path: '/tickets',
        permission: ['user', 'admin'],
        icon: <ClipboardList size={16} />,
        position: 'left'
    },
    {
        label: "Profile",
        path: '/profile',
        permission: ['user', 'admin'],
        icon: <UserPen size={16} />,
        position: 'left'
    },
    {
        label: "Logout",
        path: '/',
        permission: ['user', 'admin'],
        icon: <LogOut size={16} />,
        position: 'right'
    },
]

export default function Navbar() {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();

    const filterMenuBasedOnRole = navbarMenu?.filter((item) => item.permission?.includes(user?.role as any));

    const leftMenu = filterMenuBasedOnRole.filter(m => m.position === "left");
    const rightMenu = filterMenuBasedOnRole.filter(m => m.position === "right");


    return (
        <NavigationMenu className="bg-secondary w-full h-16 px-6 max-w-full">
            <NavigationMenuList className="grid grid-cols-12 items-center w-full">
                <Logo />
                {/* Left */}
                <div className="flex gap-6 w-full justify-center col-span-8">
                    {leftMenu.map((menu) => {
                        const active =
                            menu.path === "/"
                                ? pathname === "/"
                                : pathname.startsWith(menu.path);

                        return (
                            <NavigationMenuItem
                                key={menu.path}
                                className={clsx(
                                    "px-4 flex justify-center items-center",
                                    active ? "font-bold" : "font-normal"
                                )}
                            >
                                {menu.icon}
                                <NavigationMenuLink
                                    href={menu.path}
                                    className="flex items-center gap-2"
                                >
                                    {menu.label}
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        );
                    })}

                </div>

                {/* Push right side to end */}
                <div className="flex gap-6 col-span-2 justify-self-end px-4 items-center">
                    {rightMenu.map((menu) => (
                        <NavigationMenuItem key={menu.path} className="flex justify-center items-center">
                            <Button className="cursor-pointer" onClick={logout}>
                                {menu.label}
                                {menu.icon}
                            </Button>
                        </NavigationMenuItem>
                    ))}
                </div>

            </NavigationMenuList >
        </NavigationMenu >

    );
}
