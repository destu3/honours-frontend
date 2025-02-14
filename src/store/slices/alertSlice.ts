import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

export interface AlertState {
  visible: boolean;
  message: string;
  severity: AlertSeverity;
}

const initialState: AlertState = {
  visible: false,
  message: '',
  severity: 'info',
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert(state, action: PayloadAction<{ message: string; severity?: AlertSeverity }>) {
      state.visible = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity || 'info';
    },
    hideAlert(state) {
      const previousSeverity = state.severity;
      const previousMessage = state.message;
      state.visible = false;
      state.message = previousMessage;
      state.severity = previousSeverity;
    },
  },
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
