import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { Avatar } from "@/components/Avatar";
import { ProfileForm } from "@/components/ProfileForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { setProfileActive, updateProfile } from "@/actions/profile-actions";

export default async function ProfilesPage() {
  const session = await requireParent();

  const profiles = await db.profile.findMany({
    where: { householdId: session.householdId },
    orderBy: [{ role: "asc" }, { active: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Kids & parents</h1>
        <div className="flex flex-col divide-y divide-slate-100 rounded-2xl bg-white shadow">
          {profiles.map((profile) => (
            <div key={profile.id} className={`flex flex-col gap-3 p-5 ${profile.active ? "" : "opacity-50"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar emoji={profile.avatarEmoji} color={profile.avatarColor} size="md" />
                  <div>
                    <p className="font-semibold text-slate-800">{profile.name}</p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {profile.role} {!profile.active && "· Deactivated"}
                    </p>
                  </div>
                </div>
                <form action={setProfileActive.bind(null, profile.id, !profile.active)}>
                  <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                    {profile.active ? "Deactivate" : "Reactivate"}
                  </button>
                </form>
              </div>
              <EditProfileForm
                action={updateProfile.bind(null, profile.id)}
                defaultValues={{
                  name: profile.name,
                  avatarEmoji: profile.avatarEmoji,
                  avatarColor: profile.avatarColor,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow">
        <h2 className="text-lg font-semibold text-slate-700">Add a profile</h2>
        <ProfileForm />
      </div>
    </div>
  );
}
