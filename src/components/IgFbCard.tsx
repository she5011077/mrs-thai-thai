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
        className="text-left w-full bg-white rounded-xl p-3 sm:p-5 border border-dashed border-gray-200 hover:border-gray-300 transition-all cursor-pointer min-h-[120px] sm:min-h-[160px] flex flex-col"
      >
        <div className="mb-2 sm:mb-3">
          <span className="text-sm sm:text-base font-semibold text-gray-300 tracking-tight">
            第 {num} 篇
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-gray-300 text-xs sm:text-sm">點擊新增內容</span>
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
      className={`text-left w-full bg-white rounded-xl p-3 sm:p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border min-h-[120px] sm:min-h-[160px] ${
        post.status === 'revision' ? 'border-red-200' : 'border-gray-100 hover:border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <span className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
          第 {num} 篇
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium tracking-wide ${style.bg} ${style.text}`}
        >
          {STATUS_LABELS[post.status]}
        </span>
      </div>
      {post.images.length > 0 && (
        <div className="flex gap-1 mb-2">
          {post.images.map((img, i) => (
            <div key={i} className="w-8 h-8 rounded overflow-hidden border border-gray-100 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`照片 ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">
        {preview}
      </p>
    </button>
  );
}
