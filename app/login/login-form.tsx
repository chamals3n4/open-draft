"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, type LoginFormState } from "@/app/login/actions";

const initialState: LoginFormState = {
  error: null,
  success: false,
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              {state.error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isPending}
                  defaultValue={
                    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
                      ? process.env.NEXT_PUBLIC_DEMO_EMAIL
                      : ""
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                  defaultValue={
                    process.env.NEXT_PUBLIC_DEMO_MODE === "true"
                      ? process.env.NEXT_PUBLIC_DEMO_PASSWORD
                      : ""
                  }
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Signing in" : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
