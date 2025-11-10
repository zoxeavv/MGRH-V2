import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const RegisterForm = () => {
  return (
    <form className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" name="name" placeholder="Jane Cooper" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          name="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          name="password"
          autoComplete="new-password"
          required
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters with a number and symbol.
        </p>
      </div>

      <div className="text-xs text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/" className="font-medium text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/" className="font-medium text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </div>

      <Button type="submit" className="w-full rounded-full">
        Create account
      </Button>
    </form>
  )
}

export default RegisterForm
