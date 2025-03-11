import { Box, Typography } from '@mui/material';

export default function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ textAlign: 'center', p: 1.5 }}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
}
