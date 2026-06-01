export interface GeneratedContent {
  twitter: TwitterContent;
  tiktok: TikTokContent;
  instagram?: InstagramContent;
  linkedin: string;
  newsletter: NewsletterContent;
  blog: BlogContent;
  quotes: string[];
}

export interface TwitterContent {
  posts: string[];
  thread: string[];
}

export interface TikTokContent {
  scripts: TikTokScript[];
}

export interface TikTokScript {
  hook: string;
  body: string;
  cta: string;
  visualNotes: string;
}

export interface InstagramContent {
  reels: InstagramReel[];
}

export interface InstagramReel {
  hook: string;
  body: string;
  cta: string;
  caption: string;
}

export interface NewsletterContent {
  subjectLine: string;
  body: string;
}

export interface BlogContent {
  title: string;
  outline: string[];
  intro: string;
}

export interface Project {
  id: string;
  user_id: string;
  youtube_url: string;
  video_title: string;
  transcript: string;
  generated_content: GeneratedContent | null;
  created_at: string;
  status: "processing" | "completed" | "failed";
}

export interface UserProfile {
  id: string;
  email: string;
  plan: "free" | "starter" | "pro" | "agency";
  generations_used: number;
  generations_reset_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export const PLAN_LIMITS: Record<string, number> = {
  free: 3,
  starter: 25,
  pro: 100,
  agency: 500,
};
