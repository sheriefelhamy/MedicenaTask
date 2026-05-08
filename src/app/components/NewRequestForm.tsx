import { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import type { NewRequestPayload } from '../types';

export function NewRequestForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payload: NewRequestPayload) => Promise<void> | void;
}) {
  const [formData, setFormData] = useState({
    patient: '',
    insurer: '',
    procedure: '',
    priority: 'routine',
    assignedTo: '',
    channel: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      patient: formData.patient,
      insurer: formData.insurer,
      procedure: formData.procedure,
      priority: formData.priority as NewRequestPayload['priority'],
      assignedTo: formData.assignedTo,
      channel: formData.channel,
    });
    onClose();
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-semibold text-base">New Pre-Auth Request</h2>
        <button onClick={onClose} className="text-gray-500">
          <Close />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <TextField
          label="Patient Name"
          fullWidth
          required
          size="small"
          value={formData.patient}
          onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
        />

        <FormControl fullWidth size="small" required>
          <InputLabel>Insurer</InputLabel>
          <Select
            value={formData.insurer}
            label="Insurer"
            onChange={(e) => setFormData({ ...formData, insurer: e.target.value })}
          >
            <MenuItem value="AXA Egypt Health">AXA Egypt Health</MenuItem>
            <MenuItem value="MetLife">MetLife</MenuItem>
            <MenuItem value="NextCare">NextCare</MenuItem>
            <MenuItem value="Egyptian Engineers Syndicate Insurance">Egyptian Engineers Syndicate Insurance</MenuItem>
            <MenuItem value="Medicare">Medicare</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Procedure / Service"
          fullWidth
          required
          size="small"
          value={formData.procedure}
          onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
          placeholder="e.g., MRI Brain w/ Contrast"
        />

        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontSize: 14, mb: 1 }}>
            Priority
          </FormLabel>
          <RadioGroup
            row
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <FormControlLabel value="routine" control={<Radio size="small" />} label="Routine" />
            <FormControlLabel value="urgent" control={<Radio size="small" />} label="Urgent" />
            <FormControlLabel value="critical" control={<Radio size="small" />} label="Critical" />
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth size="small" required>
          <InputLabel>Assign To</InputLabel>
          <Select
            value={formData.assignedTo}
            label="Assign To"
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          >
            <MenuItem value="Ahmed M.">Ahmed M.</MenuItem>
            <MenuItem value="Yasmin Kh.">Yasmin Kh.</MenuItem>
            <MenuItem value="Youssef Y.">Youssef Y.</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Preferred Contact Channel</InputLabel>
          <Select
            value={formData.channel}
            label="Preferred Contact Channel"
            onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
          >
            <MenuItem value="WhatsApp">WhatsApp</MenuItem>
            <MenuItem value="Phone">Phone</MenuItem>
            <MenuItem value="Email">Email</MenuItem>
            <MenuItem value="Portal">Insurer Portal</MenuItem>
          </Select>
        </FormControl>
      </form>

      {/* Actions */}
      <div className="border-t border-gray-200 px-4 py-3 space-y-2">
        <Button
          type="submit"
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          startIcon={<Add />}
        >
          Create Request
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
