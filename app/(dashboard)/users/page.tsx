import { requireRole } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { UsersList } from "./users-list";

export default async function UsersPage() {
  await requireRole(["admin"]);

  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {error && (
        <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          Failed to load users: {error.message}
        </div>
      )}
      <UsersList users={users || []} />
    </div>
  );
}
