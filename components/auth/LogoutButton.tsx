"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Logout } from "@/action/authHandler";
import { useState } from "react";

export const LogoutButton = () => {
    const [isLoading, setLoading] = useState(false);
    const onClick = () => {
        setLoading(true);
        Logout();
    }

    return (
        <Button onClick={onClick} isLoading={isLoading} className="w-full flex justify-between" variant="outline">
            Logout
            <LogOut className="h-4 w-4" />
        </Button>
    )
}