import { useEffect, useMemo, useState } from 'react';
import Grid from "@mui/material/Grid";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import { useNavigate, useParams } from 'react-router-dom';
import AppShell from '../components/AppShell';
import GlassCard from '../components/GlassCard';
import ProgressBar from '../components/ProgressBar';
import TaskItem from '../components/TaskItem';
import type { Project, Task } from '../api/types';
import {
  addTask,
  deleteProject,
  deleteTask,
  getProject,
  getTasks,
  toggleTask,
  updateTask
} from '../api/endpoints';
import { motion } from 'framer-motion';
import GradientBackdrop from '../components/GradientBackdrop';

function calcProgress(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export default function ProjectPage() {
  const { projectId } = useParams();
  const pid = Number(projectId);
  const nav = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const refresh = async () => {
    setError(null);
    setLoading(true);
    try {
      const [p, ts] = await Promise.all([getProject(pid), getTasks(pid)]);
      setProject(p);
      setTasks(ts);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!pid) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pid]);

  const filtered = useMemo(() => {
    const today = new Date();
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const isOverdue = (t: Task) => {
      if (!t.dueDate || t.completed) return false;
      const d = new Date(t.dueDate);
      return d < t0;
    };

    switch (tab) {
      case 1:
        return tasks.filter((t) => !t.completed);
      case 2:
        // "En cours" = not completed + due within 7 days
        return tasks.filter((t) => {
          if (t.completed) return false;
          if (!t.dueDate) return false;
          const d = new Date(t.dueDate);
          const diff = (d.getTime() - t0.getTime()) / (1000 * 3600 * 24);
          return diff >= 0 && diff <= 7;
        });
      case 3:
        return tasks.filter((t) => t.completed);
      case 4:
        return tasks.filter(isOverdue);
      default:
        return tasks;
    }
  }, [tab, tasks]);

  const progress = useMemo(() => calcProgress(tasks), [tasks]);

  const onToggle = async (taskId: number) => {
    // optimistic
    const prev = tasks;
    setTasks((xs) => xs.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
    try {
      const updated = await toggleTask(pid, taskId);
      setTasks((xs) => xs.map((t) => (t.id === taskId ? updated : t)));
    } catch (e: any) {
      setTasks(prev);
      setError(e?.response?.data?.message || e?.message || 'Network error');
    }
  };

  const onDeleteTask = async (taskId: number) => {
    const prev = tasks;
    setTasks((xs) => xs.filter((t) => t.id !== taskId));
    try {
      await deleteTask(pid, taskId);
    } catch (e: any) {
      setTasks(prev);
      setError(e?.response?.data?.message || e?.message || 'Network error');
    }
  };

  const openAdd = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setAddOpen(true);
  };

  const submitAdd = async () => {
    try {
      const created = await addTask(pid, {
        title,
        description: description || null,
        dueDate: dueDate || null
      });
      setTasks((xs) => [created, ...xs]);
      setAddOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Network error');
    }
  };

  const openEdit = (t: Task) => {
    setSelected(t);
    setTitle(t.title);
    setDescription(t.description || '');
    setDueDate(t.dueDate || '');
    setEditOpen(true);
  };

  const submitEdit = async () => {
    if (!selected) return;
    try {
      const updated = await updateTask(pid, selected.id, {
        title,
        description: description || null,
        dueDate: dueDate || null
      });
      setTasks((xs) => xs.map((t) => (t.id === updated.id ? updated : t)));
      setEditOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Network error');
    }
  };

  const onDeleteProject = async () => {
    if (!confirm('Delete this project? This will also delete its tasks.')) return;
    try {
      await deleteProject(pid);
      nav('/app');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Network error');
    }
  };

  return (
    <GradientBackdrop>
      <AppShell>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
              <IconButton onClick={() => nav('/app')}>
                <ArrowBackRoundedIcon />
              </IconButton>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {project?.title || `Project #${pid}`}
                </Typography>
                {project?.description ? (
                  <Typography color="text.secondary">{project.description}</Typography>
                ) : (
                  <Typography color="text.secondary">Manage tasks and ship results.</Typography>
                )}
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="outlined"
                startIcon={<DeleteForeverRoundedIcon />}
                color="error"
                onClick={onDeleteProject}
                sx={{ borderRadius: 999, px: 2 }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={openAdd}
                sx={{ borderRadius: 999, px: 2 }}
              >
                Add task
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mt: 3 }}>
            {loading ? (
              <Stack alignItems="center" sx={{ py: 8 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <GlassCard sx={{ p: 2.5 }}>
                      <Typography variant="h6" sx={{ fontWeight: 850 }}>
                        Progress
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {progress.done}/{progress.total} tasks completed
                      </Typography>
                      <ProgressBar value={progress.pct} label="Completion" />
                      <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                        <Chip label={`${progress.pct}%`} color="primary" />
                        <Chip label={`${tasks.filter((t) => !t.completed).length} remaining`} />
                        <Chip label={`${tasks.filter((t) => t.dueDate).length} dated`} />
                      </Stack>
                    </GlassCard>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <GlassCard sx={{ p: 2.5 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" sx={{ fontWeight: 850 }}>
                          Tasks
                        </Typography>
                        <Box sx={{ minWidth: 280 }}>
                          <Tabs
                            value={tab}
                            onChange={(_, v) => setTab(v)}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            sx={{
                              '& .MuiTabs-indicator': { height: 3, borderRadius: 999 }
                            }}
                          >
                            <Tab label={`Toutes (${tasks.length})`} />
                            <Tab label={`À faire (${tasks.filter((t) => !t.completed).length})`} />
                            <Tab label="En cours" />
                            <Tab label={`Terminées (${tasks.filter((t) => t.completed).length})`} />
                            <Tab label="En retard" />
                          </Tabs>
                        </Box>
                      </Stack>

                      <Box sx={{ mt: 2 }}>
                        {filtered.length === 0 ? (
                          <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Typography sx={{ fontWeight: 700 }}>No tasks here.</Typography>
                            <Typography color="text.secondary">Create one to start flowing.</Typography>
                          </Box>
                        ) : (
                          <Stack spacing={1.25}>
                            {filtered.map((t) => (
                              <TaskItem
                                key={t.id}
                                task={t}
                                onToggle={() => onToggle(t.id)}
                                onEdit={() => openEdit(t)}
                                onDelete={() => onDeleteTask(t.id)}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    </GlassCard>
                  </Grid>
                </Grid>

                {progress.pct === 100 && tasks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                  >
                    <GlassCard sx={{ p: 2.5, mt: 2, borderColor: 'rgba(29,186,116,0.25)' }}>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        🎉 All tasks completed!
                      </Typography>
                      <Typography color="text.secondary">
                        Nice work. Your project is ready to ship.
                      </Typography>
                    </GlassCard>
                  </motion.div>
                )}
              </>
            )}
          </Box>

          {/* Add Task */}
          <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 900 }}>New task</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <TextField
                  label="Due date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={submitAdd} disabled={!title.trim()}>
                Create
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Task */}
          <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 900 }}>Edit task</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                />
                <TextField
                  label="Due date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  fullWidth
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={submitEdit} disabled={!title.trim()}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </AppShell>
    </GradientBackdrop>
  );
}
