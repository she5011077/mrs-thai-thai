'use client';

import { useState } from 'react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';
import EditModal from './EditModal';
import DocCard from './DocCard';

interface DashboardProps {
  initialPosts: Post[];
  settings: Record<string, string>;
}

export default function Dashboard({ initialPosts, settings }: DashboardProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const postsByDay = new Map<number, Post>();
  posts.forEach((p) => postsByDay.set(p.day_number, p));

  const editingPost = editingDay !== null ? postsByDay.get(editingDay) || null : null;

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

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12 lg:mb-14">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-1">
            Threads 內容排程
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 tracking-wide">內容管理 / 業主審核</p>
        </header>

        {/* Google Doc Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <DocCard label="訪談稿" settingKey="interview_doc_url" initialUrl={settings.interview_doc_url || ''} />
          <DocCard label="30日發文企劃" settingKey="plan_doc_url" initialUrl={settings.plan_doc_url || ''} />
        </div>

        {/* 30-day Card Grid */}
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
    </div>
  );
}
