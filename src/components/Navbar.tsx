"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, LayoutDashboard, ChevronDown, Gavel, Store, Plus, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [notifCount, setNotifCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/notifications").then((data: any[]) => {
        const unread = data.filter((n: any) => !n.read).length;
        setNotifCount(unread);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const dashboardLink = user?.role === "admin" ? "/dashboard/admin"
    : user?.role === "seller" || user?.role === "dealer" ? "/dashboard/seller"
    : "/dashboard/buyer";

  const handleLogout = () => { logout(); router.push("/"); };

  const navLinks = [
    { label: "Marketplace", href: "/marketplace", icon: Store },
    { label: "Auctions", href: "/auctions", icon: Gavel },
  ];

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-gray-200/60" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group" data-testid="logo-link">
              <div className="w-8 h-8 bg-[#1B4D3E] rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{fontFamily:"Manrope"}}>FE</span>
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:block" style={{fontFamily:"Manrope"}}>
                Field<span className="text-[#1B4D3E]">Exchange</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} data-testid={`nav-${l.label.toLowerCase()}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#1B4D3E] hover:bg-gray-50 transition-colors">
                  <l.icon size={16} strokeWidth={1.5} />
                  {l.label}
                </Link>
              ))}
              <Link href="/how-it-works" data-testid="nav-how-it-works"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-[#1B4D3E] hover:bg-gray-50 transition-colors">
                How It Works
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <Link href={dashboardLink} className="relative" data-testid="nav-notifications">
                  <Bell size={20} className="text-gray-500 hover:text-[#1B4D3E] transition-colors" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {notifCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors" data-testid="user-menu-trigger">
                    <div className="w-8 h-8 bg-[#1B4D3E] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">{user?.name?.charAt(0)}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name?.split(" ")[0]}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(dashboardLink)} data-testid="menu-dashboard">
                    <LayoutDashboard size={14} className="mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(dashboardLink)} data-testid="menu-profile">
                    <User size={14} className="mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout">
                    <LogOut size={14} className="mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" data-testid="nav-login">
                  <Button variant="ghost" size="sm" className="text-gray-600 font-medium">Sign In</Button>
                </Link>
                <Link href="/register" data-testid="nav-register">
                  <Button size="sm" className="bg-[#1B4D3E] hover:bg-[#143d30] text-white font-semibold">Get Started</Button>
                </Link>
              </div>
            )}

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2" data-testid="mobile-menu-trigger">
                  <Menu size={22} className="text-gray-600" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-1 mt-8">
                  {navLinks.map(l => (
                    <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                      <l.icon size={18} /> {l.label}
                    </Link>
                  ))}
                  <Link href="/how-it-works" onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                    How It Works
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
