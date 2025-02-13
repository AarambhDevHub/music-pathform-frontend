import { getIncompleteUploads } from "@/action/getHandler";
import { ResumeUploadFile } from "@/components/upload/ResumeUpload";
import { UploadForm } from "@/components/upload/uploadForm";

const API_BASE_URL = process.env.API_BASE_URL;

const UploadPage = async () => {
  const data = await getIncompleteUploads();

  return (
    <>
      {data.incomplete_track_info == 0 ? (
        <UploadForm API_BASE_URL={API_BASE_URL as string} />
      ) : (
        <ResumeUploadFile
          API_BASE_URL={API_BASE_URL as string}
          data={data.incomplete_track_info}
        />
      )}
    </>
  );
};

export default UploadPage;
