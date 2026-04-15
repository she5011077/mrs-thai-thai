import { supabase } from '@/lib/supabase';
import Dashboard from '@/components/Dashboard';
import { Post, IgFbPost, Reference } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [postsRes, settingsRes, igFbRes, refsRes] = await Promise.all([
    supabase.from('threads_posts_thai').select('*').order('day_number', { ascending: true }),
    supabase.from('site_settings_thai').select('*'),
    supabase.from('ig_fb_posts_thai').select('*').order('post_number', { ascending: true }),
    supabase.from('references_thai').select('*').order('created_at', { ascending: false }),
  ]);

  const posts = (postsRes.data as Post[]) || [];
  const igFbPosts = (igFbRes.data as IgFbPost[]) || [];
  const refs = (refsRes.data as Reference[]) || [];
  const settings: Record<string, string> = {};
  settingsRes.data?.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });

  return <Dashboard initialPosts={posts} initialIgFbPosts={igFbPosts} initialRefs={refs} settings={settings} />;
}
