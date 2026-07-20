import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Avatar } from "@/components/Avatar";
import { PinPad } from "@/components/PinPad";

export default async function PinPage({ params }: PageProps<"/pin/[profileId]">) {
  const { profileId } = await params;

  const profile = await db.profile.findUnique({ where: { id: profileId } });
  if (!profile || !profile.active) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
      <div className="flex flex-col items-center gap-3">
        <Avatar emoji={profile.avatarEmoji} color={profile.avatarColor} size="xl" />
        <h1 className="text-2xl font-bold text-slate-800">{profile.name}</h1>
        <p className="text-slate-500">Enter your PIN</p>
      </div>

      <PinPad profileId={profile.id} />

      <Link href="/" className="text-slate-400 underline">
        Not you?
      </Link>
    </main>
  );
}
