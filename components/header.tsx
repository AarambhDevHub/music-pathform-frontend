"use client";

import {
  CloudUpload,
  History,
  Home,
  ListMusic,
  Menu,
  Music2,
  Star,
  UserRoundPen,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./modeToggle";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { LogoutButton } from "./auth/LogoutButton";

const sidebarContent = [
  {
    label: "Home",
    link: "/home",
    icon: <Home className="h-5 w-5" />,
  },
  {
    label: "Playlists",
    link: "/playlists",
    icon: <ListMusic className="h-5 w-5" />,
  },
  {
    label: "Upload Music",
    link: "/upload",
    icon: <CloudUpload className="h-5 w-5" />,
  },
  {
    label: "History",
    link: "/history",
    icon: <History className="h-5 w-5" />,
  },
  {
    label: "Favorites",
    link: "/favorites",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Profile",
    link: "/profile",
    icon: <UserRoundPen className="h-5 w-5" />,
  },
];

export const Header = () => {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Music2 className="h-6 w-6" />
              <span className="">Aarambh Tunes</span>
            </Link>
            <Separator />
            {sidebarContent.map((content) => (
              <Link
                href={content.link}
                key={content.link}
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  pathname.includes(content.link) && "bg-muted text-foreground "
                )}
              >
                {content.icon}
                {content.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <LogoutButton />
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
      </div>
      <ModeToggle />
    </header>
  );
};
