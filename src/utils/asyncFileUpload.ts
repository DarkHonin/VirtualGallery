import { supabase } from "@/db/index.db";
import * as tus from "tus-js-client";
import { NO_USER_SESSION } from "./Errors.list.js";
import { type Ref, ref } from "vue";

export async function uploadFileAsync(
    bucketName: string,
    fileName: string,
    file: File,
    onProgress: { (bytesUploaded: number, bytesTotal: number): void },
    onError: { (error: tus.DetailedError | Error): void },
    onSuccess: { (): void },
) {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) throw NO_USER_SESSION;

    return new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
            endpoint: `${
                import.meta.env["VITE_SUPABASE_URL"]
            }/storage/v1/upload/resumable`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            headers: {
                authorization: `Bearer ${session.access_token}`,
                "x-upsert": "true", // optionally set upsert to true to overwrite existing files
            },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
            metadata: {
                bucketName: bucketName,
                objectName: fileName,
                contentType: file.type,
                cacheControl: "3600",
            },
            chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
            onError: function (error) {
                console.log("Failed because: " + error);
                onError(error);
                reject(error);
            },
            onProgress,
            onSuccess: function () {
                onSuccess();
                resolve(true);
            },
        });

        // Check if there are any previous uploads to continue.
        return upload.findPreviousUploads().then(
            function (previousUploads) {
                // Found previous uploads so we select the first one.
                if (previousUploads.length) {
                    upload.resumeFromPreviousUpload(previousUploads[0]);
                }

                // Start the upload
                upload.start();
            },
        );
    });
}
