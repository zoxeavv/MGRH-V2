"use client";

import {
  useToast,
} from "@/hooks/use-toast";
import { Box } from "@mui/material";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9999,
        p: 2,
      }}
    >
      {toasts.map((toast) => (
        <Box
          key={toast.id}
          sx={{
            mb: 1,
            p: 2,
            backgroundColor: "background.paper",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          {toast.title && <Box sx={{ fontWeight: "bold" }}>{toast.title}</Box>}
          {toast.description && <Box>{toast.description}</Box>}
        </Box>
      ))}
    </Box>
  );
}
