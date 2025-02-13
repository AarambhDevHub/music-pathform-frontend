import { getTacksUploads } from "@/action/getHandler"
import { getPlaylists } from "@/action/playlists";
import { Home } from "@/components/Home";

const API_BASE_URL = process.env.API_BASE_URL;

const HomePage = async () => {
  const data = await getTacksUploads();
  const playList = await getPlaylists();
  return (
        <Home tracks={data.tracks} API_BASE_URL={API_BASE_URL as string} playlists={playList.playlists} />
  )
}

export default HomePage