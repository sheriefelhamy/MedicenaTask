import { PreAuthRequest } from "../models/PreAuthRequest.js";

const defaultRequests = [
  {
    patient: "Sarah Chen",
    age: 34,
    phone: "+20 10 2854 2210",
    insurer: "AXA Egypt Health",
    procedure: "MRI Brain w/ Contrast",
    status: "escalated",
    assignedTo: "Ahmed M.",
    priority: "urgent",
    slaMinutes: 45,
    channel: "WhatsApp",
    createdAt: new Date(Date.now() - 67 * 60000),
  },
  {
    patient: "Michael Rodriguez",
    age: 59,
    phone: "+20 12 9174 3301",
    insurer: "MetLife",
    procedure: "Cardiac Catheterization",
    status: "waiting_response",
    assignedTo: "Yasmin Kh.",
    priority: "critical",
    slaMinutes: 45,
    channel: "Phone",
    createdAt: new Date(Date.now() - 28 * 60000),
  },
  {
    patient: "Jennifer Williams",
    age: 67,
    phone: "+20 11 4456 7822",
    insurer: "NextCare",
    procedure: "Hip Replacement Surgery",
    status: "pending",
    assignedTo: "Ahmed M.",
    priority: "routine",
    slaMinutes: 45,
    channel: "Portal",
    createdAt: new Date(Date.now() - 12 * 60000),
  },
  {
    patient: "David Park",
    age: 42,
    phone: "+20 15 7330 9018",
    insurer: "Egyptian Engineers Syndicate Insurance",
    procedure: "Spine Surgery Consultation",
    status: "escalated",
    assignedTo: "Youssef Y.",
    priority: "urgent",
    slaMinutes: 45,
    channel: "WhatsApp",
    createdAt: new Date(Date.now() - 52 * 60000),
  },
  {
    patient: "Emma Thompson",
    age: 29,
    phone: "+20 10 6531 4489",
    insurer: "AXA Egypt Health",
    procedure: "CT Scan Abdomen",
    status: "approved",
    assignedTo: "Yasmin Kh.",
    priority: "routine",
    slaMinutes: 45,
    channel: "Phone",
    createdAt: new Date(Date.now() - 89 * 60000),
    resolvedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    patient: "James Anderson",
    age: 51,
    phone: "+20 12 1804 6675",
    insurer: "Medicare",
    procedure: "Physical Therapy (12 sessions)",
    status: "waiting_response",
    assignedTo: "Ahmed M.",
    priority: "routine",
    slaMinutes: 45,
    channel: "Email",
    createdAt: new Date(Date.now() - 34 * 60000),
  },
];

function makeTimeline(request) {
  const createdAt = request.createdAt;
  return [
    {
      timestamp: createdAt,
      action: "Request created",
      user: request.assignedTo,
      type: "created",
    },
    {
      timestamp: new Date(createdAt.getTime() + 5 * 60000),
      action: `Sent via ${request.channel || "Manual"} to ${request.insurer}`,
      user: request.assignedTo,
      type: "sent",
    },
  ];
}

export async function seedIfEmpty() {
  const count = await PreAuthRequest.countDocuments();
  if (count > 0) return;

  const docs = defaultRequests.map((request) => ({
    ...request,
    timeline: makeTimeline(request),
  }));
  await PreAuthRequest.insertMany(docs);
}
