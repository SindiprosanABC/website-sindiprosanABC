export type News = {
  slug: string;
  imageSrc: string;
  tag: string;
  date: string;
  title: string;
  bodyText: string;
  cta: string;
  content: string;
  category: string;
  source?: { id: string | null; name: string };
  author?: string | null;
  url: string;
};
