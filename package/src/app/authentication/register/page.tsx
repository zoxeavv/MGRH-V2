import Link from "next/link"

import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo"
import RegisterForm from "@/app/authentication/auth/RegisterForm"

const RegisterPage = () => {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.15),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.15),transparent_55%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-border/40 bg-background/90 px-6 py-8 shadow-2xl backdrop-blur-md sm:px-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <Logo />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join Modernize to collaborate with your team and track performance.
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <RegisterForm />
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/authentication/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
