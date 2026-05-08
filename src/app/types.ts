export type RequestStatus = "pending" | "waiting_response" | "approved" | "rejected" | "escalated";
export type RequestPriority = "routine" | "urgent" | "critical";

export interface TimelineEvent {
  timestamp: string;
  action: string;
  user: string;
  type: "created" | "sent" | "note" | "status_change" | "escalated";
}

export interface PreAuthRequest {
  id: string;
  patient: string;
  insurer: string;
  procedure: string;
  status: RequestStatus;
  assignedTo: string;
  priority: RequestPriority;
  waitingMinutes: number;
  slaMinutes: number;
  createdAt: string;
  channel?: string;
  timeline?: TimelineEvent[];
}

export interface DashboardSummary {
  metrics: {
    pendingApprovals: number;
    avgApprovalTimeMinutes: number;
    slaBreaches: number;
    approvedToday: number;
  };
  queueAging: Array<{ range: string; count: number; color: string }>;
  insurerPerformance: Array<{ insurer: string; avgTime: number; breaches: number }>;
  adminWorkload: Array<{ name: string; active: number; completed: number; breached: number }>;
  bottleneck: string;
}

export interface NewRequestPayload {
  patient: string;
  insurer: string;
  procedure: string;
  priority: RequestPriority;
  assignedTo: string;
  channel?: string;
}
