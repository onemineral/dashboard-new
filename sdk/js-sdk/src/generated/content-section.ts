import { SectionBlock } from './section-block';

export interface ContentSection {
    id: string;
    title: string;
    type: string;
    order: string;
    is_carousel: string;
    is_featured: string;
    blocks?: SectionBlock[];
}
