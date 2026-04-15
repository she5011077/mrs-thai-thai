'use client';

import { useState } from 'react';
import { Post, IgFbPost, Reference } from '@/lib/types';
import PostCard from './PostCard';
import EditModal from './EditModal';
import DocCard from './DocCard';
import IgFbCard from './IgFbCard';
import IgFbEditModal from './IgFbEditModal';
import ReferenceSection from './ReferenceSection';
import PlanCard from './PlanCard';

interface DashboardProps {
  initialPosts: Post[];
  initialIgFbPosts: IgFbPost[];
  initialRefs: Reference[];
  settings: Record<string, string>;
}

export default function Dashboard({ initialPosts, initialIgFbPosts, initialRefs, settings }: DashboardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const [igFbPosts, setIgFbPosts] = useState<IgFbPost[]>(initialIgFbPosts);
  const [editingIgFb, setEditingIgFb] = useState<number | null>(null);

  const postsByDay = new Map<number, Post>();
  posts.forEach((p) => postsByDay.set(p.day_number, p));

  const igFbByNum = new Map<number, IgFbPost>();
  igFbPosts.forEach((p) => igFbByNum.set(p.post_number, p));

  const editingPost = editingDay !== null ? postsByDay.get(editingDay) || null : null;
  const editingIgFbPost = editingIgFb !== null ? igFbByNum.get(editingIgFb) || null : null;

  // Threads handlers
  const handleSave = async (id: string, data: Partial<Post>) => {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingDay(null);
    }
  };

  const handleCreate = async (day: number, data: Partial<Post>) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_number: day, images: [], status: 'pending', feedback: '', link: '', ...data }),
    });
    if (res.ok) {
      const created = await res.json();
      setPosts((prev) => [...prev, created]);
      setEditingDay(null);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setEditingDay(null);
    }
  };

  // IG/FB handlers
  const handleIgFbSave = async (id: string, data: Partial<IgFbPost>) => {
    const res = await fetch(`/api/ig-fb-posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setIgFbPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingIgFb(null);
    }
  };

  const handleIgFbCreate = async (num: number, data: Partial<IgFbPost>) => {
    const res = await fetch('/api/ig-fb-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_number: num, images: [], status: 'pending', feedback: '', link: '', ...data }),
    });
    if (res.ok) {
      const created = await res.json();
      setIgFbPosts((prev) => [...prev, created]);
      setEditingIgFb(null);
    }
  };

  const handleIgFbDelete = async (id: string) => {
    const res = await fetch(`/api/ig-fb-posts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setIgFbPosts((prev) => prev.filter((p) => p.id !== id));
      setEditingIgFb(null);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Top bar with brand name + nav */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#683B92]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0">
            <h1 className="text-lg sm:text-xl font-bold text-[#683B92] tracking-tight text-center sm:text-left sm:py-4">
              這味泰泰
            </h1>
            <nav className="flex items-center justify-center gap-1 sm:gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => scrollTo('sec-ref')}
                className="px-3 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 hover:text-[#683B92] transition-colors"
              >
                參考資料
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => scrollTo('sec-igfb')}
                className="px-3 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 hover:text-[#683B92] transition-colors"
              >
                IG / FB
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={() => scrollTo('sec-threads')}
                className="px-3 py-2 sm:py-4 text-xs sm:text-sm font-medium text-gray-500 hover:text-[#683B92] transition-colors"
              >
                Threads
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* 參考資料 Section */}
        <section id="sec-ref" className="scroll-mt-24">
        <header className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#683B92] tracking-tight mb-1">
            參考資料
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 tracking-wide">業主提供的檔案與連結</p>
        </header>

        <ReferenceSection initialRefs={initialRefs} />
        </section>

        {/* IG / FB Section */}
        <section id="sec-igfb" className="scroll-mt-24 mt-12 sm:mt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-[#683B92]/30 to-transparent mb-8 sm:mb-12" />
          <header className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#683B92] tracking-tight mb-1">
              IG / FB 貼文
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 tracking-wide">每月 6 篇 / 圖文共用</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <PlanCard
              label="第一個月企劃"
              linkKey="ig_fb_plan_m1_link"
              fileKey="ig_fb_plan_m1_file"
              initialLink={settings.ig_fb_plan_m1_link || ''}
              initialFile={settings.ig_fb_plan_m1_file || ''}
              initialFileName={settings.ig_fb_plan_m1_file_name || ''}
            />
            <PlanCard
              label="第二個月企劃"
              linkKey="ig_fb_plan_m2_link"
              fileKey="ig_fb_plan_m2_file"
              initialLink={settings.ig_fb_plan_m2_link || ''}
              initialFile={settings.ig_fb_plan_m2_file || ''}
              initialFileName={settings.ig_fb_plan_m2_file_name || ''}
            />
            <PlanCard
              label="第三個月企劃"
              linkKey="ig_fb_plan_m3_link"
              fileKey="ig_fb_plan_m3_file"
              initialLink={settings.ig_fb_plan_m3_link || ''}
              initialFile={settings.ig_fb_plan_m3_file || ''}
              initialFileName={settings.ig_fb_plan_m3_file_name || ''}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => {
              const post = igFbByNum.get(num);
              return (
                <IgFbCard
                  key={num}
                  num={num}
                  post={post}
                  onClick={() => setEditingIgFb(num)}
                />
              );
            })}
          </div>
        </section>

        {/* Threads Section */}
        <section id="sec-threads" className="scroll-mt-24 mt-12 sm:mt-16">
          <div className="h-px bg-gradient-to-r from-transparent via-[#683B92]/30 to-transparent mb-8 sm:mb-12" />
          <header className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#683B92] tracking-tight mb-1">
              Threads 內容排程
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 tracking-wide">內容管理 / 業主審核</p>
          </header>

          {/* Google Doc Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <DocCard label="訪談稿" settingKey="interview_doc_url" initialUrl={settings.interview_doc_url || ''} />
            <DocCard label="30日發文企劃" settingKey="plan_doc_url" initialUrl={settings.plan_doc_url || ''} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const post = postsByDay.get(day);
              return (
                <PostCard
                  key={day}
                  day={day}
                  post={post}
                  onClick={() => setEditingDay(day)}
                />
              );
            })}
          </div>
        </section>

      </div>

      {editingDay !== null && (
        <EditModal
          day={editingDay}
          post={editingPost}
          onClose={() => setEditingDay(null)}
          onSave={handleSave}
          onCreate={handleCreate}
          onDelete={handleDelete}
        />
      )}

      {editingIgFb !== null && (
        <IgFbEditModal
          num={editingIgFb}
          post={editingIgFbPost}
          onClose={() => setEditingIgFb(null)}
          onSave={handleIgFbSave}
          onCreate={handleIgFbCreate}
          onDelete={handleIgFbDelete}
        />
      )}
    </div>
  );
}
