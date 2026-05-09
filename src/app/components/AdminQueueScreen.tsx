import React from 'react';
import { useState } from 'react';
import {
  Card,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  AccessTime,
  Warning,
  Phone,
  Search,
} from '@mui/icons-material';
import type { PreAuthRequest } from '../types';

export function AdminQueueScreen({
  onRequestClick,
  requests,
}: {
  onRequestClick: (request: PreAuthRequest) => void;
  requests: PreAuthRequest[];
}) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'urgent':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const isBreachingSLA = (waitingMinutes: number, slaMinutes: number) => {
    return waitingMinutes > slaMinutes;
  };

  const filteredRequests = requests.filter((req) => {
    if (filter !== 'all' && req.status !== filter) return false;
    if (searchTerm && !req.patient.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white px-4 py-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Work Queue</h2>
          <p className="text-xs text-slate-500">Select a request to review history and update status</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('escalated')}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === 'escalated'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Escalated ({requests.filter((r) => r.status === 'escalated').length})
          </button>
          <button
            onClick={() => setFilter('waiting_response')}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === 'waiting_response'
                ? 'bg-orange-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Waiting ({requests.filter((r) => r.status === 'waiting_response').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending ({requests.filter((r) => r.status === 'pending').length})
          </button>
        </div>

        <TextField
          size="small"
          fullWidth
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white', borderRadius: 2 }}
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {filteredRequests.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            No requests match this filter.
          </div>
        )}
        {filteredRequests.map((request) => {
          const breachingSLA = isBreachingSLA(request.waitingMinutes, request.slaMinutes);
          return (
            <Card
              key={request.id}
              onClick={() => onRequestClick(request)}
              className={`cursor-pointer p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                breachingSLA ? 'border-l-4 border-red-500' : ''
              }`}
              sx={{ borderRadius: 3, borderColor: '#e2e8f0' }}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                  <span className="text-sm font-semibold text-slate-800">{request.patient}</span>
                </div>
                <Chip
                  label={getStatusLabel(request.status)}
                  size="small"
                  color={getStatusColor(request.status) as any}
                  sx={{ height: 20, fontSize: 10, fontWeight: 600 }}
                />
              </div>

              <div className="mb-2 text-sm text-slate-600">{request.procedure}</div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-slate-700">{request.insurer}</span>
                  </span>
                  {request.channel && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
                      {request.channel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{request.assignedTo}</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                {request.age !== undefined && request.age !== null && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700">
                    Age: {request.age}
                  </span>
                )}
                {request.phone && (
                  <span className="flex items-center gap-1">
                    <Phone sx={{ fontSize: 12 }} />
                    {request.phone}
                  </span>
                )}
              </div>

              <div
                className={`mt-3 flex items-center justify-between border-t pt-2 ${
                  breachingSLA ? 'border-red-200' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {breachingSLA ? (
                    <Warning sx={{ fontSize: 16, color: '#ef4444' }} />
                  ) : (
                    <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      breachingSLA ? 'text-red-600' : 'text-slate-700'
                    }`}
                  >
                    {formatWaitTime(request.waitingMinutes)}
                  </span>
                  {breachingSLA && (
                    <span className="text-xs text-red-500">
                      (SLA breach +{request.waitingMinutes - request.slaMinutes}m)
                    </span>
                  )}
                </div>

                {request.priority === 'critical' && (
                  <Chip
                    label="CRITICAL"
                    size="small"
                    sx={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      height: 18,
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  />
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
