import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/content";

export default function JoinButton({ className = "", size = "md" }: { className?: string; size?: "md" | "xl" }) {
  return (
    <a
      href={site.join.mountainLionConnectUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-primary press ${size === "xl" ? "min-h-[72px] px-6 text-base sm:px-10 sm:text-xl" : ""} ${className}`}
    >
      JOIN ON MOUNTAIN LION CONNECT
      <ArrowUpRight aria-hidden="true" size={size === "xl" ? 26 : 20} />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}
