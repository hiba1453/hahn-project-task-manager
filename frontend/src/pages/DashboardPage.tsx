// src/pages/DashboardPage.tsx
import { useEffect, useMemo, useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppShell from "../components/AppShell";
import GradientBackdrop from "../components/GradientBackdrop";
import GlassCard from "../components/GlassCard";
import ProgressBar from "../components/ProgressBar";
import StatCard from "../components/StatCard";
import { getMyProjects, createProject, getProjectProgressSafe } from "../api/endpoints";
import type { Project, ProjectProgress } from "../api/types";
import { useNavigate } from "react-router-dom";

type ProjectFilter = "all" | "active" | "completed" | "empty";

export default function DashboardPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<Record<number, ProjectProgress>>({});
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const list = await getMyProjects();
      setProjects(list);

      const entries = await Promise.all(
        list.map(async (p) => {
          const pr = await getProjectProgressSafe(p.id);
          return [p.id, pr] as const;
        })
      );

      const map: Record<number, ProjectProgress> = {};
      for (const [id, pr] of entries) map[id] = pr;
      setProgress(map);
    } catch (e: any) {
      setErr(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const searched = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return projects;
    return projects.filter((p) => (p.title || "").toLowerCase().includes(s));
  }, [projects, q]);

  const filtered = useMemo(() => {
    const list = searched;

    const isEmpty = (p: Project) => (progress[p.id]?.total ?? 0) === 0;
    const isCompleted = (p: Project) => (progress[p.id]?.pct ?? 0) === 100 && (progress[p.id]?.total ?? 0) > 0;
    const isActive = (p: Project) => {
      const pr = progress[p.id];
      if (!pr) return false;
      return pr.total > 0 && pr.pct < 100;
    };

    switch (filter) {
      case "empty":
        return list.filter(isEmpty);
      case "completed":
        return list.filter(isCompleted);
      case "active":
        return list.filter(isActive);
      default:
        return list;
    }
  }, [searched, filter, progress]);

  const totals = useMemo(() => {
    const vals = Object.values(progress);
    const totalTasks = vals.reduce((a, b) => a + (b.total ?? 0), 0);
    const doneTasks = vals.reduce((a, b) => a + (b.done ?? 0), 0);
    const pct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    return { totalTasks, doneTasks, pct };
  }, [progress]);

  const chartData = useMemo(() => {
    // Toujours basé sur "filtered" pour coller au filtre
    return filtered.map((p) => ({
      name: p.title.length > 12 ? p.title.slice(0, 12) + "…" : p.title,
      progress: progress[p.id]?.pct ?? 0,
    }));
  }, [filtered, progress]);

  async function onCreate() {
    if (!title.trim()) return;
    setErr(null);
    try {
      await createProject({ title: title.trim(), description: description.trim() || undefined });
      setOpen(false);
      setTitle("");
      setDescription("");
      await refresh();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || "Could not create project");
    }
  }

  const countEmpty = useMemo(
    () => projects.filter((p) => (progress[p.id]?.total ?? 0) === 0).length,
    [projects, progress]
  );
  const countCompleted = useMemo(
    () => projects.filter((p) => (progress[p.id]?.pct ?? 0) === 100 && (progress[p.id]?.total ?? 0) > 0).length,
    [projects, progress]
  );
  const countActive = useMemo(
    () =>
      projects.filter((p) => {
        const pr = progress[p.id];
        return pr ? pr.total > 0 && pr.pct < 100 : false;
      }).length,
    [projects, progress]
  );

  return (
    <GradientBackdrop>
      <AppShell
        title="Dashboard"
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 2,
              background: "linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))",
            }}
          >
            New project
          </Button>
        }
      >
        <Container
          maxWidth="xl"
          sx={{
            height: "100%",
            py: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
            {/* HERO */}
            <GlassCard sx={{ p: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6, lineHeight: 1.15 }}>
                    Let&#39;s flow today.
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    Overview of your projects, tasks and progress.
                  </Typography>
                </Box>

                <TextField
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search projects"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: "100%", md: 360 } }}
                />
              </Stack>

              {/* FILTERS */}
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
                <Chip label={`All (${projects.length})`} clickable color={filter === "all" ? "primary" : "default"} onClick={() => setFilter("all")} />
                <Chip label={`Active (${countActive})`} clickable color={filter === "active" ? "primary" : "default"} onClick={() => setFilter("active")} />
                <Chip label={`Completed (${countCompleted})`} clickable color={filter === "completed" ? "primary" : "default"} onClick={() => setFilter("completed")} />
                <Chip label={`Empty (${countEmpty})`} clickable color={filter === "empty" ? "primary" : "default"} onClick={() => setFilter("empty")} />
              </Stack>

              {err && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {err}
                </Typography>
              )}
            </GlassCard>

            {/* GRID */}
            <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
              {/* LEFT MAIN */}
              <Grid item xs={12} md={8} sx={{ minHeight: 0 }}>
                <GlassCard
                  sx={{
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        Projects
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {filtered.length} project(s) — click to open
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => setOpen(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 2,
                        background: "linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))",
                      }}
                    >
                      New project
                    </Button>
                  </Stack>

                  {/* CONTENT */}
                  <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", pr: 0.5 }}>
                    {loading ? (
                      <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
                        <CircularProgress />
                      </Box>
                    ) : filtered.length === 0 ? (
                      <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
                        <Box sx={{ textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 900 }}>No projects here.</Typography>
                          <Typography color="text.secondary">Try another filter or create a project.</Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Grid container spacing={2}>
                        {filtered.map((p) => {
                          const pr = progress[p.id] ?? { total: 0, done: 0, pct: 0 };
                          return (
                            <Grid key={p.id} item xs={12} sm={6}>
                              <GlassCard
                                onClick={() => nav(`/projects/${p.id}`)}
                                sx={{
                                  p: 2,
                                  cursor: "pointer",
                                  borderRadius: 2,
                                  transition: "transform .16s ease, box-shadow .16s ease",
                                  "&:hover": { transform: "translateY(-2px)" },
                                }}
                              >
                                <Stack spacing={1}>
                                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                                    <Typography sx={{ fontWeight: 900, lineHeight: 1.2 }} noWrap>
                                      {p.title}
                                    </Typography>
                                    <Chip label={`${pr.pct}%`} size="small" />
                                  </Box>

                                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 36 }}>
                                    {p.description || "No description"}
                                  </Typography>

                                  <ProgressBar value={pr.pct} />
                                  <Typography variant="caption" color="text.secondary">
                                    {pr.done}/{pr.total} tasks completed
                                  </Typography>
                                </Stack>
                              </GlassCard>
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  </Box>
                </GlassCard>
              </Grid>

              {/* RIGHT COLUMN */}
              <Grid item xs={12} md={4} sx={{ minHeight: 0 }}>
                <Stack spacing={2} sx={{ height: "100%", minHeight: 0 }}>
                  {/* stats */}
                  <StatCard label="Projects" value={projects.length} hint="Active in your workspace" />
                  <StatCard label="Tasks" value={totals.totalTasks} hint="Total across projects" />
                  <StatCard label="Completed" value={`${totals.pct}%`} hint={`${totals.doneTasks}/${totals.totalTasks} done`} />

                  {/* chart */}
                  <GlassCard
                    sx={{
                      p: 2,
                      flex: 1,
                      minHeight: 0,
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontWeight: 900 }}>Progress (per project)</Typography>
                      <Chip label="%" size="small" />
                    </Box>

                    <Box sx={{ flex: 1, minHeight: 0, mt: 1 }}>
                      {loading ? (
                        <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
                          <CircularProgress size={22} />
                        </Box>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                            <defs>
                              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0B4DFF" stopOpacity={0.28} />
                                <stop offset="95%" stopColor="#17C3B2" stopOpacity={0.06} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tickMargin={8} />
                            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                            <Tooltip formatter={(v: any) => `${v}%`} />
                            <Area type="monotone" dataKey="progress" stroke="#0B4DFF" fill="url(#area)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </Box>
                  </GlassCard>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>

        {/* CREATE PROJECT */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>New project</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
              <TextField
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                minRows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              onClick={onCreate}
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: 2,
                background: "linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))",
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </AppShell>
    </GradientBackdrop>
  );
}
