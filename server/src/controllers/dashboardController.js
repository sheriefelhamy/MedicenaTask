import { PreAuthRequest } from "../models/PreAuthRequest.js";
import { calculateWaitingMinutes, serializeRequest } from "../utils/serializers.js";

function average(values) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export async function getDashboardSummary(_req, res, next) {
  try {
    const rows = await PreAuthRequest.find().lean();
    const now = new Date();

    const active = rows.filter((r) => !["approved", "rejected"].includes(r.status));
    const approvedToday = rows.filter((r) => {
      if (r.status !== "approved" || !r.resolvedAt) return false;
      return new Date(r.resolvedAt).toDateString() === now.toDateString();
    }).length;

    const waits = rows.map(calculateWaitingMinutes);
    const breached = rows.filter((r) => calculateWaitingMinutes(r) > r.slaMinutes);
    const avgApprovalTime = average(
      rows
        .filter((r) => ["approved", "rejected"].includes(r.status) && r.resolvedAt)
        .map((r) => calculateWaitingMinutes(r))
    );

    const queueAging = [
      { range: "0-15m", count: active.filter((r) => calculateWaitingMinutes(r) <= 15).length, color: "#10b981" },
      {
        range: "15-30m",
        count: active.filter((r) => calculateWaitingMinutes(r) > 15 && calculateWaitingMinutes(r) <= 30).length,
        color: "#3b82f6",
      },
      {
        range: "30-45m",
        count: active.filter((r) => calculateWaitingMinutes(r) > 30 && calculateWaitingMinutes(r) <= 45).length,
        color: "#f59e0b",
      },
      { range: "45m+", count: active.filter((r) => calculateWaitingMinutes(r) > 45).length, color: "#ef4444" },
    ];

    const insurerMap = new Map();
    for (const row of rows) {
      const key = row.insurer;
      const value = insurerMap.get(key) || { insurer: key, times: [], breaches: 0 };
      const wait = calculateWaitingMinutes(row);
      value.times.push(wait);
      if (wait > row.slaMinutes) value.breaches += 1;
      insurerMap.set(key, value);
    }
    const insurerPerformance = Array.from(insurerMap.values()).map((item) => ({
      insurer: item.insurer,
      avgTime: average(item.times),
      breaches: item.breaches,
    }));

    const adminMap = new Map();
    for (const row of rows) {
      const key = row.assignedTo;
      const value = adminMap.get(key) || { name: key, active: 0, completed: 0, breached: 0 };
      const wait = calculateWaitingMinutes(row);
      if (["approved", "rejected"].includes(row.status)) value.completed += 1;
      else value.active += 1;
      if (wait > row.slaMinutes) value.breached += 1;
      adminMap.set(key, value);
    }
    const adminWorkload = Array.from(adminMap.values());

    const worstInsurer = insurerPerformance.sort((a, b) => b.avgTime - a.avgTime)[0];

    res.json({
      data: {
        metrics: {
          pendingApprovals: active.length,
          avgApprovalTimeMinutes: avgApprovalTime || average(waits),
          slaBreaches: breached.length,
          approvedToday,
        },
        queueAging,
        insurerPerformance,
        adminWorkload,
        bottleneck:
          worstInsurer && worstInsurer.avgTime > 45
            ? `${worstInsurer.insurer} requests averaging ${worstInsurer.avgTime}m, above target SLA.`
            : "No critical bottleneck detected.",
        latestQueue: active.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((r) => serializeRequest(r)),
      },
    });
  } catch (error) {
    next(error);
  }
}
