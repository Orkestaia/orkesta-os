
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    DollarSign,
    CheckSquare,
    FileText,
    Settings,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "CRM", href: "/crm", icon: Users },
    { name: "Deals", href: "/deals", icon: Briefcase },
    { name: "Finance", href: "/finance", icon: DollarSign },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Proposals", href: "/proposals", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 transform bg-[#0B0E14] border-r border-gray-800 transition-transform duration-200 ease-in-out lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-16 items-center px-6 border-b border-gray-800">
                    <img src="/orkesta-logo.png" alt="Orkesta OS" className="h-8 w-auto" />
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-cyan-500/10 text-cyan-500"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-cyan-500" : "text-gray-500 group-hover:text-white"
                                    )}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-500 text-xs font-bold">
                            AO
                        </div>
                        <div className="text-sm">
                            <p className="text-white font-medium">Aitor O.</p>
                            <p className="text-gray-500 text-xs">Admin</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
