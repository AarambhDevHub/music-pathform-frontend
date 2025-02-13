import { getMe } from "@/action/profileHandler";
import { Profile } from "@/components/profile/Profile";

const ProfilePage = async () => {
    const userData = await getMe();
    return (
        <div className="p-5">
            <Profile userData={userData.data.user} />
        </div>
    )
}

export default ProfilePage;