export interface Post {
  id: string;
  day_number: number;
  content: string;
  images: string[];
  link: string;
  status: PostStatus;
  feedback: string;
  created_at: string;
  updated_at: string;
}

export interface Reference {
  id: string;
  name: string;
  type: 'link' | 'file';
  url: string;
  created_at: string;
}

export interface IgFbPost {
  id: string;
  post_number: number;
  content: string;
  images: string[];
  link: string;
  status: PostStatus;
  feedback: string;
  created_at: string;
  updated_at: string;
}

export type PostStatus = 'pending' | 'approved' | 'revision';

export const STATUS_LABELS: Record<PostStatus, string> = {
  pending: '待審核',
  approved: '可以發',
  revision: '建議調整',
};

export const STATUS_STYLES: Record<PostStatus, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' },
  approved: { bg: 'bg-[#683B92]', text: 'text-white', border: 'border-[#683B92]' },
  revision: { bg: 'bg-[#EB6D54]', text: 'text-white', border: 'border-[#EB6D54]' },
};
