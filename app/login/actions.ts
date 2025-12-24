"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export interface LoginFormState {
  error: string | null;
  success: boolean;
}

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Email and password are required",
      success: false,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect("/login");
}
