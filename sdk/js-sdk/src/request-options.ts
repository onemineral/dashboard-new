import { AxiosProgressEvent } from 'axios';

export interface RequestOptions {
    headers?: { [key: string]: string };
    fileUpload?: boolean;
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => number;
}
