"use client";

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
// import { Button } from "../ui/button";
import { UploadFile } from "./uploadFile";
import { UploadTrack } from "./uploadTrack";
import { UploadThumbnail } from "./uploadThumbnail";

const steps = ['Upload Song', 'Track Info', 'Upload Thumbnail']

interface UploadForm {
    API_BASE_URL: string;
}

export const UploadForm = ({API_BASE_URL}: UploadForm) => {
    const [step, setStep] = useState(1);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [trackId, setTrackId] = useState<string | null>(null);
    const [trackData, setTrackData] = useState({
      artist: '',
      title: '',
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return( 
        <Card className="w-[600px] mx-auto">
            <CardHeader>
                <CardTitle>Upload Music</CardTitle>
                <CardDescription>Complete all steps to upload your track</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((stepName, index) => (
                <div key={stepName} className="text-center">
                    <div className={`w-8 h-8 rounded-full mb-2 mx-auto flex items-center justify-center ${
                    step > index + 1 ? 'bg-primary text-primary-foreground' : 
                    step === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                    {step > index + 1 ? '✓' : index + 1}
                    </div>
                    <div className="text-xs">{stepName}</div>
                </div>
                ))}
            </div>
            <Progress value={(step / steps.length) * 100} className="w-full" />
            </div>

            {step == 1 && (
                <UploadFile nextStep={nextStep} setUploadProgress={setUploadProgress} setTrackId={setTrackId} API_BASE_URL={API_BASE_URL}/>
            )}
            {step == 2 && (
              <>
                <div className="text-center text-lg font-bold mb-4">Track Info</div>
                <UploadTrack nextStep={nextStep} setTrackData={setTrackData} />
              </>
            )}
            {step == 3 && (
              <>
                <div className="text-center text-lg font-bold mb-4">Upload Thumbnail</div>
                <UploadThumbnail 
                  prevStep={prevStep} 
                  API_BASE_URL={API_BASE_URL}
                  track_data={trackData}
                  track_id={trackId as string}  
                  uploadProgress={uploadProgress}
                />
              </>
            )}
            </CardContent>
            <CardFooter className="flex flex-col items-stretch">
                {uploadProgress > 0 && (
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading file...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}
            </CardFooter>
        </Card>
    )
}