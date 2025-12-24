import { useEffect, useMemo, useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AppShell from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import TaskItem from '../components/TaskItem';
import StatCard from '../components/StatCard';
import PaginationBar from '../components/PaginationBar';
import { addTask, getMyProjects, getTasks, toggleTask } from '../api/endpoints';
import type { Project, Task } from '../api/types';
import { useNavigate } from 'react-router-dom';

type TaskRow = Task & { projectId: number; projectTitle: string };
type TaskFilter = 'all' | 'todo' | 'today' | 'done' | 'overdue';

function isSameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

export default function TasksPage() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [rows, setRows] = useState<TaskRow[]>([]);
  const [tab, setTab] = useState<TaskFilter>('all');
  const [q, setQ] = useState('');
  const [err, setErr] = useState<string | null>(null);

  // pagination (client-side)
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [projectId, setProjectId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const refresh = async () => {
    setLoading(true);
    setErr(null);
    try {
      const ps = await getMyProjects();
      setProjects(ps);

      const all = await Promise.all(
        ps.map(async (p) => {
          const ts = await getTasks(p.id);
          return ts.map((t) => ({ ...t, projectId: p.id, projectTitle: p.title }));
        })
      );
      setRows(all.flat());
      setPage(0); 
    } catch (e: any) {
      setErr(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const counts = useMemo(() => {
    const total = rows.length;
    const todo = rows.filter((t) => !t.completed).length;
    const done = rows.filter((t) => t.completed).length;

    const todayCount = rows.filter((t) => {
      if (!t.dueDate) return false;
      return isSameDay(new Date(t.dueDate), today);
    }).length;

    const overdue = rows.filter((t) => {
      if (!t.dueDate || t.completed) return false;
      return new Date(t.dueDate) < today;
    }).length;

    return { total, todo, done, todayCount, overdue };
  }, [rows, today]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();

    const isOverdue = (t: TaskRow) => {
      if (!t.dueDate || t.completed) return false;
      return new Date(t.dueDate) < today;
    };
    const isToday = (t: TaskRow) => {
      if (!t.dueDate) return false;
      return isSameDay(new Date(t.dueDate), today);
    };

    let list = rows;

    switch (tab) {
      case 'todo':
        list = list.filter((t) => !t.completed);
        break;
      case 'today':
        list = list.filter(isToday);
        break;
      case 'done':
        list = list.filter((t) => t.completed);
        break;
      case 'overdue':
        list = list.filter(isOverdue);
        break;
      default:
        list = list;
    }

    if (!s) return list;
    return list.filter((t) => {
      return (
        (t.title || '').toLowerCase().includes(s) ||
        (t.description || '').toLowerCase().includes(s) ||
        (t.projectTitle || '').toLowerCase().includes(s)
      );
    });
  }, [rows, tab, q, today]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered.length, pageSize]);
  const pagedItems = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // keep page in range when filters change
  useEffect(() => {
    setPage(0);
  }, [tab, q, pageSize]);

  const totals = useMemo(() => {
    const total = rows.length;
    const done = rows.filter((t) => t.completed).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [rows]);

  const onToggle = async (r: TaskRow) => {
    const prev = rows;
    setRows((xs) =>
      xs.map((t) => (t.id === r.id && t.projectId === r.projectId ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await toggleTask(r.projectId, r.id);
      setRows((xs) =>
        xs.map((t) =>
          t.id === r.id && t.projectId === r.projectId
            ? { ...updated, projectId: r.projectId, projectTitle: r.projectTitle }
            : t
        )
      );
    } catch (e: any) {
      setRows(prev);
      setErr(e?.response?.data?.message || e?.message || 'Network error');
    }
  };

  const openAdd = () => {
    setErr(null);
    setTitle('');
    setDescription('');
    setDueDate('');
    setProjectId(projects[0]?.id ?? '');
    setAddOpen(true);
  };

  const submitAdd = async () => {
    if (!projectId || !title.trim()) return;
    setErr(null);
    try {
      const created = await addTask(Number(projectId), {
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null
      });

      const p = projects.find((x) => x.id === Number(projectId));
      const row: TaskRow = {
        ...created,
        projectId: Number(projectId),
        projectTitle: p?.title ?? 'Project'
      };

      setRows((xs) => [row, ...xs]);
      setAddOpen(false);
      setPage(0);
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Could not create task');
    }
  };

  return (
    <AppShell
      title="Tasks"
      actions={
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openAdd}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))'
          }}
        >
          Add task
        </Button>
      }
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 3.5 } }}>
        <Stack spacing={2.5}>
          <GlassCard sx={{ p: 2.5 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.6 }}>
                  All tasks
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Across your projects — filter, review, and keep flow.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} sx={{ width: { xs: '100%', md: 'auto' } }}>
                <TextField
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search tasks / project"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  sx={{ width: { xs: '100%', md: 320 } }}
                />

                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={openAdd}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))'
                  }}
                >
                  Add task
                </Button>
              </Stack>
            </Stack>
          </GlassCard>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <GlassCard sx={{ p: 2.75 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5} gap={2}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Tasks
                  </Typography>

                  <Box sx={{ minWidth: { xs: 260, sm: 420 } }}>
                    <Tabs
                      value={tab}
                      onChange={(_, v) => setTab(v)}
                      variant="scrollable"
                      scrollButtons
                      allowScrollButtonsMobile
                      sx={{
                        '& .MuiTabs-indicator': { height: 3, borderRadius: 2 }
                      }}
                    >
                      <Tab value="all" label={`Toutes (${counts.total})`} />
                      <Tab value="todo" label={`À faire (${counts.todo})`} />
                      <Tab value="today" label={`Aujourd'hui (${counts.todayCount})`} />
                      <Tab value="done" label={`Terminées (${counts.done})`} />
                      <Tab value="overdue" label={`En retard (${counts.overdue})`} />
                    </Tabs>
                  </Box>
                </Stack>

                {err && (
                  <Alert severity="error" sx={{ mb: 1.5 }}>
                    {err}
                  </Alert>
                )}

                {loading ? (
                  <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
                    <CircularProgress />
                  </Box>
                ) : filtered.length === 0 ? (
                  <Box sx={{ py: 8, textAlign: 'center' }}>
                    <Typography sx={{ fontWeight: 800 }}>Nothing here.</Typography>
                    <Typography color="text.secondary">Try another filter, search, or add a task.</Typography>
                  </Box>
                ) : (
                  <>
                    <Stack spacing={1.25}>
                      {pagedItems.map((t) => (
                        <Box key={`${t.projectId}-${t.id}`}>
                          <TaskItem
                            task={t}
                            onToggle={() => onToggle(t)}
                            onEdit={() => nav(`/projects/${t.projectId}`)}
                            onDelete={() => nav(`/projects/${t.projectId}`)}
                            prefix={
                              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                                {t.projectTitle}
                              </Typography>
                            }
                          />
                        </Box>
                      ))}
                    </Stack>

                    <PaginationBar
                      page={page}
                      totalPages={totalPages}
                      pageSize={pageSize}
                      onPageChange={setPage}
                      onPageSizeChange={(s) => setPageSize(s)}
                      pageSizeOptions={[6, 8, 12, 16, 24]}
                    />
                  </>
                )}
              </GlassCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2.25}>
                <StatCard label="Projects" value={projects.length} hint="Where tasks live" />
                <StatCard label="Tasks" value={totals.total} hint="Total in workspace" />
                <StatCard label="Completed" value={`${totals.pct}%`} hint={`${totals.done}/${totals.total} done`} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>New task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Project"
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              fullWidth
              disabled={projects.length === 0}
              helperText={projects.length === 0 ? 'Create a project first' : ''}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />

            <TextField
              label="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />

            <TextField
              label="Due date (optional)"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitAdd}
            disabled={!title.trim() || !projectId}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(11,77,255,1), rgba(23,195,178,1))'
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
