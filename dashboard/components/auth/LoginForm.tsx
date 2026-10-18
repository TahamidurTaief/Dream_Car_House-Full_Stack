"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { loginAction, type LoginActionState } from "@/app/actions/auth";

export function LoginForm({ nextTarget }: { nextTarget: string }) {
  const [state, formAction, isPending] = useActionState<LoginActionState, FormData>(
    loginAction,
    {}
  );

  return (
    <div className="form-card">
      <form action={formAction} noValidate>
        <input type="hidden" name="next" value={nextTarget} />

        {state?.error && (
          <div role="alert" className="form-alert">
            {state.error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            className="form-input"
            aria-invalid={!!state?.fieldErrors?.username}
            aria-describedby={state?.fieldErrors?.username ? "username-error" : undefined}
            disabled={isPending}
          />
          {state?.fieldErrors?.username && (
            <span id="username-error" className="form-error">
              {state.fieldErrors.username}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="form-input"
            aria-invalid={!!state?.fieldErrors?.password}
            aria-describedby={state?.fieldErrors?.password ? "password-error" : undefined}
            disabled={isPending}
          />
          {state?.fieldErrors?.password && (
            <span id="password-error" className="form-error">
              {state.fieldErrors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="button"
          disabled={isPending}
          style={{
            width: "100%",
            textAlign: "center",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)",
          }}
        >
          <LogIn size={16} />
          {isPending ? "Signing in…" : "Sign in to Dashboard"}
        </button>
      </form>
    </div>
  );
}
