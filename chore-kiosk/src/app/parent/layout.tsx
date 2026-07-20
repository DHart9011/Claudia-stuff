import Link from "next/link";
import { requireParent } from "@/lib/auth";
import { logout } from "@/actions/auth-actions";

const NAV_ITEMS = [
  { href: "/parent/approvals", label: "Approvals" },
  { href: "/parent/chores", label: "Chores" },
  { href: "/parent/profiles", label: "Kids & Parents" },
  { href: "/parent/payouts", label: "Payouts" },
  { href: "/parent/quickbooks", label: "QuickBooks" },
];

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireParent();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between gap-4 bg-white px-6 py-4 shadow">
        <nav className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 font-medium text-slate-600 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{session.name}</span>
          <form action={logout}>
            <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 active:scale-95">
              Switch profile
            </button>
          </form>
        </div>
      </header>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
