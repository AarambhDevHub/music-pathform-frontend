import { getPlaylists } from "@/action/playlists";
import { Playlists } from "@/components/playlists/playlists";

const API_BASE_URL = process.env.API_BASE_URL;

const PlaylistsPage = async () => {
  const data = await getPlaylists();

  return <Playlists API_BASE_URL={API_BASE_URL as string} playlists={data.playlists} />;
};

export default PlaylistsPage;
