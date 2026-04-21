import { IgFbPost, STATUS_LABELS, STATUS_STYLES } from '@/lib/types';

interface IgFbCardProps {
  num: number;
  post?: IgFbPost;
  onClick: () => void;
}

export default function IgFbCard({ num, post, onClick }: IgFbCardProps) {
  if (!post) {
    return (
      <button
        onClick={onClick}
        className="text-left w-full bg-white rounded-xl border border-dashed border-gray-200 hover:border-gray-300 transition-all cursor-pointer min-h-[200px] sm:min-h-[260px] flex flex-col overflow-hidden"
      >
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <span className="text-gray-300 text-xs sm:text-sm">點擊新增內容</span>
        </div>
        <div className="p-3 sm:p-4">
          <span className="text-sm sm:text-base font-semibold text-gray-300 tracking-tight">
            第 {num} 篇
          </span>
        </div>
      </button>
    );
  }

  const style = STATUS_STYLES[post.status];
  const preview =
    post.content.length > 60 ? post.content.slice(0, 60) + '...' : post.content;

  return (
    <button
      onClick={onClick}
      className={`text-left w-full bg-white rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer border overflow-hidden ${
        post.status === 'revision' ? 'border-red-200' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      {/* Image area */}
      {post.images.length > 0 ? (
        <div className="w-full aspect-square overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.images[0]} alt={`第 ${num} 篇`} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-full aspect-square bg-gray-50 flex items-center justify-center">
          <span className="text-gray-200 text-xs">尚無圖片</span>
        </div>
      )}

      {/* Text area */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm sm:text-base font-semibold text-[#683B92] tracking-tight">
            第 {num} 篇
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium tracking-wide ${style.bg} ${style.text}`}
          >
            {STATUS_LABELS[post.status]}
          </span>
        </div>
        {post.images.length > 1 && (
          <div className="text-[11px] text-gray-400 mb-1">共 {post.images.length} 張圖</div>
        )}
        <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">
          {preview}
        </p>
        {post.design_note && (
          <div className="mt-2 flex items-start gap-1">
            <svg className="w-3 h-3 text-[#683B92]/50 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
            </svg>
            <span className="text-[11px] text-[#683B92]/60 leading-snug line-clamp-2">
              {post.design_note}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
