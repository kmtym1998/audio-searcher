import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';
import { useState, type PropsWithChildren } from 'react';

type DialogButtonProps = {
  buttonLabel: string;
  dialogTitle?: string;
};

export const DialogButton: React.FC<PropsWithChildren<DialogButtonProps>> = ({
  buttonLabel,
  dialogTitle,
  children,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="text" onClick={() => setOpen(true)}>
        {buttonLabel}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        {dialogTitle && (
          <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
        )}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            DONE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
