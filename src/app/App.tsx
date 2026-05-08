import { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Drawer, Fab } from '@mui/material';
import {
  Dashboard,
  ViewList,
  Add,
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

  const refreshAll = async () => {
    const [requestRows, summary] = await Promise.all([fetchRequests(), fetchDashboardSummary()]);
    setRequests(requestRows);
    setDashboardSummary(summary);
    return requestRows;
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

  return (
    <div className="size-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-4 shadow-md">
        <h1 className="font-bold text-lg">Medicena Pre-Auth</h1>
        <p className="text-xs text-blue-100 mt-0.5">Command Center</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 0 && <AdminQueueScreen onRequestClick={handleRequestClick} requests={requests} />}
        {activeTab === 1 && <DirectorDashboard summary={dashboardSummary} />}
      </div>

      {/* FAB for New Request */}
      {activeTab === 0 && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setShowNewRequest(true)}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
          }}
        >
          <Add />
        </Fab>
      )}

      {/* Bottom Navigation */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
          }}
        >
          <BottomNavigationAction label="Queue" icon={<ViewList />} />
          <BottomNavigationAction label="Dashboard" icon={<Dashboard />} />
        </BottomNavigation>
      </Paper>

      {/* Request Details Drawer */}
      <RequestDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        request={selectedRequest}
        onEscalate={handleEscalate}
        onMarkApproved={(requestId) => patchStatus(requestId, 'approved')}
        onMoveToWaiting={patchStatus}
        onAddNote={handleAddNote}
      />

      {/* New Request Drawer */}
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