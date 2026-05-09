import { Drawer, IconButton, Chip, Avatar, Divider, TextField, Button } from '@mui/material';
import {
  Close,
  AccessTime,
  Phone,
  WhatsApp as WhatsAppIcon,
  Email,
  Language,
  Warning,
  TrendingUp,
  CheckCircle,
  Person,
  LocalHospital,
  Business,
  Cake,
} from '@mui/icons-material';
import { useState } from 'react';
import type { PreAuthRequest, RequestStatus, TimelineEvent } from '../types';

export function RequestDetailsDrawer({
  open,
  onClose,
  request,
  onEscalate,
  onMarkApproved,
  onMoveToWaiting,
  onAddNote,
}: {
  open: boolean;
  onClose: () => void;
  request: PreAuthRequest | null;
  onEscalate: (requestId: string) => Promise<void> | void;
  onMarkApproved: (requestId: string) => Promise<void> | void;
  onMoveToWaiting: (requestId: string, status: RequestStatus) => Promise<void> | void;
  onAddNote: (requestId: string, note: string) => Promise<void> | void;
}) {
  const [note, setNote] = useState('');
  if (!request) return null;

  const timeline: TimelineEvent[] = request.timeline || [];

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case 'WhatsApp':
        return <WhatsAppIcon sx={{ fontSize: 16 }} />;
      case 'Phone':
        return <Phone sx={{ fontSize: 16 }} />;
      case 'Email':
        return <Email sx={{ fontSize: 16 }} />;
      case 'Portal':
        return <Language sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'escalated':
        return 'error';
      case 'waiting_response':
        return 'warning';
      default:
        return 'default';
    }
  };

  const isBreachingSLA = request.waitingMinutes > request.slaMinutes;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '100%', maxWidth: 400 },
      }}
    >
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold text-base">Request Details</h2>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Patient & Status */}
          <div className="px-4 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Person sx={{ fontSize: 18, color: '#6b7280' }} />
                  <h3 className="font-semibold text-lg">{request.patient}</h3>
                </div>
                <p className="text-sm text-gray-600">ID: #{request.id.padStart(6, '0')}</p>
              </div>
              <Chip
                label={request.status.replace('_', ' ').toUpperCase()}
                size="small"
                color={getStatusColor(request.status) as any}
                sx={{ fontWeight: 600 }}
              />
            </div>

            {/* Waiting Time - Prominent */}
            <div
              className={`p-3 rounded-lg ${
                isBreachingSLA ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <AccessTime
                  sx={{ fontSize: 18, color: isBreachingSLA ? '#dc2626' : '#2563eb' }}
                />
                <span
                  className={`text-sm font-medium ${
                    isBreachingSLA ? 'text-red-900' : 'text-blue-900'
                  }`}
                >
                  Waiting {request.waitingMinutes} minutes
                </span>
              </div>
              {isBreachingSLA && (
                <div className="flex items-center gap-1.5 text-xs text-red-700">
                  <Warning sx={{ fontSize: 14 }} />
                  <span>SLA breach by {request.waitingMinutes - request.slaMinutes} minutes</span>
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-start gap-3">
              <LocalHospital sx={{ fontSize: 18, color: '#6b7280' }} />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Procedure</div>
                <div className="text-sm font-medium">{request.procedure}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Business sx={{ fontSize: 18, color: '#6b7280' }} />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Insurer</div>
                <div className="text-sm font-medium">{request.insurer}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone sx={{ fontSize: 18, color: '#6b7280' }} />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Phone Number</div>
                <div className="text-sm font-medium">{request.phone || 'Not specified'}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Cake sx={{ fontSize: 18, color: '#6b7280' }} />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Age</div>
                <div className="text-sm font-medium">
                  {request.age !== undefined && request.age !== null ? request.age : 'Not specified'}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {getChannelIcon(request.channel)}
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Contact Channel</div>
                <div className="text-sm font-medium">{request.channel || 'Not specified'}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Person sx={{ fontSize: 18, color: '#6b7280' }} />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Assigned To</div>
                <div className="flex items-center gap-2">
                  <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                    {request.assignedTo.charAt(0)}
                  </Avatar>
                  <span className="text-sm font-medium">{request.assignedTo}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp sx={{ fontSize: 18, color: '#6b7280' }} />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-0.5">Priority</div>
                <Chip
                  label={request.priority.toUpperCase()}
                  size="small"
                  color={request.priority === 'critical' ? 'error' : request.priority === 'urgent' ? 'warning' : 'default'}
                  sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
                />
              </div>
            </div>
          </div>

          <Divider />

          {/* Timeline */}
          <div className="px-4 py-4">
            <h4 className="font-semibold text-sm mb-3">Activity Timeline</h4>
            <div className="space-y-3">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        event.type === 'escalated'
                          ? 'bg-red-500'
                          : event.type === 'sent'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    />
                    {index < timeline.length - 1 && (
                      <div className="w-px h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="text-sm">{event.action}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {event.user} · {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          {/* Notes Section */}
          <div className="px-4 py-4">
            <h4 className="font-semibold text-sm mb-2">Add Note</h4>
            <TextField
              multiline
              rows={3}
              fullWidth
              size="small"
              placeholder="Add update or note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={async () => {
                if (!note.trim()) return;
                await onAddNote(request.id, note.trim());
                setNote('');
              }}
            >
              Save Note
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 px-4 py-3 space-y-2">
          {request.status !== 'escalated' && isBreachingSLA && (
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<Warning />}
              onClick={() => onEscalate(request.id)}
            >
              Escalate Now
            </Button>
          )}
          {request.status !== 'approved' && (
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CheckCircle />}
              onClick={() => onMarkApproved(request.id)}
            >
              Mark Approved
            </Button>
          )}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onMoveToWaiting(request.id, 'waiting_response')}
          >
            Update Status
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
