import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export function LinearProgressWithLabel(props: any) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <Box sx={{ width: '100%'}}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ width: '100%', bottom: 0, position: 'absolute', display: 'flex', alignItems: 'center', height: 40, justifyContent: 'center'}}>
        <Typography sx={{fontSize: 20}} variant="body2">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

