export interface TranslatedText {
    [lang: string]: string | null;
}

export interface Geo {
    lat: number;
    lon: number;
}

export interface DateRange {
    start: string;
    end: string;
}

export interface NodeFileUpload {
    filename?: string;
    filepath?: string;
    contentType?: string;
    stream: any;
}
