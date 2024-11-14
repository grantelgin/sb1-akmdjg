export interface Guide {
  id: string;
  title: string;
  description: string;
  category: 'homeowner' | 'business';
  slug: string;
  content: string;
  coverImage: string;
  readingTime: string;
  publishDate: string;
}
