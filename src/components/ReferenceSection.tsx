'use client';

import { useState, useRef } from 'react';
import { Reference } from '@/lib/types';

interface ReferenceSectionProps {
  initialRefs: Reference[];
}

export default function ReferenceSection({ initialRefs }: ReferenceSectionProps) {
  const [refs, setRefs] = useState<Reference[]>(initialRefs);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<'link' | 'file'>('link');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddLink = async () => {
    if (!name.trim() || !url.trim()) return;
    setSaving(true);
    const res = await fetch('/api/references', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), type: 'link', url: url.trim() }),
    });
    if (res.ok) {
      const created = await res.json();
      setRefs((prev) => [created, ...prev]);
      setName('');
      setUrl('');
      setShowAdd(false);
    }
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const label = name.trim() || file.name;
    setSaving(true);

    const formData = new FormData();
    formData.append('file', file);
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      if (uploadRes.ok) {
        const { url: fileUrl } = await uploadRes.json();
        const res = await fetch('/api/references', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: label, type: 'file', url: fileUrl }),
        });
        if (res.ok) {
          const created = await res.json();
          setRefs((prev) => [created, ...prev]);
          setName('');
          setUrl('');
          setShowAdd(false);
        }
      }
    } catch { /* skip */ }
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除這個參考資料嗎？')) return;
    const res = await fetch(`/api/references/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setRefs((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div />
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {showAdd ? '取消' : '＋ 新增資料'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6 space-y-3">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setAddType('link')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                addType === 'link' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              網址連結
            </button>
            <button
              onClick={() => setAddType('file')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                addType === 'file' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              上傳檔案
            </button>
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名稱（例如：菜單參考、品牌色卡）"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
          />

          {addType === 'link' ? (
            <>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              />
              <button
                onClick={handleAddLink}
                disabled={saving || !name.trim() || !url.trim()}
                className="px-5 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {saving ? '儲存中...' : '新增'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="w-full py-5 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors text-sm"
              >
                {saving ? '上傳中...' : '點擊選擇檔案'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          )}
        </div>
      )}

      {/* List */}
      {refs.length === 0 && !showAdd && (
        <div className="text-center py-12 text-sm text-gray-300">
          尚無參考資料
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {refs.map((ref) => (
          <div
            key={ref.id}
            className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden group"
          >
            {/* Image preview */}
            {ref.type === 'file' && isImage(ref.url) && (
              <a href={ref.url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ref.url} alt={ref.name} className="w-full h-40 object-cover" />
              </a>
            )}

            <div className="p-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">
                  {ref.type === 'link' ? '🔗' : isImage(ref.url) ? '🖼️' : '📄'}
                </span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors truncate"
                >
                  {ref.name}
                </a>
              </div>
              <button
                onClick={() => handleDelete(ref.id)}
                className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
