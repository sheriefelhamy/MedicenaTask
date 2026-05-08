import type { DashboardSummary, NewRequestPayload, PreAuthRequest, RequestStatus } from "../types";

const API_BASE = "/api";

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "API request failed");
  }
  return response.json();
}

export async function fetchRequests(params?: { status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  const result = await apiRequest<{ data: PreAuthRequest[] }>(`/requests${suffix}`);
  return result.data;
}

export async function createRequest(payload: NewRequestPayload) {
  const result = await apiRequest<{ data: PreAuthRequest }>("/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function updateRequestStatus(requestId: string, status: RequestStatus) {
  const result = await apiRequest<{ data: PreAuthRequest }>(`/requests/${requestId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return result.data;
}

export async function escalateRequest(requestId: string) {
  const result = await apiRequest<{ data: PreAuthRequest }>(`/requests/${requestId}/escalate`, {
    method: "PATCH",
  });
  return result.data;
}

export async function addNote(requestId: string, note: string) {
  const result = await apiRequest<{ data: PreAuthRequest }>(`/requests/${requestId}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
  return result.data;
}

export async function fetchDashboardSummary() {
  const result = await apiRequest<{ data: DashboardSummary }>("/dashboard/summary");
  return result.data;
}
