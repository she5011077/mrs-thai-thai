'use client';

import { useState, useRef } from 'react';
import { IgFbPost, PostStatus, STATUS_LABELS, STATUS_STYLES } from '@/lib/types';

interface IgFbEditModalProps {
  num: number;
  post: IgFbPost | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<IgFbPost>) => Promise<void>;
  onCreate: (num: number, data: Partial<IgFbPost>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function IgFbEditModal({ num, post, onClose, onSave, onCreate, onDelete }: IgFbEditModalProps) {
  const [content, setContent] = useState(post?.content || '');
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [link, setLink] = useState(post?.link || '');
  const [status, setStatus] = useState<PostStatus>(post?.status || 'pending');
  const [feedback, setFeedback] = useState(post?.feedback || '');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!post);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isNew = !post;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      if (images.length >= 5) break;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (res.ok) {
          const { url } = await res.json();
          setImages((prev) => (prev.length < 5 ? [...prev, url] : prev));
        }
      } catch { /* skip */ }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSaving(true);
    const data = { content, images, link, status, feedback };
    if (isNew) {
      await onCreate(num, data);
    } else {
      await onSave(post.id, data);
    }
    setSaving(false);
  };

  const statuses: PostStatus[] = ['pending', 'approved', 'revision'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 z-10">
          <h2 className="text-base font-semibold text-gray-900">
            IG / FB 第 {num} 篇
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13" />
            </svg>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* 1. Status */}
          <div>
            <label className="text-[11px] text-gray-400 mb-2 block">審核狀態</label>
            <div className="flex gap-2">
              {statuses.map((s) => {
                const st = STATUS_STYLES[s];
                const isActive = status === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? `${st.bg} ${st.text}`
                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* 2. Content preview / edit */}
          {!isEditing && content ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] text-gray-400">貼文預覽</label>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  編輯內容
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 leading-tight">品牌帳號</div>
                    <div className="text-[11px] text-gray-400">IG / FB 第 {num} 篇</div>
                  </div>
                </div>
                {images.length > 0 && (
                  <div className="flex gap-2 mb-3 overflow-x-auto">
                    {images.map((img, i) => (
                      <div key={i} className="w-32 h-32 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img} alt={`照片 ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-[14px] text-gray-900 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
                {link && (
                  <a href={link} target="_blank" rel="noopener noreferrer" className="block mt-3 text-xs text-blue-500 hover:underline truncate">
                    {link}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
                文案內容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="輸入文案內容..."
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none leading-relaxed transition-colors"
              />
              <div className="flex items-center justify-between mt-1.5">
                <div className="text-[11px] text-gray-300">{content.length} / 2200</div>
                {!isNew && content && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    預覽
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 3. Photos (max 5) */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              照片（最多 5 張）
            </label>

            {images.length > 0 && isEditing && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`照片 ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
                    >
                      移除
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors text-sm"
              >
                點擊上傳照片
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* 4. External Link */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              外部連結
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
            />
          </div>

          <div className="border-t border-gray-100" />

          {/* 5. Owner Feedback */}
          <div>
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 block">
              業主回饋
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="輸入修改建議或備註..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white sm:rounded-b-2xl flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100">
          <div>
            {!isNew && (
              <button
                onClick={() => { if (confirm('確定要刪除這篇文章嗎？')) onDelete(post.id); }}
                className="px-4 py-2 text-sm text-red-400 hover:text-red-600 transition-colors"
              >
                刪除
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !content.trim()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {saving ? '處理中...' : isNew ? '新增' : '儲存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
