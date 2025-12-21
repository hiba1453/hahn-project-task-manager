import { motion } from 'framer-motion';
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { format } from 'date-fns';
import { Task } from '../api/types';

function dueChip(task: Task) {
  if (!task.dueDate) return null;
  const d = new Date(task.dueDate + 'T00:00:00');
  const label = format(d, 'MMM d');
  const today = new Date();
  const todayNoTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = d.getTime() - todayNoTime.getTime();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  if (task.completed) return <Chip size="small" label={label} />;
  if (days < 0) return <Chip size="small" color="error" label={`Overdue • ${label}`} />;
  if (days === 0) return <Chip size="small" color="warning" label={`Today • ${label}`} />;
  if (days <= 7) return <Chip size="small" color="success" label={`This week • ${label}`} />;
  return <Chip size="small" label={label} />;
}

export default function TaskItem({
  task,
  prefix,
  onToggle,
  onEdit,
  onDelete
}: {
  task: Task;
  prefix?: React.ReactNode;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.25,
          alignItems: 'center',
          p: 1.25,
          borderRadius: 3,
          border: '1px solid rgba(15, 23, 42, 0.07)',
          background: task.completed
            ? 'linear-gradient(90deg, rgba(29,186,116,0.10), rgba(255,255,255,0.6))'
            : 'rgba(255,255,255,0.65)',
          boxShadow: '0 12px 26px rgba(2, 6, 23, 0.06)'
        }}
      >
        <Checkbox
          checked={task.completed}
          onChange={() => onToggle(task)}
          sx={{
            '& .MuiSvgIcon-root': { fontSize: 26 }
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.25, minWidth: 0 }}>
            {prefix ? <Box sx={{ flex: '0 0 auto' }}>{prefix}</Box> : null}
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.65 : 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {task.title}
            </Typography>
            {dueChip(task)}
          </Stack>
          {task.description ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {task.description}
            </Typography>
          ) : null}
        </Box>

        <Stack direction="row" spacing={0.5}>
          <IconButton onClick={() => onEdit(task)} size="small">
            <EditRoundedIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDelete(task)} size="small">
            <DeleteOutlineRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    </motion.div>
  );
}
