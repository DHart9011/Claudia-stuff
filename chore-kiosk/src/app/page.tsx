import Link from "next/link";
import { db } from "@/lib/db";
import { Avatar } from "@/components/Avatar";
import { SetupForm } from "@/components/SetupForm";

// Always render at request time — this reads live profile data, and
// pre-rendering it at build time would bake in a stale (or DB-less) result.
export const dynamic = "force-dynamic";

export default async function ProfilePickerPage() {
  const household = await db.household.findFirst({
    include: {
      profiles: {
        where: { active: true },
        orderBy: [{ role: "asc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!household) {
    return (
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="mb-1 text-2xl font-bold">Welcome!</h1>
          <p className="mb-6 text-slate-500">Let&apos;s set up your household.</p>
          <SetupForm />
        </div>
      </main>
    );
  }

  const parents = household.profiles.filter((p) => p.role === "PARENT");
  const kids = household.profiles.filter((p) => p.role === "KID");

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-12 p-8">
      <h1 className="text-4xl font-bold text-slate-800">Who&apos;s there?</h1>

      {kids.length > 0 && (
        <section className="flex flex-wrap justify-center gap-8">
          {kids.map((kid) => (
            <ProfileTile key={kid.id} id={kid.id} name={kid.name} emoji={kid.avatarEmoji} color={kid.avatarColor} />
          ))}
        </section>
      )}

      <section className="flex flex-wrap justify-center gap-6 border-t border-slate-300 pt-8">
        {parents.map((parent) => (
          <ProfileTile
            key={parent.id}
            id={parent.id}
            name={parent.name}
            emoji={parent.avatarEmoji}
            color={parent.avatarColor}
            size="md"
            label="Parent"
          />
        ))}
      </section>
    </main>
  );
}

function ProfileTile({
  id,
  name,
  emoji,
  color,
  size = "xl",
  label,
}: {
  id: string;
  name: string;
  emoji: string;
  color: string;
  size?: "md" | "xl";
  label?: string;
}) {
  return (
    <Link
      href={`/pin/${id}`}
      className="flex flex-col items-center gap-3 rounded-3xl p-4 transition active:scale-95"
    >
      <Avatar emoji={emoji} color={color} size={size} />
      <span className="text-xl font-semibold text-slate-700">{name}</span>
      {label && <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>}
    </Link>
  );
}
