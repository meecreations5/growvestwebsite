import { Linkedin, Mail, Sparkles } from "lucide-react";
import { TEAM_DEPARTMENTS } from "../data/teamSocial";
import { BLUE, GOLD, serif } from "../lib/brand";

function TeamCard({ member, featured = false }) {
  return (
    <article className={`group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(11,11,15,.09)] ${featured ? "lg:grid lg:grid-cols-[0.82fr_1.18fr]" : ""}`}>
      <div className={`relative overflow-hidden bg-[#E9EDF5] ${featured ? "min-h-[340px]" : "aspect-[4/4.3]"}`}>
        {member.photo?.url ? (
          <img
            src={member.photo.url}
            alt={member.photo.altText || member.fullName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            style={{ objectPosition: `${member.photo.focalX ?? 50}% ${member.photo.focalY ?? 50}%` }}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[280px] items-center justify-center bg-[radial-gradient(circle_at_35%_30%,rgba(31,78,216,.22),transparent_45%),linear-gradient(145deg,#111827,#0B0B0F)]">
            <span className="font-serif text-6xl font-bold text-white/80">{member.fullName?.charAt(0) || "G"}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
      <div className={`p-6 ${featured ? "flex flex-col justify-center sm:p-9" : ""}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: BLUE }}>{member.designation}</p>
        <h3 className="mt-3 text-[24px] font-bold leading-tight text-[#0B0B0F]" style={serif}>{member.fullName}</h3>
        {(member.shortBio || member.bio) ? <p className="mt-4 text-sm leading-6 text-[#6B7280]">{member.shortBio || member.bio}</p> : null}
        {member.certifications?.length ? (
          <div className="mt-5 space-y-2">
            {member.certifications.slice(0, 3).map((item) => <p key={item} className="flex items-start gap-2 text-xs leading-5 text-[#4B5563]"><Sparkles size={13} className="mt-0.5 flex-none" style={{ color: GOLD }} />{item}</p>)}
          </div>
        ) : null}
        {(member.linkedinUrl || member.publicEmail) ? (
          <div className="mt-6 flex items-center gap-2">
            {member.linkedinUrl ? <a href={member.linkedinUrl} target="_blank" rel="noreferrer noopener" aria-label={`${member.fullName} on LinkedIn`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#1F4ED8] hover:bg-blue-50"><Linkedin size={15} /></a> : null}
            {member.publicEmail ? <a href={`mailto:${member.publicEmail}`} aria-label={`Email ${member.fullName}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-[#1F4ED8] hover:bg-blue-50"><Mail size={15} /></a> : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function TeamHierarchy({ members = [], content = {} }) {
  if (!members.length) return null;

  const groups = TEAM_DEPARTMENTS.map((department) => ({
    ...department,
    members: members.filter((member) => member.department === department.value),
  })).filter((group) => group.members.length);

  return (
    <section className="bg-[#F4F6F9] py-24 lg:py-32" id="team">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-[780px] text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1F4ED8]">{content.eyebrow || "The People Behind Your Wealth Journey"}</p>
          <h2 className="mt-5 text-[38px] font-bold leading-tight text-[#0B0B0F] lg:text-[52px]" style={serif}>{content.heading || "Human Understanding. Shared Responsibility."}</h2>
          <p className="mt-5 text-[15px] leading-7 text-[#6B7280]">{content.description || "A thoughtful team committed to bringing clarity, discipline, transparency and care to every GrowVest relationship."}</p>
        </div>

        <div className="space-y-18">
          {groups.map((group) => (
            <div key={group.value} className="border-t border-black/8 pt-10">
              <div className="mb-8 grid gap-3 lg:grid-cols-[280px_1fr] lg:items-end">
                <h3 className="text-[28px] font-bold text-[#0B0B0F]" style={serif}>{group.label}</h3>
                <p className="max-w-2xl text-sm leading-6 text-[#6B7280]">{group.description}</p>
              </div>
              <div className={`grid gap-5 ${group.value === "leadership" && group.members.length === 1 ? "max-w-4xl" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
                {group.members.map((member) => <TeamCard key={member.id} member={member} featured={group.value === "leadership" && group.members.length === 1} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
