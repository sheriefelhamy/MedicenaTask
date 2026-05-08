import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, required: true, default: Date.now },
    action: { type: String, required: true, trim: true },
    user: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["created", "sent", "note", "status_change", "escalated"],
      required: true,
    },
  },
  { _id: false }
);

const preAuthRequestSchema = new mongoose.Schema(
  {
    patient: { type: String, required: true, trim: true },
    insurer: { type: String, required: true, trim: true },
    procedure: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "waiting_response", "approved", "rejected", "escalated"],
      default: "pending",
      index: true,
    },
    assignedTo: { type: String, required: true, trim: true, index: true },
    priority: {
      type: String,
      enum: ["routine", "urgent", "critical"],
      default: "routine",
      index: true,
    },
    slaMinutes: { type: Number, default: 45, min: 1 },
    channel: { type: String, trim: true, default: "" },
    timeline: { type: [timelineSchema], default: [] },
    resolvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "pre_auth_requests",
  }
);

export const PreAuthRequest = mongoose.model("PreAuthRequest", preAuthRequestSchema);
