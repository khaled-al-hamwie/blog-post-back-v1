import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { existsSync, mkdirSync, writeFile } from "fs";

@Injectable()
export class UploadService {
    createName(name: string): string {
        const currentDate = new Date();
        const formattedDate = currentDate
            .toISOString()
            .replace(/[-:]/g, "")
            .replace("T", "_")
            .split(".")[0];
        const invalidCharsRegex = /[\/\\(){}[\]]/g;
        const fileName = name.replace(/\s/g, "_");
        const uniqueFileName = `${formattedDate}_${fileName.replace(
            invalidCharsRegex,
            "_",
        )}`;
        return uniqueFileName;
    }

    upload(buffer: Buffer, name: string, folderName: string) {
        const folderPath = `uploads/${folderName}`;
        console.log(folderPath);
        if (!existsSync(folderPath)) mkdirSync(folderPath);
        writeFile(`${folderPath}/${name}`, buffer, err => {
            if (err) throw new InternalServerErrorException();
        });
    }
}
