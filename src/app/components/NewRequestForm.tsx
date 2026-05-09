import React from 'react';
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
    age: '',
    phone: '',
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
      age: formData.age ? Number(formData.age) : undefined,
      phone: formData.phone || undefined,
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
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-base">New Pre-Auth Request</h2>
        <button onClick={onClose} className="text-gray-500">
          <Close />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          <TextField
            label="Patient Name"
            fullWidth
            required
            size="small"
            value={formData.patient}
            onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Age"
              type="number"
              fullWidth
              required
              size="small"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              inputProps={{ min: 0 }}
            />

            <TextField
              label="Phone Number"
              type="tel"
              fullWidth
              required
              size="small"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g., +20 10 1234 5678"
            />
          </div>

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
        </div>

        <div className="space-y-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
          <Button type="submit" variant="contained" fullWidth startIcon={<Add />}>
            Create Request
          </Button>
          <Button variant="outlined" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
