"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { PasswordChange } from "./PasswordChange";
import { Userprofile } from "./UserProfile";

export interface UserDataProps {
    id: string;
    username: string;
    email: string;
}

export const Profile = ({ userData }: { userData: UserDataProps }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
                <Userprofile userData={userData} />
                <Separator />
                <PasswordChange />
            </CardContent>
        </Card>
    )
}