export const NAV_LINKS = [
  "CELEBRITY",
  "MOVIES & TV",
  "POP CULTURE",
  "MUSIC",
  "GAMING",
  "SPORTS",
] as const;

export interface FeaturedArticle {
  id: string;
  category: string;
  headline: string;
  snippet: string;
  date: string;
  author: string;
  imageUrl: string;
}

export interface ArticleDetail extends FeaturedArticle {
  time: string;
  bodyIntro: string;
}

export interface LatestArticle {
  id: string;
  headline: string;
  snippet: string;
  author: string;
}

export interface Comment {
  id: string;
  authorName: string;
  timestamp: string;
  content: string;
  replies?: Comment[];
}

export const FEATURED_ARTICLES: FeaturedArticle[] = [
  {
    id: "1",
    category: "SPORTS",
    headline: "Turkey vs. USA: A Clash of Titans in the World Cup Qualifiers",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. Ut enim ad minim veniam. ",
    date: "June 06, 2026",
    author: "Dana Analia",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
  },
  {
    id: "2",
    category: "SPORTS",
    headline: "Turkey vs. USA: A Clash of Titans in the World Cup Qualifiers",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    date: "June 06, 2026",
    author: "Dana Analia",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=500&fit=crop",
  },
  {
    id: "3",
    category: "SPORTS",
    headline: "Turkey vs. USA: A Clash of Titans in the World Cup Qualifiers",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    date: "June 06, 2026",
    author: "Dana Analia",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffeeba9e7a36?w=800&h=500&fit=crop",
  },
];

export const ARTICLE_DETAILS: Record<string, ArticleDetail> = {
  "1": {
    id: "1",
    category: "SPORTS",
    headline: "Turkey vs. USA Sports Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "June 27, 2026",
    time: "12:31 PM",
    author: "Juliana Jimeno",
    imageUrl:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&h=560&fit=crop",
    bodyIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  "2": {
    id: "2",
    category: "SPORTS",
    headline: "Turkey vs. USA Sports Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "June 27, 2026",
    time: "12:31 PM",
    author: "Juliana Jimeno",
    imageUrl:
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=900&h=560&fit=crop",
    bodyIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  "3": {
    id: "3",
    category: "SPORTS",
    headline: "Turkey vs. USA Sports Lorem Ipsum Lorem Ipsum Lorem Ipsum",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    date: "June 27, 2026",
    time: "12:31 PM",
    author: "Juliana Jimeno",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffeeba9e7a36?w=900&h=560&fit=crop",
    bodyIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
};

export const LATEST_ARTICLES: LatestArticle[] = [
  {
    id: "1",
    headline:
      "Breaking: Major Studio Announces Surprise Sequel to Cult Classic Film",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Juliana J",
  },
  {
    id: "2",
    headline: "Chart-Topping Artist Drops Unexpected Collaboration Album",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Juliana J",
  },
  {
    id: "3",
    headline: "Tech Giant Unveils Next-Gen Gaming Console at Summer Expo",
    snippet:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    author: "Juliana J",
  },
];

export const ARTICLE_COMMENTS: Comment[] = [
  {
    id: "c1",
    authorName: "Juliana J",
    timestamp: "June 27, 2026 - 12:31 PM",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    replies: [
      {
        id: "c1-r1",
        authorName: "Marcus T",
        timestamp: "June 27, 2026 - 1:05 PM",
        content:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
      },
    ],
  },
  {
    id: "c2",
    authorName: "Alex Rivera",
    timestamp: "June 27, 2026 - 2:14 PM",
    content:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
  },
];

export function getFirstNameInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function getArticleById(id: string): ArticleDetail | undefined {
  return ARTICLE_DETAILS[id];
}
