import { ThreadMessage } from './thread-message';
import { ApiClient } from '../api-client';
import { RequestOptions } from '../request-options';
import { PaginatedResponse } from '../response';

export interface ThreadMessageProposal {
    id: number;
    thread_message: ThreadMessage;
    content: string;
    translated_content: string;
    translated_language_code: string;
    created_at: string;
    updated_at: string;
}

export class ThreadMessageProposalClient {
    public constructor(private readonly apiClient: ApiClient) {}

    private path: string = 'thread-message-proposal';

    public async query(
        params: ThreadMessageProposalQueryParams,
        options?: RequestOptions,
    ): Promise<PaginatedResponse<ThreadMessageProposal>> {
        return this.apiClient.request(`${this.path}/query`, { params, options });
    }
}

export interface ThreadMessageProposalQueryParams {
    thread_message: number;
}
