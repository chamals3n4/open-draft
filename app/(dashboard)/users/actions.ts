"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import type { UserRole, UserStatus } from "@/lib/auth";

export interface CreateUserFormState {
  error: string | null;
  success: boolean;
  message?: string;
}

export interface UpdateUserFormState {
  error: string | null;
  success: boolean;
  message?: string;
}

export async function createUser(
  _prevState: CreateUserFormState,
  formData: FormData
): Promise<CreateUserFormState> {
  try {
    await requireRole(["admin"]);
  } catch {
    return { error: "Only admins can create users", success: false };
  }

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;
  const role = formData.get("role") as UserRole;

  if (!email || !password || !displayName || !role) {
    return { error: "All fields required", success: false };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters", success: false };
  }

  const validRoles: UserRole[] = ["admin", "editor", "contributor"];
  if (!validRoles.includes(role)) {
    return { error: "Invalid role", success: false };
  }

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to init admin client",
      success: false,
    };
  }

  const { data: authData, error: authError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    return { error: authError.message, success: false };
  }

  if (!authData.user) {
    return { error: "Failed to create user", success: false };
  }

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    display_name: displayName,
    role: role,
    status: "active" as UserStatus,
  });

  if (profileError) {
    return {
      error: `Profile creation failed: ${profileError.message}`,
      success: false,
    };
  }

  revalidatePath("/users");

  return {
    error: null,
    success: true,
    message: `User created successfully`,
  };
}

export async function updateUser(
  _prevState: UpdateUserFormState,
  formData: FormData
): Promise<UpdateUserFormState> {
  try {
    await requireRole(["admin"]);
  } catch {
    return { error: "Only admins can update users", success: false };
  }

  const userId = formData.get("userId") as string;
  const displayName = formData.get("displayName") as string;
  const role = formData.get("role") as UserRole;
  const status = formData.get("status") as UserStatus;

  if (!userId || !displayName || !role || !status) {
    return { error: "Required fields missing", success: false };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName,
      role,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/users");

  return {
    error: null,
    success: true,
    message: "User updated successfully",
  };
}

export async function deleteUser(
  userId: string
): Promise<{ error: string | null; success: boolean }> {
  try {
    await requireRole(["admin"]);
  } catch {
    return { error: "Only admins can delete users", success: false };
  }

  let adminClient;
  try {
    adminClient = createAdminClient();
  } catch (err) {
    return {
      error:
        err instanceof Error
          ? err.message
          : "Failed to initialize admin client",
      success: false,
    };
  }

  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/users");

  return { error: null, success: true };
}
