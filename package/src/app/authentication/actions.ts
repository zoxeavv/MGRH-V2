'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export type AuthActionState = {
  status: 'idle' | 'error' | 'success';
  message?: string;
};

const emailSchema = z.string().email('Please provide a valid email address.');

const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
  redirectTo: z.string().optional(),
});

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.'),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.'),
  redirectTo: z.string().optional(),
});

const resetSchema = z.object({
  email: emailSchema,
});

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parseResult = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo'),
  });

  if (!parseResult.success) {
    const message =
      parseResult.error.issues[0]?.message ?? 'Invalid form input.';
    return {
      status: 'error',
      message,
    };
  }

  const { email, password, redirectTo } = parseResult.data;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: 'error',
      message: error.message ?? 'Unable to sign in with provided credentials.',
    };
  }

  redirect(redirectTo && redirectTo !== '' ? redirectTo : '/');
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parseResult = registerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    redirectTo: formData.get('redirectTo'),
  });

  if (!parseResult.success) {
    const message =
      parseResult.error.issues[0]?.message ?? 'Invalid form input.';
    return {
      status: 'error',
      message,
    };
  }

  const { name, email, password, redirectTo } = parseResult.data;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return {
      status: 'error',
      message: error.message ?? 'Unable to create account. Please try again.',
    };
  }

  redirect(
    redirectTo && redirectTo !== ''
      ? redirectTo
      : '/authentication/login?status=verify-email'
  );
}

export async function resetPasswordAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parseResult = resetSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parseResult.success) {
    const message =
      parseResult.error.issues[0]?.message ?? 'Invalid form input.';
    return {
      status: 'error',
      message,
    };
  }

  const { email } = parseResult.data;
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/authentication/update-password`
      : undefined,
  });

  if (error) {
    return {
      status: 'error',
      message: error.message ?? 'Unable to start password reset.',
    };
  }

  return {
    status: 'success',
    message: 'Check your email for password reset instructions.',
  };
}

export async function logoutAction() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/authentication/login');
}
