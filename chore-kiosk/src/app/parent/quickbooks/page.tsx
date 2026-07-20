import { db } from "@/lib/db";
import { requireParent } from "@/lib/auth";
import { isQuickBooksConfigured } from "@/lib/quickbooks/config";
import { fetchExpenseAccounts, fetchVendors } from "@/lib/quickbooks/api";
import type { QuickBooksAccount, QuickBooksVendor } from "@/lib/quickbooks/types";
import { disconnectQuickBooks, setExpenseAccount, setKidVendor } from "@/actions/quickbooks-actions";

export default async function QuickBooksSettingsPage({
  searchParams,
}: PageProps<"/parent/quickbooks">) {
  const session = await requireParent();
  const { connected, error } = await searchParams;

  const configured = isQuickBooksConfigured();
  const connection = configured
    ? await db.quickBooksConnection.findUnique({ where: { householdId: session.householdId } })
    : null;

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-bold text-slate-800">QuickBooks</h1>

      {connected && (
        <p className="rounded-xl bg-emerald-50 p-4 text-emerald-700">Connected to QuickBooks Online.</p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-red-700">
          Something went wrong connecting to QuickBooks. Please try again.
        </p>
      )}

      {!configured && (
        <div className="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow">
          <p className="font-semibold text-slate-800">Not set up yet</p>
          <p className="text-sm text-slate-500">
            Register an app at{" "}
            <span className="font-medium">developer.intuit.com</span>, then set{" "}
            <code className="rounded bg-slate-100 px-1">QBO_CLIENT_ID</code>,{" "}
            <code className="rounded bg-slate-100 px-1">QBO_CLIENT_SECRET</code>, and{" "}
            <code className="rounded bg-slate-100 px-1">QBO_REDIRECT_URI</code> in your environment (see{" "}
            <code className="rounded bg-slate-100 px-1">.env.example</code>). Once those are set, come back here
            to connect.
          </p>
        </div>
      )}

      {configured && !connection && (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-white p-5 shadow">
          <p className="text-slate-600">Connect your QuickBooks Online company to send weekly payout bills.</p>
          <a
            href="/api/quickbooks/authorize"
            className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white active:scale-95"
          >
            Connect QuickBooks
          </a>
        </div>
      )}

      {configured && connection && (
        <>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow">
            <div>
              <p className="font-semibold text-slate-800">
                {connection.environment === "PRODUCTION" ? "Production" : "Sandbox"} company
              </p>
              <p className="text-sm text-slate-500">Realm ID: {connection.realmId}</p>
              <p className="text-sm text-slate-500">Connected {connection.connectedAt.toLocaleDateString()}</p>
            </div>
            <form action={disconnectQuickBooks}>
              <button className="rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-600 active:scale-95">
                Disconnect
              </button>
            </form>
          </div>

          <ExpenseAccountCard householdId={session.householdId} currentAccountName={connection.expenseAccountName} />
          <VendorMappingCard householdId={session.householdId} />
        </>
      )}
    </div>
  );
}

async function ExpenseAccountCard({
  householdId,
  currentAccountName,
}: {
  householdId: string;
  currentAccountName: string | null;
}) {
  let accounts: QuickBooksAccount[] = [];
  let loadError = false;
  try {
    accounts = await fetchExpenseAccounts(householdId);
  } catch {
    loadError = true;
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow">
      <p className="font-semibold text-slate-800">Expense account</p>
      <p className="text-sm text-slate-500">
        Every payout bill needs one expense account to post against.
        {currentAccountName && <> Currently: <span className="font-medium">{currentAccountName}</span>.</>}
      </p>
      {loadError ? (
        <p className="text-sm text-red-600">Couldn&apos;t load accounts from QuickBooks right now.</p>
      ) : (
        <form action={setExpenseAccount} className="flex gap-3">
          <select name="account" required className="flex-1 rounded-xl border border-slate-300 px-3 py-2">
            <option value="">Choose an account…</option>
            {accounts.map((a) => (
              <option key={a.id} value={`${a.id}::${a.name}`}>
                {a.name}
              </option>
            ))}
          </select>
          <button className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white active:scale-95">
            Save
          </button>
        </form>
      )}
    </div>
  );
}

async function VendorMappingCard({ householdId }: { householdId: string }) {
  const kids = await db.profile.findMany({
    where: { householdId, role: "KID", active: true },
    orderBy: { createdAt: "asc" },
  });

  let vendors: QuickBooksVendor[] = [];
  let loadError = false;
  try {
    vendors = await fetchVendors(householdId);
  } catch {
    loadError = true;
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow">
      <p className="font-semibold text-slate-800">Kid → vendor mapping</p>
      <p className="text-sm text-slate-500">Each kid needs to be an existing vendor in QuickBooks before you can send them a bill.</p>
      {loadError && (
        <p className="text-sm text-red-600">
          Couldn&apos;t load the vendor list from QuickBooks right now — existing mappings below are preserved,
          try again in a moment to change them.
        </p>
      )}
      {kids.length === 0 ? (
        <p className="text-sm text-slate-400">No kid profiles yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {kids.map((kid) => (
            <form key={kid.id} action={setKidVendor.bind(null, kid.id)} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-slate-700">{kid.name}</span>
              <select
                name="vendorId"
                defaultValue={kid.quickbooksVendorId ?? ""}
                disabled={loadError}
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">Not mapped</option>
                {loadError && kid.quickbooksVendorId && (
                  <option value={kid.quickbooksVendorId}>Current mapping (vendor list unavailable)</option>
                )}
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.displayName}
                  </option>
                ))}
              </select>
              <button
                disabled={loadError}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 active:scale-95 disabled:opacity-50"
              >
                Save
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
