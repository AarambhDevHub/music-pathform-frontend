import { getfavorite } from "@/action/favoritesHandler";
import { getPlaylists } from "@/action/playlists";
import { Favorites } from "@/components/Favorites";

const API_BASE_URL = process.env.API_BASE_URL;

const FavoritesPage = async () => {
  const data = await getfavorite();
  const playList = await getPlaylists();
  return (
    <Favorites tracks={data.tracks} API_BASE_URL={API_BASE_URL as string} playlists={playList.playlists} />
  );
};

export default FavoritesPage;
