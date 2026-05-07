import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function EmptyState({ icon, message }) {
  const Icon = icon;

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', gap: 1.25, py: 3 }} className="empty-state">
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          bgcolor: 'rgba(255,255,255,0.08)',
          color: '#FFFFFF',
        }}
      >
        {Icon ? <Icon fontSize="small" /> : null}
      </Box>
      <Typography variant="body2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
        {message}
      </Typography>
    </Box>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func]),
  message: PropTypes.string,
};

EmptyState.defaultProps = {
  icon: null,
  message: 'No data available.',
};
