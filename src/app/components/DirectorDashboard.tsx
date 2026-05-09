import React from 'react';
import { Card, Chip, LinearProgress } from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccessTime,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DashboardSummary } from '../types';

export function DirectorDashboard({ summary }: { summary: DashboardSummary | null }) {
  if (!summary) {
    return <div className="h-full p-4 text-sm text-slate-500">Loading dashboard...</div>;
  }

  const metrics = [
    {
      label: 'Pending Approvals',
      value: summary.metrics.pendingApprovals,
      change: '',
      trend: 'up',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: AccessTime,
    },
    {
      label: 'Avg Approval Time',
      value: `${summary.metrics.avgApprovalTimeMinutes}m`,
      change: '',
      trend: 'down',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: TrendingDown,
    },
    {
      label: 'SLA Breaches',
      value: summary.metrics.slaBreaches,
      change: '',
      trend: 'up',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: Warning,
    },
    {
      label: 'Approved Today',
      value: summary.metrics.approvedToday,
      change: '',
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: CheckCircle,
    },
  ];

  const insurerData = summary.insurerPerformance;
  const queueAging = summary.queueAging;
  const adminWorkload = summary.adminWorkload;
  return (
    <div className="h-full space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
      <div className="mb-4">
        <h2 className="mb-1 text-xl font-semibold text-slate-900">Operations Dashboard</h2>
        <p className="text-sm text-slate-500">Live pre-authorization visibility and workload distribution</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="p-3" sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
              <div className="flex items-start justify-between mb-2">
                <div className={`p-1.5 rounded-lg ${metric.bgColor}`}>
                  <Icon className={metric.color} sx={{ fontSize: 18 }} />
                </div>
                <div className="flex items-center gap-0.5 text-xs">
                  {metric.trend === 'up' ? (
                    <TrendingUp sx={{ fontSize: 12 }} className={metric.color} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 12 }} className={metric.color} />
                  )}
                  <span className={metric.color}>{metric.change}</span>
                </div>
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-900">{metric.value}</div>
              <div className="text-xs text-slate-500">{metric.label}</div>
            </Card>
          );
        })}
      </div>

      <Card className="p-4" sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <h3 className="font-semibold text-sm mb-3">Queue Aging Distribution</h3>
        <div className="space-y-2">
          {queueAging.map((item) => (
            <div key={item.range}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-600">{item.range}</span>
                <span className="font-semibold">{item.count} requests</span>
              </div>
              <LinearProgress
                variant="determinate"
                value={(item.count / Math.max(1, summary.metrics.pendingApprovals)) * 100}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: item.color,
                    borderRadius: 3,
                  },
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4" sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <h3 className="font-semibold text-sm mb-3">Average Response Time by Insurer</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={insurerData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="insurer" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: 12,
              }}
            />
            <Bar dataKey="avgTime" radius={[4, 4, 0, 0]}>
              {insurerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.avgTime > 50 ? '#ef4444' : '#3b82f6'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 text-center text-xs text-slate-500">Minutes · SLA target: 45m</div>
      </Card>

      <Card className="p-4" sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <h3 className="font-semibold text-sm mb-3">Admin Workload</h3>
        <div className="space-y-3">
          {adminWorkload.map((admin) => (
            <div key={admin.name} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{admin.name}</span>
                <div className="flex items-center gap-2">
                  <Chip
                    label={`${admin.active} active`}
                    size="small"
                    sx={{ height: 20, fontSize: 10, backgroundColor: '#dbeafe', color: '#1e40af' }}
                  />
                  {admin.breached > 0 && (
                    <Chip
                      label={`${admin.breached} breach`}
                      size="small"
                      sx={{ height: 20, fontSize: 10, backgroundColor: '#fee2e2', color: '#991b1b' }}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle sx={{ fontSize: 12, color: '#10b981' }} />
                <span>{admin.completed} completed today</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        className="p-4 border-l-4 border-orange-500"
        sx={{ borderRadius: 3, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
      >
        <div className="flex items-start gap-3">
          <Warning className="text-orange-600" sx={{ fontSize: 20 }} />
          <div>
            <h4 className="font-semibold text-sm text-orange-900 mb-1">Delay Pattern Detected</h4>
            <p className="text-xs text-orange-700 mb-2">
              {summary.bottleneck}
            </p>
            <button className="text-xs font-medium text-orange-800 underline">View details</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
