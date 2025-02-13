"use client";

import { CloudUpload, History, Home, ListMusic, Music4, Star, UserRoundPen } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LogoutButton } from './auth/LogoutButton';

const sidebarContent = [
  {
    label: "Home",
    link: '/home',
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Playlists",
    link: '/playlists',
    icon: <ListMusic className="h-4 w-4" />,
  },
  {
    label: "Upload Music",
    link: '/upload',
    icon: <CloudUpload className="h-4 w-4" />,
  },
  {
    label: "History",
    link: '/history',
    icon: <History className="h-4 w-4" />,
  },
  {
    label: "Favorites",
    link: '/favorites',
    icon: <Star className="h-4 w-4" />,
  },
  {
    label: "Profile management",
    link: '/profile',
    icon: <UserRoundPen className="h-4 w-4" />,
  },
] 

export const SideBar = () => {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Music4 className="h-6 w-6" />
            <span className="">Aarambh Tunes</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarContent.map(content => (
              <Link
                href={content.link}
                key={content.link}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.includes(content.link) && 'bg-muted text-primary '
                )}
              >
                {content.icon}
                {content.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  )
}