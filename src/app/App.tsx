import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Drawer, Tabs, Tab, Button } from '@mui/material';
import {
  Dashboard,
  ViewList,
  AddCircleOutline,
  LocalHospital,
  WarningAmber,
} from '@mui/icons-material';
import { AdminQueueScreen } from './components/AdminQueueScreen';
import { DirectorDashboard } from './components/DirectorDashboard';
import { RequestDetailsDrawer } from './components/RequestDetailsDrawer';
import { NewRequestForm } from './components/NewRequestForm';
import type { DashboardSummary, NewRequestPayload, PreAuthRequest, RequestStatus } from './types';
import { addNote, createRequest, escalateRequest, fetchDashboardSummary, fetchRequests, updateRequestStatus } from './lib/api';

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<PreAuthRequest | null>(null);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [requests, setRequests] = useState<PreAuthRequest[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refreshAll = async () => {
    setRefreshing(true);
    try {
      const [requestRows, summary] = await Promise.all([fetchRequests(), fetchDashboardSummary()]);
      setRequests(requestRows);
      setDashboardSummary(summary);
      return requestRows;
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAll().catch((error) => {
      console.error(error);
    });
  }, []);

  const handleRequestClick = (request: PreAuthRequest) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleCreateRequest = async (payload: NewRequestPayload) => {
    await createRequest(payload);
    await refreshAll();
  };

  const patchStatus = async (requestId: string, status: RequestStatus) => {
    await updateRequestStatus(requestId, status);
    const rows = await refreshAll();
    setSelectedRequest(rows.find((row) => row.id === requestId) || null);
  };

  const handleEscalate = async (requestId: string) => {
    await escalateRequest(requestId);
    const rows = await refreshAll();
    setSelectedRequest(rows.find((row) => row.id === requestId) || null);
  };

  const handleAddNote = async (requestId: string, note: string) => {
    await addNote(requestId, note);
    const rows = await refreshAll();
    setSelectedRequest(rows.find((row) => row.id === requestId) || null);
  };

  const queueStats = useMemo(() => {
    const pending = requests.filter((req) => req.status === 'pending').length;
    const escalated = requests.filter((req) => req.status === 'escalated').length;
    const breached = requests.filter((req) => req.waitingMinutes > req.slaMinutes).length;
    return { pending, escalated, breached };
  }, [requests]);

  return (
    <div className="size-full flex flex-col bg-slate-50">
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-500">
                <LocalHospital sx={{ fontSize: 18 }} />
                <span className="text-xs font-semibold uppercase tracking-wide">Medicena</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">Pre-Authorization Command Center</h1>
              <p className="text-sm text-slate-600">
                Built for insurance coordinators handling high-volume requests in private hospitals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                disabled={refreshing}
                onClick={() => {
                  refreshAll().catch((error) => console.error(error));
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddCircleOutline />}
                onClick={() => setShowNewRequest(true)}
              >
                New Request
              </Button>
            </div>
          </div>

          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
              <p className="text-slate-500">Pending approvals</p>
              <p className="text-lg font-semibold text-slate-800">{queueStats.pending}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
              <p className="text-amber-700">SLA breaches</p>
              <p className="text-lg font-semibold text-amber-900">{queueStats.breached}</p>
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2">
              <p className="text-rose-700">Escalated</p>
              <p className="flex items-center gap-1 text-lg font-semibold text-rose-900">
                <WarningAmber sx={{ fontSize: 18 }} />
                {queueStats.escalated}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 pb-4 pt-3 lg:px-6">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: '1px solid #e2e8f0',
            mb: 2,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 44 },
          }}
        >
          <Tab icon={<ViewList />} iconPosition="start" label="Active Queue" />
          <Tab icon={<Dashboard />} iconPosition="start" label="Operations Dashboard" />
        </Tabs>

        <div className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {activeTab === 0 && <AdminQueueScreen onRequestClick={handleRequestClick} requests={requests} />}
          {activeTab === 1 && <DirectorDashboard summary={dashboardSummary} />}
        </div>
      </div>
      <RequestDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        request={selectedRequest}
        onEscalate={handleEscalate}
        onMarkApproved={(requestId) => patchStatus(requestId, 'approved')}
        onMoveToWaiting={patchStatus}
        onAddNote={handleAddNote}
      />

      <Drawer
        anchor="bottom"
        open={showNewRequest}
        onClose={() => setShowNewRequest(false)}
        PaperProps={{
          sx: { height: '90vh', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
        }}
      >
        <NewRequestForm
          onClose={() => setShowNewRequest(false)}
          onSubmit={handleCreateRequest}
        />
      </Drawer>
    </div>
  );
}