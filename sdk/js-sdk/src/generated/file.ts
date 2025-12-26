import { TranslatedText } from "./shared";

export interface File {
    id: number;
    description?: TranslatedText | null;
    order: number;
    width: number;
    height: number;
    file_name: string;
    mime_type: string;
    url?: string;
    created_at: string;
    updated_at: string;
}
