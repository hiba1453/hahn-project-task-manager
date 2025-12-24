import { useEffect, useMemo, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
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
  Typography
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import PaginationBar from '../components/PaginationBar';
import { createProject, getMyProjects, getProjectProgressSafe } from '../api/endpoints';
import type { Project, ProjectProgress } from '../api/types';

type ProjectFilter = 'all' | 'active' | 'completed' | 'empty';

export default function ProjectsPage() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<Record<number, ProjectProgress>>({});

  // client pagination
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<ProjectFilter>('all');

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setErr(null);
    try {
      const list = await getMyProjects();
      setProjects(list);
      setPage(0);

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
      setErr(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const searched = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return projects;
    return projects.filter((p) => (p.title || '').toLowerCase().includes(s));
  }, [projects, q]);

  const filtered = useMemo(() => {
    const isEmpty = (p: Project) => (progress[p.id]?.total ?? 0) === 0;
    const isCompleted = (p: Project) => (progress[p.id]?.pct ?? 0) === 100 && (progress[p.id]?.total ?? 0) > 0;
    const isActive = (p: Project) => {
      const pr = progress[p.id];
      return pr ? pr.total > 0 && pr.pct < 100 : false;
    };

    switch (filter) {
      case 'empty':
        return searched.filter(isEmpty);
      case 'completed':
        return searched.filter(isCompleted);
      case 'active':
        return searched.filter(isActive);
      default:
        return searched;
    }
  }, [searched, filter, progress]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);
  const paged = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [q, filter, pageSize]);

  const totals = useMemo(() => {
    const vals = Object.values(progress);
    const totalTasks = vals.reduce((a, b) => a + (b.total ?? 0), 0);
    const doneTasks = vals.reduce((a, b) => a + (b.done ?? 0), 0);
    const pct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);
    return { totalTasks, doneTasks, pct };
  }, [progress]);

  const onCreate = async () => {
    if (!title.trim()) return;
    setErr(null);
    try {
      await createProject({ title: title.trim(), description: description.trim() || undefined });
      setOpen(false);
      setTitle('');
      setDescription('');
      await refresh();
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Could not create project');
    }
  };

  return (
    <AppShell
      title="Projects"
      actions={
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))'
          }}
        >
          New project
        </Button>
      }
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={2.5}>
          <GlassCard sx={{ p: 2.5 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
                  Your workspace
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Create projects, manage tasks, and keep progress.
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
                  )
                }}
                sx={{ width: { xs: '100%', md: 360 } }}
              />
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
              <Chip label={`All (${searched.length})`} clickable color={filter === 'all' ? 'primary' : 'default'} onClick={() => setFilter('all')} />
              <Chip label="Active" clickable color={filter === 'active' ? 'primary' : 'default'} onClick={() => setFilter('active')} />
              <Chip label="Completed" clickable color={filter === 'completed' ? 'primary' : 'default'} onClick={() => setFilter('completed')} />
              <Chip label="Empty" clickable color={filter === 'empty' ? 'primary' : 'default'} onClick={() => setFilter('empty')} />
            </Stack>
          </GlassCard>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <GlassCard sx={{ p: 2.75 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Projects
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setOpen(true)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))'
                    }}
                  >
                    Add
                  </Button>
                </Stack>

                {err && (
                  <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                    {err}
                  </Typography>
                )}

                {loading ? (
                  <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : paged.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>No projects here.</Typography>
                    <Typography color="text.secondary">Try another filter or create a project.</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2.5}>
                    {paged.map((p) => {
                      const pr = progress[p.id] ?? { total: 0, done: 0, pct: 0 };
                      return (
                        <Grid key={p.id} item xs={12} sm={6}>
                          <GlassCard
                            sx={{ p: 2.25, cursor: 'pointer', '&:hover': { transform: 'translateY(-2px)' }, transition: 'transform .15s ease' }}
                            onClick={() => nav(`/projects/${p.id}`)}
                          >
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                <Typography sx={{ fontWeight: 900, fontSize: 16 }} noWrap>
                                  {p.title}
                                </Typography>
                                <Chip label={`${pr.pct}%`} size="small" />
                              </Box>

                              <Typography color="text.secondary" variant="body2" sx={{ minHeight: 40 }}>
                                {p.description || 'No description'}
                              </Typography>

                              <ProgressBar value={pr.pct} label="Completion" />
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

                <PaginationBar
                  page={page}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                  pageSizeOptions={[6, 8, 12, 16, 24]}
                />
              </GlassCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2.25}>
                <StatCard label="Projects" value={projects.length} hint="Active in your workspace" />
                <StatCard label="Tasks" value={totals.totalTasks} hint="Total across projects" />
                <StatCard label="Completed" value={`${totals.pct}%`} hint={`${totals.doneTasks}/${totals.totalTasks} done`} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>New project</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus required />
            <TextField label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} multiline minRows={3} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={onCreate}
            variant="contained"
            disabled={!title.trim()}
            sx={{ textTransform: 'none', borderRadius: 2, background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))' }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
