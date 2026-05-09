import { PreAuthRequest } from "../models/PreAuthRequest.js";
import { serializeRequest } from "../utils/serializers.js";

function currentActor(req) {
  return req.header("x-actor-name") || "System";
}

export async function getRequests(req, res, next) {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "all") query.status = status;
    if (search) query.patient = { $regex: search, $options: "i" };

    const rows = await PreAuthRequest.find(query).sort({ createdAt: -1 });
    res.json({ data: rows.map(serializeRequest) });
  } catch (error) {
    next(error);
  }
}

export async function getRequestById(req, res, next) {
  try {
    const row = await PreAuthRequest.findById(req.params.id);
    if (!row) return res.status(404).json({ message: "Request not found" });
    return res.json({ data: serializeRequest(row) });
  } catch (error) {
    next(error);
  }
}

export async function createRequest(req, res, next) {
  try {
    const { patient, age, phone, insurer, procedure, priority, assignedTo, channel } = req.body;

    if (!patient || !insurer || !procedure || !assignedTo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const actor = currentActor(req);
    const request = await PreAuthRequest.create({
      patient,
      age: age !== undefined && age !== null && age !== "" ? Number(age) : undefined,
      phone: phone || "",
      insurer,
      procedure,
      priority: priority || "routine",
      assignedTo,
      channel: channel || "",
      status: "pending",
      timeline: [
        { timestamp: new Date(), action: "Request created", user: actor, type: "created" },
        {
          timestamp: new Date(),
          action: `Sent via ${channel || "Manual"} to ${insurer}`,
          user: actor,
          type: "sent",
        },
      ],
    });

    res.status(201).json({ data: serializeRequest(request) });
  } catch (error) {
    next(error);
  }
}

export async function updateRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const request = await PreAuthRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    if (status === "approved" || status === "rejected") request.resolvedAt = new Date();
    request.timeline.push({
      timestamp: new Date(),
      action: `Status changed to ${status.replace("_", " ")}`,
      user: currentActor(req),
      type: "status_change",
    });
    await request.save();

    res.json({ data: serializeRequest(request) });
  } catch (error) {
    next(error);
  }
}

export async function escalateRequest(req, res, next) {
  try {
    const request = await PreAuthRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "escalated";
    request.timeline.push({
      timestamp: new Date(),
      action: "Escalated manually",
      user: currentActor(req),
      type: "escalated",
    });
    await request.save();

    res.json({ data: serializeRequest(request) });
  } catch (error) {
    next(error);
  }
}

export async function addRequestNote(req, res, next) {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const request = await PreAuthRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.timeline.push({
      timestamp: new Date(),
      action: `Added note: "${note}"`,
      user: currentActor(req),
      type: "note",
    });
    await request.save();

    res.json({ data: serializeRequest(request) });
  } catch (error) {
    next(error);
  }
}
