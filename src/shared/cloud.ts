import { v2 as cloudinary } from "cloudinary";
import { ObjectId } from "mongodb";
import Logger from "@shared/Logger";
import path from "path";

cloudinary.config({
    cloud_name: "virajshah",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadWatcher = {};

export function uploadFile(file: string, filetype: string, pubId: string) {
    cloudinary.uploader.upload(
        file,
        {
            resource_type: filetype,
            public_id: pubId,
            overwrite: true,
        },
        (err, result) => {
            if (err) Logger.error(err);
            else Logger.info(result);
        }
    );
}

export function uploadProfilePhoto(file: string, userId: ObjectId) {
    uploadFile(file, "image", `profile_photos/${userId.toHexString()}`);
}
