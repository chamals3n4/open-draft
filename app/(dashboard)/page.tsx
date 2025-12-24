import { requireAuth } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Welcome back, {user.profile?.display_name || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your content.
        </p>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium text-muted-foreground text-sm">
            Total Posts
          </h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium text-muted-foreground text-sm">
            Published
          </h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-card border rounded-xl p-6">
          <h3 className="font-medium text-muted-foreground text-sm">Drafts</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-6 flex-1">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <div className="text-center py-12 text-muted-foreground">
          <p>No recent activity</p>
          <p className="text-sm mt-1">
            Start creating content to see activity here.
          </p>
        </div>
      </div>
    </div>
  );
}
