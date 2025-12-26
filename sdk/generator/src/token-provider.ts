export interface TokenProvider {
    get(): string;
}

export class NoOpTokenProvider {
    public get(): string {
        return '';
    }
}
