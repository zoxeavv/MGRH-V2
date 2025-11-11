'use client';

import React, { useActionState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
} from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { loginAction, type AuthActionState } from "@/app/authentication/actions";

type LoginProps = {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
  redirectTo?: string;
};

const INITIAL_STATE: AuthActionState = { status: "idle" };

const AuthLogin = ({ title, subtitle, subtext, redirectTo }: LoginProps) => {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_STATE);

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

      <Stack component="form" action={formAction} noValidate spacing={0}>
        <input type="hidden" name="redirectTo" value={redirectTo ?? ""} />
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="email"
            mb="5px"
          >
            Email
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
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Password
          </Typography>
          <CustomTextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            required
            autoComplete="current-password"
            disabled={pending}
          />
        </Box>
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked disabled={pending} />}
              label="Remember this device"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/authentication/reset"
            fontWeight={500}
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
          >
            Forgot Password?
          </Typography>
        </Stack>
        <Box>
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
            disabled={pending}
          >
            {pending ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Stack>
      {subtitle}
    </>
  );
};

export default AuthLogin;
