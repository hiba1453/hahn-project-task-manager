// src/components/Sidebar.tsx
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ChecklistRoundedIcon from "@mui/icons-material/ChecklistRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adapte si besoin

const SIDEBAR_W = 280;

function NavItem({
  to,
  icon,
  label,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
}) {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");

  return (
    <ListItemButton
      component={NavLink}
      to={to}
      sx={{
        borderRadius: 2,
        mx: 1,
        my: 0.5,
        height: 44,
        gap: 1,
        "&.active": {},
        ...(active && {
          bgcolor: "rgba(11,77,255,0.10)",
          border: "1px solid rgba(11,77,255,0.18)",
        }),
      }}
    >
      <ListItemIcon sx={{ minWidth: 36, color: active ? "primary.main" : "text.secondary" }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={label}
        primaryTypographyProps={{
          fontWeight: active ? 800 : 600,
          fontSize: 14,
        }}
      />
    </ListItemButton>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth(); // adapte si ton hook est différent

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: SIDEBAR_W,
          boxSizing: "border-box",
          borderRight: "1px solid rgba(15, 23, 42, 0.08)",
          bgcolor: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
          overflow: "hidden",
        },
      }}
    >
      {/* BRAND */}
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar
            src="/TaskFlowLogo2.png" // mets ton logo correct dans public/logo.png
            variant="rounded"
            sx={{
              width: 120,
              height: 120,
              borderRadius: 2,
              bgcolor: "rgba(11,77,255,0.08)",
            }}
          />
          <Box>
            <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>TaskFlow</Typography>
            <Typography variant="caption" color="text.secondary">
              Flow. Focus. Finish.
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* MENU */}
      <Box sx={{ px: 1, py: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: "text.secondary" }}>
          Workspace
        </Typography>
        <List sx={{ pt: 0.5 }}>
          <NavItem to="/app" icon={<DashboardRoundedIcon />} label="Dashboard" />
          <NavItem to="/projects" icon={<FolderRoundedIcon />} label="Projects" />
          <NavItem to="/tasks" icon={<ChecklistRoundedIcon />} label="Tasks" />
        </List>
      </Box>

      <Box sx={{ flex: 1 }} />

      <Divider />

      {/* USER */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar sx={{ bgcolor: "rgba(11,77,255,0.15)", color: "primary.main", fontWeight: 800 }}>
            {(user?.fullName?.[0] || user?.email?.[0] || "U").toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: 14 }} noWrap>
              {user?.fullName || "User"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ""}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <ListItemButton
            onClick={logout}
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              justifyContent: "center",
              border: "1px solid rgba(15, 23, 42, 0.08)",
            }}
          >
            <LogoutRoundedIcon fontSize="small" />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
}
