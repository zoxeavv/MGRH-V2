'use client';

import React, { useActionState } from "react";
import { Box, Typography, Button, Stack, Alert } from "@mui/material";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import {
  resetPasswordAction,
  type AuthActionState,
} from "@/app/authentication/actions";

type ResetProps = {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
};

const INITIAL_STATE: AuthActionState = { status: "idle" };

const AuthReset = ({ title, subtitle, subtext }: ResetProps) => {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    INITIAL_STATE
  );

  return (
    <>
      {title ? (
        <Typography fontWeight={700} variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      {state.status === "error" ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.message}
        </Alert>
      ) : null}

      {state.status === "success" ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          {state.message}
        </Alert>
      ) : null}

      <Box component="form" action={formAction} noValidate>
        <Stack mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
          >
            Email Address
          </Typography>
          <CustomTextField
            id="email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
            autoComplete="email"
            disabled={pending}
          />
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={pending}
        >
          {pending ? "Sending reset link..." : "Send Reset Link"}
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthReset;
