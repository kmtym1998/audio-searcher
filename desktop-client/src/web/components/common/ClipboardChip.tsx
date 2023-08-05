import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, Chip, Snackbar } from '@mui/material';
import React from 'react';

type ClipboardChipProps = {
  label: string;
  copyValue?: string;
};

export const ClipboardChip: React.FC<ClipboardChipProps> = ({
  label,
  copyValue,
}) => {
  const [open, setOpen] = React.useState(false);
  const copyToClipboard = async (v: string) => {
    await global.navigator.clipboard.writeText(v);
  };

  return (
    <>
      <Chip
        sx={{
          marginRight: '0.5rem',
          marginLeft: '0.5rem',
          paddingRight: '0.5rem',
          paddingLeft: '0.5rem',
          fontSize: '0.8rem',
          fontWeight: 'bold',
        }}
        icon={<ContentCopyIcon />}
        label={label}
        onClick={() => {
          copyToClipboard(copyValue ?? label);
          setOpen(true);
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={1500}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="success">
          <>{copyValue ?? label} をコピーしました</>
        </Alert>
      </Snackbar>
    </>
  );
};
