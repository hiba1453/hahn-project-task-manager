// src/components/AppShell.tsx
import { ReactNode } from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar"; // (je te donne le Sidebar plus bas)

export default function AppShell({
  title,
  actions,
  children,
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "hidden" }}>
      <Sidebar />

      {/* MAIN */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: "100vh",
          overflow: "hidden", 
          display: "flex",
          flexDirection: "column",
        }}
      >
        
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden", 
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
