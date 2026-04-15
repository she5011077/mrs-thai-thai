'use client';

import { useState, useRef } from 'react';

interface PlanCardProps {
  label: string;
  linkKey: string;
  fileKey: string;
  initialLink: string;
  initialFile: string;
  initialFileName: string;
}

export default function PlanCard({ label, linkKey, fileKey, initialLink, initialFile, initialFileName }: PlanCardProps) {
  const [link, setLink] = useState(initialLink || '');
  const [fileUrl, setFileUrl] = useState(initialFile || '');
  const [fileName, setFileName] = useState(initialFileName || '');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveSetting = async (key: string, value: string) => {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
  };

  const handleSaveLink = async () => {
    const trimmed = input.trim();
    setSaving(true);
    await saveSetting(linkKey, trimmed);
    setLink(trimmed);
    setEditing(false);
    setSaving(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const { url } = await res.json();
        await saveSetting(fileKey, url);
        await saveSetting(fileKey + '_name', file.name);
        setFileUrl(url);
        setFileName(file.name);
      }
    } catch { /* skip */ }
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearFile = async () => {
    setSaving(true);
    await saveSetting(fileKey, '');
    await saveSetting(fileKey + '_name', '');
    setFileUrl('');
    setFileName('');
    setSaving(false);
  };

  const handleClearLink = async () => {
    setSaving(true);
    await saveSetting(linkKey, '');
    setLink('');
    setInput('');
    setEditing(false);
    setSaving(false);
  };

  const hasContent = link || fileUrl;

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">{label}</span>
        {!hasContent && !open && (
          <button onClick={() => setOpen(true)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            點擊設定
          </button>
        )}
        {hasContent && !open && (
          <button onClick={() => setOpen(true)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            查看 / 編輯
          </button>
        )}
      </div>

      {/* Compact preview */}
      {!open && hasContent && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs text-gray-600 hover:bg-gray-100 transition-colors">
              📄 {fileName || 'Word 檔案'}
            </a>
          )}
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-xs text-blue-500 hover:bg-gray-100 transition-colors truncate max-w-[200px]">
              🔗 網址連結
            </a>
          )}
        </div>
      )}

      {/* Expanded panel */}
      {open && (
        <div className="border-t border-gray-100 px-4 py-4 space-y-4">
          {/* File upload */}
          <div>
            <label className="text-[11px] text-gray-400 mb-2 block">Word 檔案</label>
            {fileUrl ? (
              <div className="flex items-center justify-between gap-2">
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-900 hover:text-gray-600 transition-colors truncate">
                  📄 {fileName || '已上傳檔案'}
                </a>
                <button onClick={handleClearFile} disabled={saving} className="text-xs text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                  移除
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving}
                  className="w-full py-4 border border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors text-sm"
                >
                  {saving ? '上傳中...' : '點擊上傳 Word 檔案'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </>
            )}
          </div>

          {/* Link */}
          <div>
            <label className="text-[11px] text-gray-400 mb-2 block">網址連結</label>
            {link && !editing ? (
              <div className="flex items-center justify-between gap-2">
                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                  {link}
                </a>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setInput(link); setEditing(true); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    編輯
                  </button>
                  <button onClick={handleClearLink} disabled={saving} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                    移除
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="url"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="貼上 Google 文件或其他連結..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveLink()}
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveLink} disabled={saving || !input.trim()} className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors">
                    {saving ? '儲存中...' : '儲存'}
                  </button>
                  {editing && (
                    <button onClick={() => setEditing(false)} className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      取消
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button onClick={() => { setOpen(false); setEditing(false); }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              收起
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
