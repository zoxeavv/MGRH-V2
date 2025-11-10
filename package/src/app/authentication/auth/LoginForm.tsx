import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const LoginForm = () => {
  return (
    <form className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          aria-describedby="email-help"
        />
        <p id="email-help" className="text-xs text-muted-foreground">
          Use your company email to sign in.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex items-center gap-2 text-muted-foreground">
          <Checkbox id="remember" defaultChecked />
          <span>Remember this device</span>
        </label>
        <Link href="/" className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full rounded-full">
        Sign in
      </Button>
    </form>
  )
}

export default LoginForm
