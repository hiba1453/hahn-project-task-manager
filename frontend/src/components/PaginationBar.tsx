import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography
} from '@mui/material';

export default function PaginationBar({
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 8, 12, 16]
}: {
  page: number; // 0-based
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const safeTotal = Math.max(1, totalPages || 1);
  const safePage = Math.min(page + 1, safeTotal);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'stretch', sm: 'center' }}
      justifyContent="space-between"
      spacing={1.25}
      sx={{ mt: 2 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
        <Typography variant="body2" color="text.secondary">
          Page {safePage} / {safeTotal}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1.25} alignItems="center" justifyContent={{ xs: 'space-between', sm: 'flex-end' }}>
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel id="page-size-label">Size</InputLabel>
          <Select
            labelId="page-size-label"
            value={pageSize}
            label="Size"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt} / page
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Pagination
          count={safeTotal}
          page={safePage}
          onChange={(_, p) => onPageChange(p - 1)}
          shape="rounded"
          color="primary"
          siblingCount={0}
          boundaryCount={1}
          disabled={safeTotal <= 1}
        />
      </Stack>
    </Stack>
  );
}
