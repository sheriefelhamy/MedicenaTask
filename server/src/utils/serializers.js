export function calculateWaitingMinutes(request) {
  const start = new Date(request.createdAt).getTime();
  const end = request.resolvedAt ? new Date(request.resolvedAt).getTime() : Date.now();
  return Math.max(0, Math.floor((end - start) / 60000));
}

export function serializeRequest(requestDocument) {
  const request = requestDocument.toObject ? requestDocument.toObject() : requestDocument;
  return {
    id: request._id.toString(),
    patient: request.patient,
    age: request.age,
    phone: request.phone || "",
    insurer: request.insurer,
    procedure: request.procedure,
    status: request.status,
    assignedTo: request.assignedTo,
    priority: request.priority,
    waitingMinutes: calculateWaitingMinutes(request),
    slaMinutes: request.slaMinutes,
    createdAt: request.createdAt,
    channel: request.channel || "",
    timeline: (request.timeline || []).map((event) => ({
      timestamp: event.timestamp,
      action: event.action,
      user: event.user,
      type: event.type,
    })),
  };
}
