import { ProposalReservation } from './proposal-reservation';

export interface Proposal {
    id: string;
    title: string;
    description: string;
    category: string;
    order: string;
    reservations: ProposalReservation[];
}
