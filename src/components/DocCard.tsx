'use client';

import { useState } from 'react';

interface DocCardProps {
  label: string;
  settingKey: string;
  initialUrl: string;
}

function toEmbedUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) {
    return `https://docs.google.com/document/d/${match[1]}/preview`;
  }
  return url;
}

export default function DocCard({ label, settingKey, initialUrl }: DocCardProps) {
  const [url, setUrl] = useState(initialUrl || '');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const trimmed = input.trim();
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: settingKey, value: trimmed }),
    });
    setUrl(trimmed);
    setEditing(false);
    setSaving(false);
    if (trimmed) setOpen(true);
  };

  const handleClear = async () => {
    setSaving(true);
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: settingKey, value: '' }),
    });
    setUrl('');
    setInput('');
    setEditing(false);
    setOpen(false);
    setSaving(false);
  };

  const handleCardClick = () => {
    if (url) {
      setOpen(true);
    } else {
      setInput('');
      setEditing(true);
      setOpen(true);
    }
  };

  return (
    <>
      {/* Card - compact */}
      <button
        onClick={handleCardClick}
        className={`w-full bg-white rounded-xl border transition-all text-left px-4 py-3 ${
          url
            ? 'border-gray-100 hover:border-gray-200 hover:shadow-md'
            : 'border-dashed border-gray-200 hover:border-gray-300'
        }`}
      >
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        {!url && <span className="text-xs text-gray-400 ml-2">點擊設定</span>}
        {url && <span className="text-xs text-gray-400 ml-2">點擊預覽</span>}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={() => { setOpen(false); setEditing(false); }} />

          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">{label}</h2>
              <div className="flex items-center gap-2">
                {url && !editing && (
                  <button
                    onClick={() => { setInput(url); setEditing(true); }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    編輯連結
                  </button>
                )}
                <button
                  onClick={() => { setOpen(false); setEditing(false); }}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Edit URL */}
            {editing && (
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
                <input
                  type="url"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="貼上 Google 文件連結..."
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors mb-3"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {saving ? '儲存中...' : '儲存'}
                  </button>
                  {url && (
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      取消
                    </button>
                  )}
                  {url && (
                    <button
                      onClick={handleClear}
                      disabled={saving}
                      className="px-4 py-1.5 text-xs text-red-400 hover:text-red-600 transition-colors ml-auto"
                    >
                      移除連結
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Preview */}
            {url && !editing && (
              <iframe
                src={toEmbedUrl(url)}
                className="w-full flex-1 min-h-[60vh] border-0"
                title={label}
              />
            )}

            {!url && !editing && (
              <div className="flex-1 flex items-center justify-center py-20 text-sm text-gray-300">
                尚未設定文件連結
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
