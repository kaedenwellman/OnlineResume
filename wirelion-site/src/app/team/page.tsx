import type { Metadata } from "next";
import Image from "next/image";
import LetterAvatar from "@/components/ui/LetterAvatar";
import { team, type Person } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team",
  description: "The officers and faculty advisor of the Wire Lion Engineering Club at UCCS.",
  alternates: { canonical: "/team" },
};

function PersonCard({ person, index }: { person: Person; index: number }) {
  return (
    <li className="brutal flex flex-col bg-elevated">
      <div className="relative aspect-square overflow-hidden border-b-2 border-ink">
        {person.photo ? (
          <Image src={person.photo} alt={`Portrait of ${person.name}`} fill sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 92vw" className="object-cover" />
        ) : (
          <LetterAvatar name={person.name} index={index} />
        )}
        {person.badge && (
          <span className="tag absolute left-3 top-3 bg-elevated !text-[0.65rem]">{person.badge}</span>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="eyebrow">{person.role}</p>
        <h3 className="mt-1 text-lg font-extrabold uppercase leading-tight">{person.name}</h3>
      </div>
    </li>
  );
}

export default function TeamPage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <p className="eyebrow">WHO RUNS IT</p>
      <h1 className="h-giant mt-1">THE CREW</h1>

      <section className="mt-12" aria-labelledby="officers">
        <h2 id="officers" className="text-2xl font-extrabold tracking-tight">
          OFFICERS
        </h2>
        <hr className="rule mt-4" />
        <ul className="mt-8 grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {team.officers.map((p, i) => (
            <PersonCard key={p.slug} person={p} index={i} />
          ))}
        </ul>
      </section>

      {team.advisors.length > 0 && (
        <section className="mt-16" aria-labelledby="advisor">
          <h2 id="advisor" className="text-2xl font-extrabold tracking-tight">
            FACULTY ADVISOR
          </h2>
          <hr className="rule mt-4" />
          <ul className="mt-8 grid grid-cols-1 gap-6 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.advisors.map((p, i) => (
              <PersonCard key={p.slug} person={p} index={i + team.officers.length} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
