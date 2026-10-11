import Link from "next/link";
import Wordmark from "./Wordmark";
import EmailLink from "./EmailLink";
import { NAV } from "./nav";
import { site, socialLinks } from "@/lib/content";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Footer() {
  const { contact } = site;
  const [emailUser, emailDomain] = contact.email.split("@");
  const showEmail = contact.showEmail && emailUser && emailDomain;

  return (
    <footer className="on-band border-t-2">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr] lg:px-10">
        <div>
          <Wordmark parts={site.wordmark} />
          <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-band-muted">
            {site.name} · {site.school.replace(/\s*\(UCCS\)\s*$/, "")}
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow !text-band-muted">PAGES</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 text-sm font-bold tracking-[0.08em] md:grid-cols-1">
            {[{ href: "/", label: "HOME" }, ...NAV, { href: "/join", label: "JOIN" }].map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-block py-2 hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm leading-relaxed">
          <h2 className="eyebrow !text-band-muted">CONTACT</h2>
          {contact.address && (
            <address className="mt-3 not-italic">{contact.address}</address>
          )}
          {showEmail && (
            <div className="mt-3">
              <EmailLink user={emailUser} domain={emailDomain} label={contact.emailLabel} />
            </div>
          )}
          {socialLinks.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Social links">
              {socialLinks.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="inline-flex h-11 w-11 items-center justify-center border-2 border-band-ink hover:bg-band-ink hover:text-band"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t-2 border-band-ink/30">
        <p className="mx-auto max-w-[1400px] px-4 py-5 text-xs tracking-[0.06em] text-band-muted sm:px-6 lg:px-10">
          © {new Date().getFullYear()} {site.name}. Student organization at UCCS.
        </p>
      </div>
    </footer>
  );
}
