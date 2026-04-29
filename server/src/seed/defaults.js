const crypto = require("crypto");
const env = require("../config/env");
const Role = require("../models/Role");
const User = require("../models/User");
const PcUnit = require("../models/PcUnit");
const FeedbackTemplate = require("../models/FeedbackTemplate");
const Guest = require("../models/Guest");
const VisitSession = require("../models/VisitSession");
const Event = require("../models/Event");
const EventParticipant = require("../models/EventParticipant");
const AppSetting = require("../models/AppSetting");

const permissions = [
  "manage_users",
  "manage_roles",
  "activate_users",
  "manage_guests",
  "assign_pcs",
  "manage_pcs",
  "manage_layout",
  "manage_events",
  "manage_feedback_forms",
  "trigger_feedback",
  "view_reports",
  "export_reports",
  "view_audit_logs"
];

async function seedDefaults() {
  const roleMap = {};

  const roleDefinitions = [
    {
      name: "super_admin",
      description: "Full system access",
      permissions,
      isSystem: true
    },
    {
      name: "server_operator",
      description: "Front desk and guest operations",
      permissions: ["manage_guests", "assign_pcs", "manage_events", "view_reports"],
      isSystem: true
    },
    {
      name: "event_coordinator",
      description: "Events and participants",
      permissions: ["manage_events", "manage_guests", "view_reports"],
      isSystem: true
    },
    {
      name: "report_viewer",
      description: "Read-only reports",
      permissions: ["view_reports", "view_audit_logs"],
      isSystem: true
    }
  ];

  for (const definition of roleDefinitions) {
    const role = await Role.findOneAndUpdate({ name: definition.name }, definition, {
      new: true,
      upsert: true
    });
    roleMap[definition.name] = role;
  }

  let superAdmin = await User.findOne({ email: env.superAdminEmail }).select("+password");
  if (!superAdmin) {
    superAdmin = await User.create({
      firstName: "DICT",
      lastName: "Administrator",
      email: env.superAdminEmail,
      password: env.superAdminPassword,
      position: "Super Admin",
      roleIds: [roleMap.super_admin._id],
      isActive: true
    });
  } else {
    superAdmin.firstName = "DICT";
    superAdmin.lastName = "Administrator";
    superAdmin.position = "Super Admin";
    superAdmin.roleIds = [roleMap.super_admin._id];
    superAdmin.isActive = true;
    superAdmin.password = env.superAdminPassword;
    await superAdmin.save();
  }

  let operator = await User.findOne({ email: env.serverOperatorEmail }).select("+password");
  if (!operator) {
    operator = await User.create({
      firstName: "Front Desk",
      lastName: "Operator",
      email: env.serverOperatorEmail,
      password: env.serverOperatorPassword,
      position: "Server Operator",
      roleIds: [roleMap.server_operator._id],
      isActive: true,
      createdBy: superAdmin._id,
      updatedBy: superAdmin._id
    });
  } else {
    operator.firstName = "Front Desk";
    operator.lastName = "Operator";
    operator.position = "Server Operator";
    operator.roleIds = [roleMap.server_operator._id];
    operator.isActive = true;
    operator.password = env.serverOperatorPassword;
    operator.updatedBy = superAdmin._id;
    await operator.save();
  }

  const pcDocs = [];
  for (let index = 1; index <= 10; index += 1) {
    const pc = await PcUnit.findOneAndUpdate(
      { pcCode: `PC-${String(index).padStart(2, "0")}` },
      {
        pcCode: `PC-${String(index).padStart(2, "0")}`,
        displayName: `Workstation ${index}`,
        assetTag: `DICT-DTC-${1000 + index}`,
        brand: "Lenovo",
        model: "ThinkCentre",
        hostname: `dtc-pc-${index}`,
        operatingSystem: "Windows 11",
        locationLabel: "Main DTC Room",
        roomZone: index <= 5 ? "A" : "B",
        isActive: true,
        status: "available",
        layoutX: ((index - 1) % 5) * 2,
        layoutY: index <= 5 ? 0 : 3,
        layoutWidth: 2,
        layoutHeight: 2,
        sortOrder: index,
        kioskSecret: crypto.randomBytes(16).toString("hex")
      },
      { new: true, upsert: true }
    );
    pcDocs.push(pc);
  }

  const event = await Event.findOneAndUpdate(
    { title: "Digital Literacy Training" },
    {
      title: "Digital Literacy Training",
      description: "Sample DICT training event",
      eventType: "training",
      date: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "12:00",
      venue: "DICT DTC Room",
      capacity: 30,
      personInChargeUserId: operator._id,
      resourceSpeakers: [
        {
          name: "Juan Dela Cruz",
          title: "ICT Officer",
          organization: "DICT",
          contact: "09170000000"
        }
      ],
      status: "scheduled",
      notes: "Seed event"
    },
    { new: true, upsert: true }
  );

  const feedbackTemplate = await FeedbackTemplate.findOneAndUpdate(
    { name: "Default Guest Exit Form" },
    {
      name: "Default Guest Exit Form",
      description: "Default feedback form for guest checkout",
      isActive: true,
      createdBy: superAdmin._id,
      updatedBy: superAdmin._id,
      questions: [
        { id: "q1", label: "Overall satisfaction", type: "rating", required: true, order: 1, options: [] },
        { id: "q2", label: "Was the staff helpful?", type: "yes_no", required: true, order: 2, options: [] },
        {
          id: "q3",
          label: "Services used",
          type: "checkbox",
          required: false,
          order: 3,
          options: [
            { label: "Internet", value: "internet" },
            { label: "Training", value: "training" },
            { label: "Printing", value: "printing" }
          ]
        },
        { id: "q4", label: "Comments", type: "long_text", required: false, order: 4, options: [] }
      ]
    },
    { new: true, upsert: true }
  );

  const guests = [];
  for (let index = 1; index <= 10; index += 1) {
    const guest = await Guest.findOneAndUpdate(
      { contactNumber: `091700000${index}` },
      {
        fullName: `Sample Guest ${index}`,
        contactNumber: `091700000${index}`,
        email: `guest${index}@example.com`,
        address: "Sample Barangay, Sample City",
        organization: index % 2 === 0 ? "Sample School" : "Sample Company"
      },
      { new: true, upsert: true }
    );
    guests.push(guest);
  }

  for (let index = 0; index < guests.length; index += 1) {
    await VisitSession.findOneAndUpdate(
      { guestId: guests[index]._id },
      {
        guestId: guests[index]._id,
        visitPurpose: index % 2 === 0 ? "Internet Access" : "Training Inquiry",
        wantsPc: index < 4,
        assignedPcId: index < 4 ? pcDocs[index]._id : null,
        ticketCode: index < 4 ? `SEED-${index + 1}` : null,
        sessionStatus: index < 5 ? "active" : "completed",
        checkInAt: new Date(Date.now() - index * 60 * 60 * 1000),
        checkOutAt: index >= 5 ? new Date(Date.now() - (index - 4) * 30 * 60 * 1000) : null,
        handledByUserId: operator._id,
        checkedOutByUserId: index >= 5 ? operator._id : null,
        source: "server_registration",
        eventId: index % 3 === 0 ? event._id : null,
        feedbackStatus: index >= 5 ? "completed" : "pending"
      },
      { new: true, upsert: true }
    );
  }

  await EventParticipant.findOneAndUpdate(
    { eventId: event._id, "participantSnapshot.fullName": "Sample Guest 1" },
    {
      eventId: event._id,
      guestId: guests[0]._id,
      participantSnapshot: {
        fullName: guests[0].fullName,
        contactNumber: guests[0].contactNumber,
        email: guests[0].email,
        organization: guests[0].organization
      },
      attendanceStatus: "checked_in",
      checkedInAt: new Date()
    },
    { new: true, upsert: true }
  );

  await AppSetting.findOneAndUpdate(
    { key: "roomLayout" },
    {
      key: "roomLayout",
      value: {
        name: "DICT DTC Main Room",
        width: 12,
        height: 8,
        assignmentStrategy: "sortOrder"
      },
      description: "Room layout defaults"
    },
    { new: true, upsert: true }
  );

  return { roles: roleMap, superAdmin, operator, pcCount: pcDocs.length, event, feedbackTemplate };
}

module.exports = { seedDefaults, permissions };
