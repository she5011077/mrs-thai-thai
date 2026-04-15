import { Post, STATUS_LABELS, STATUS_STYLES } from '@/lib/types';

interface PostCardProps {
  day: number;
  post?: Post;
  onClick: () => void;
}

export default function PostCard({ day, post, onClick }: PostCardProps) {
  if (!post) {
    return (
      <button
        onClick={onClick}
        className="text-left w-full bg-white rounded-xl p-3 sm:p-5 border border-dashed border-gray-200 hover:border-gray-300 transition-all cursor-pointer min-h-[120px] sm:min-h-[160px] flex flex-col"
      >
        <div className="mb-2 sm:mb-3">
          <span className="text-sm sm:text-base font-semibold text-gray-300 tracking-tight">
            Day {day}
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
          Day {day}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-medium tracking-wide ${style.bg} ${style.text}`}
        >
          {STATUS_LABELS[post.status]}
        </span>
      </div>
      <p className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed whitespace-pre-line">
        {preview}
      </p>
    </button>
  );
}
