import VideoPlayer from "@/components/ui/VideoPlayer";
import type { Video } from "@/lib/content";

/** Player + title, subtitle, description, chapters, tags, level and credit. */
export default function FeaturedVideo({ video, compact = false }: { video: Video; compact?: boolean }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      <VideoPlayer src={video.src} poster={video.poster} title={video.title} captions={video.captions} />
      <div>
        {!compact && <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight">{video.title}</h2>}
        {video.subtitle && <p className={`eyebrow ${compact ? "" : "mt-2"}`}>{video.subtitle}</p>}
        {video.description && <p className="body-copy mt-4">{video.description}</p>}
        {video.chapters.length > 0 && (
          <div className="mt-6">
            <h3 className="eyebrow !font-bold !text-ink">CHAPTERS</h3>
            <ol className="mt-2 grid gap-1.5 text-sm">
              {video.chapters.map((c) => (
                <li key={c.label} className="border-l-2 border-ink pl-3">
                  {c.label}
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {video.level && <span className="tag bg-lav">{video.level}</span>}
          {video.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
        {video.credit && <p className="mt-5 text-sm font-medium">{video.credit}</p>}
      </div>
    </div>
  );
}
