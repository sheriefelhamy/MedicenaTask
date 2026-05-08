import { useState } from 'react';
import {
  Card,
  Chip,
  IconButton,
  TextField,
} from '@mui/material';
import {
  FilterList,
  AccessTime,
  Warning,
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
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-semibold text-lg">Active Queue</h1>
          <IconButton size="small">
            <FilterList />
          </IconButton>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setFilter('escalated')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === 'escalated'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Escalated ({requests.filter((r) => r.status === 'escalated').length})
          </button>
          <button
            onClick={() => setFilter('waiting_response')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === 'waiting_response'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Waiting ({requests.filter((r) => r.status === 'waiting_response').length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({requests.filter((r) => r.status === 'pending').length})
          </button>
        </div>

        {/* Search */}
        <TextField
          size="small"
          fullWidth
          placeholder="Search patient..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
          sx={{ backgroundColor: 'white' }}
        />
      </div>

      {/* Request List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {filteredRequests.map((request) => {
          const breachingSLA = isBreachingSLA(request.waitingMinutes, request.slaMinutes);
          return (
            <Card
              key={request.id}
              onClick={() => onRequestClick(request)}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                breachingSLA ? 'border-l-4 border-red-500' : ''
              }`}
              sx={{ borderRadius: 2 }}
            >
              {/* Priority & Status Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                  <span className="font-medium text-sm">{request.patient}</span>
                </div>
                <Chip
                  label={getStatusLabel(request.status)}
                  size="small"
                  color={getStatusColor(request.status) as any}
                  sx={{ height: 20, fontSize: 10, fontWeight: 600 }}
                />
              </div>

              {/* Procedure */}
              <div className="text-sm text-gray-600 mb-2">{request.procedure}</div>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="font-medium">{request.insurer}</span>
                  </span>
                  {request.channel && (
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                      {request.channel}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{request.assignedTo}</span>
                </div>
              </div>

              {/* Waiting Time - Prominent */}
              <div
                className={`mt-3 pt-2 border-t flex items-center justify-between ${
                  breachingSLA ? 'border-red-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {breachingSLA ? (
                    <Warning sx={{ fontSize: 16, color: '#ef4444' }} />
                  ) : (
                    <AccessTime sx={{ fontSize: 16, color: '#9ca3af' }} />
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      breachingSLA ? 'text-red-600' : 'text-gray-700'
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
