import Link from "next/link"

import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo"
import LoginForm from "@/app/authentication/auth/LoginForm"

const LoginPage = () => {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.12),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.12),transparent_55%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/40 bg-background/90 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your credentials to access your Modernize workspace.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <LoginForm />
          <div className="text-center text-sm text-muted-foreground">
            New to Modernize?{" "}
            <Link href="/authentication/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
