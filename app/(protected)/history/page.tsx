import { getPlaybackHistory } from "@/action/getHandler";
import { Hisotry } from "@/components/Historys";

const API_BASE_URL = process.env.API_BASE_URL;

const HistoryPage = async () => {
  const data = await getPlaybackHistory();

  return <Hisotry API_BASE_URL={API_BASE_URL as string} tracks={data.tracks} />;
};

export default HistoryPage;
