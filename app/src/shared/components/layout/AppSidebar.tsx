"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/shared/store/hooks";
import { PencilLine, NotebookText, SquareUser, LayoutDashboard, Settings } from "lucide-react";
import {
  ChevronDownIcon,
  HorizontaLDots,
} from "@/shared/icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const mainNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard size={20} />,
    name: "Insights",
    path: "/insights",
  },
  {
    icon: <PencilLine size={20} />,
    name: "Chat",
    path: "/chat",
  },
  {
    icon: <NotebookText size={20} />,
    name: "Journal",
    path: "/journal",
  },
  {
    icon: <SquareUser size={20} />,
    name: "Frameworks",
    path: "/frameworks",
  },
  {
    icon: <Settings size={20} />,
    name: "Settings",
    path: "/settings",
  },
];

const AppSidebar: React.FC = React.memo(() => {
  const isMobileOpen = useAppSelector((state) => state.ui.sidebarMobileOpen);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    // For Chat, always navigate to /chat (welcome screen)
    // This ensures a fresh start without creating a session until user sends a message
    if (path === "/chat") {
      e.preventDefault();
      router.push('/chat');
    }
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "others"
  ) => (
    <ul className="flex flex-col gap-3 items-center">
      {navItems.map((nav, index) => (
        <li key={nav.name} className="w-full flex justify-center">
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              title={nav.name}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-[var(--app-accent-color-transparent)] shadow-sm"
                  : "hover:bg-[var(--app-light-color-transparent)] hover:shadow-sm"
              } cursor-pointer lg:justify-center`}
            >
              <span
                className={`transition-colors duration-200 ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-[var(--app-accent-color)]"
                    : "text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)]"
                }`}
              >
                {nav.icon}
              </span>
              {isMobileOpen && (
                <span className={`text-sm font-medium`}>{nav.name}</span>
              )}
              {isMobileOpen && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-[var(--app-accent-color)]"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                title={nav.name}
                onClick={(e) => handleNavClick(e, nav.path!)}
                className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-200 ${
                  isActive(nav.path)
                    ? "bg-[var(--app-light-color-transparent)] shadow-sm"
                    : "hover:bg-[var(--app-light-color-transparent)] hover:shadow-sm"
                }`}
              >
              <span
                className={`transition-colors duration-200 ${
                  isActive(nav.path)
                    ? "text-[var(--app-accent-secondary-color)]"
                    : "text-[var(--app-text-secondary-color)] hover:text-[var(--app-text-primary-color)]"
                }`}
              >
                {nav.icon}
              </span>
              {isMobileOpen && (
                <span className={`text-sm font-medium`}>{nav.name}</span>
              )}
              </Link>
            )
          )}
          {nav.subItems && isMobileOpen && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        isActive(subItem.path)
                          ? "bg-[var(--app-accent-color-transparent)] text-[var(--app-accent-color)] shadow-sm"
                          : "text-[var(--app-text-secondary-color)] hover:bg-[var(--app-light-color-transparent)] hover:text-[var(--app-text-primary-color)] hover:shadow-sm"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              isActive(subItem.path)
                                ? "bg-[var(--app-accent-color)] text-white"
                                : "bg-[var(--app-bg-secondary-color)] text-[var(--app-text-secondary-color)]"
                            }`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`px-2 py-0.5 text-xs rounded ${
                              isActive(subItem.path)
                                ? "bg-[var(--app-accent-color)] text-white"
                                : "bg-[var(--app-bg-secondary-color)] text-[var(--app-text-secondary-color)]"
                            }`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => {
    // For /chat, also match /chat/[id] routes
    if (path === '/chat') {
      return pathname === '/chat' || pathname.startsWith('/chat/');
    }
    return path === pathname;
  }, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main"].forEach((menuType) => {
      const items = menuType === "main" ? mainNavItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed flex-col top-0 left-0 text-white h-screen transition-all duration-300 ease-in-out z-50 py-3 overflow-visible flex justify-between w-[60px]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
    >
      {/* Main Sidebar Content */}
      <div className="flex flex-col min-h-0">
        {/* Logo Placeholder */}
        <div className="flex-shrink-0 mb-3 flex justify-center">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src="/images/logo/logo1.png"
              alt="The Room Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto duration-300 ease-linear">
          <div className="flex flex-col gap-3">
            <div>
              <h2 className="mb-3 text-xs uppercase flex leading-[20px] text-[var(--app-text-tertiary-color)] lg:justify-center justify-start">
                {isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(mainNavItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
});

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
