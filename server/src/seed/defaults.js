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
        { id: "email", label: "Email", type: "short_text", required: true, order: 1, options: [] },
        { id: "participant_name", label: "Participant's Name", type: "short_text", required: true, order: 2, options: [] },
        { id: "province", label: "Province", type: "short_text", required: true, order: 3, options: [] },
        {
          id: "region",
          label: "Region",
          type: "multiple_choice",
          required: true,
          order: 4,
          options: [
            { label: "REGION I - ILOCOS REGION", value: "region_i" },
            { label: "REGION II - CAGAYAN VALLEY", value: "region_ii" },
            { label: "REGION III - CENTRAL LUZON", value: "region_iii" },
            { label: "REGION IVA - CALABARZON", value: "region_iva" },
            { label: "REGION IVB - MIMAROPA REGION", value: "region_ivb" },
            { label: "REGION V - BICOL REGION", value: "region_v" },
            { label: "REGION VI - WESTERN VISAYAS", value: "region_vi" },
            { label: "REGION VII - CENTRAL VISAYAS", value: "region_vii" },
            { label: "REGION VIII - EASTERN VISAYAS", value: "region_viii" },
            { label: "REGION IX - ZAMBOANGA PENINSULA", value: "region_ix" },
            { label: "REGION X - NORTHERN MINDANAO", value: "region_x" },
            { label: "REGION XI - DAVAO REGION", value: "region_xi" },
            { label: "REGION XII - SOCCSKSARGEN", value: "region_xii" },
            { label: "REGION XIII - CARAGA", value: "region_xiii" },
            { label: "NATIONAL CAPITAL REGION", value: "ncr" }
          ]
        },
        {
          id: "age",
          label: "Age",
          type: "multiple_choice",
          required: true,
          order: 5,
          options: [
            { label: "20 - 30", value: "20_30" },
            { label: "31 - 40", value: "31_40" },
            { label: "41 - 50", value: "41_50" },
            { label: "51 - 60", value: "51_60" },
            { label: "Above 60", value: "above_60" }
          ]
        },
        {
          id: "gender",
          label: "Gender",
          type: "multiple_choice",
          required: true,
          order: 6,
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to answer", value: "prefer_not" }
          ]
        },
        { id: "citizenship", label: "Citizenship", type: "short_text", required: true, order: 7, options: [] },
        {
          id: "agency_office",
          label: "Agency/Office",
          type: "multiple_choice",
          required: true,
          order: 8,
          options: [
            { label: "NGA", value: "nga" },
            { label: "SUC (Personnel)", value: "suc_personnel" },
            { label: "LGU", value: "lgu" },
            { label: "SUC/HEI (Student)", value: "suc_hei_student" },
            { label: "GOCC", value: "gocc" },
            { label: "Others", value: "others" }
          ]
        },
        {
          id: "social_category",
          label: "Social Category (Choose all that apply)",
          type: "checkbox",
          required: true,
          order: 9,
          options: [
            { label: "Person with Disability", value: "pwd" },
            { label: "LGBTQIA+", value: "lgbtqia" },
            { label: "Senior Citizen", value: "senior" },
            { label: "Solo Parent", value: "solo_parent" },
            { label: "Indigenous People", value: "indigenous" },
            { label: "Not applicable", value: "not_applicable" },
            { label: "Other", value: "other" }
          ]
        },
        { id: "social_category_other", label: "Social Category (Other)", type: "short_text", required: false, order: 10, options: [] },
        {
          id: "privacy_agreement",
          label: "I agree to the Data Privacy Act statement and certification requirements.",
          type: "checkbox",
          required: true,
          order: 11,
          options: [{ label: "Agree", value: "agree" }]
        },
        { id: "relevance_current_work", label: "Relevance to your current work", type: "rating", required: true, order: 12, options: [] },
        { id: "relevance_future_work", label: "Relevance to your future / desired work", type: "rating", required: true, order: 13, options: [] },
        { id: "relevance_institution", label: "Relevance to your institution's / agency's goals", type: "rating", required: true, order: 14, options: [] },
        { id: "info_amount", label: "Amount of information covered in the course", type: "rating", required: true, order: 15, options: [] },
        { id: "info_useful", label: "Extent to which you gained ideas useful to your work", type: "rating", required: true, order: 16, options: [] },
        { id: "info_new_skills", label: "Extent to which you have acquired new skills", type: "rating", required: true, order: 17, options: [] },
        { id: "info_expectations", label: "Extent that this course / training / seminar met your expectations", type: "rating", required: true, order: 18, options: [] },
        { id: "design_objectives", label: "Effectiveness of the course / training / seminar objectives", type: "rating", required: true, order: 19, options: [] },
        { id: "design_visual_aids", label: "Effectiveness of the visual aids in reinforcing learning", type: "rating", required: true, order: 20, options: [] },
        { id: "design_time_topics", label: "Adequacy of time allotted to each topic", type: "rating", required: true, order: 21, options: [] },
        { id: "design_sequence", label: "Logic in the progression or sequence of topics", type: "rating", required: true, order: 22, options: [] },
        { id: "design_discussion_time", label: "Time allotted for discussions and Q and A", type: "rating", required: true, order: 23, options: [] },
        { id: "design_methods", label: "Variety of the training methods used", type: "rating", required: true, order: 24, options: [] },
        { id: "interaction_encouragement", label: "Effectiveness of the resource person / trainer in encouraging interaction", type: "rating", required: true, order: 25, options: [] },
        { id: "interaction_responsiveness", label: "Responsiveness of the resource person / trainer to questions", type: "rating", required: true, order: 26, options: [] },
        { id: "interaction_participants", label: "Interaction between participants and resource person / trainer", type: "rating", required: true, order: 27, options: [] },
        { id: "mastery_knowledge", label: "Knowledge about the subject matter", type: "rating", required: true, order: 28, options: [] },
        { id: "mastery_organized", label: "Presents topics in a well-organized manner", type: "rating", required: true, order: 29, options: [] },
        { id: "mastery_current", label: "Injects current developments relevant to the subject", type: "rating", required: true, order: 30, options: [] },
        { id: "mastery_notes", label: "Uses notes wisely", type: "rating", required: true, order: 31, options: [] },
        { id: "methodology_explain", label: "Able to explain theories and concepts clearly", type: "rating", required: true, order: 32, options: [] },
        { id: "methodology_exercises", label: "Gives adequate exercises / assignments", type: "rating", required: true, order: 33, options: [] },
        { id: "methodology_materials", label: "Utilizes instructional materials effectively", type: "rating", required: true, order: 34, options: [] },
        { id: "methodology_questions", label: "Encourages participants to raise questions", type: "rating", required: true, order: 35, options: [] },
        { id: "methodology_time", label: "Makes use of time efficiently", type: "rating", required: true, order: 36, options: [] },
        { id: "communication_voice", label: "Projects a clear and audible voice", type: "rating", required: true, order: 37, options: [] },
        { id: "communication_clarity", label: "Expresses his / her ideas clearly, fluently and spontaneously", type: "rating", required: true, order: 38, options: [] },
        { id: "class_inspire", label: "Able to inspire and maintain the participants' interest", type: "rating", required: true, order: 39, options: [] },
        { id: "class_help", label: "Willingness to help in the participant's learning", type: "rating", required: true, order: 40, options: [] },
        { id: "class_open", label: "Open to criticism and gives / accepts suggestions", type: "rating", required: true, order: 41, options: [] },
        { id: "class_discipline", label: "Able to maintain class / classroom discipline", type: "rating", required: true, order: 42, options: [] },
        { id: "quality_time", label: "Follows the time duration (class hours)", type: "rating", required: true, order: 43, options: [] },
        { id: "quality_dress", label: "Dresses neatly and appropriately", type: "rating", required: true, order: 44, options: [] },
        { id: "quality_courteous", label: "Courteous in answering the participant's questions", type: "rating", required: true, order: 45, options: [] },
        { id: "quality_authority", label: "Projects image of authority", type: "rating", required: true, order: 46, options: [] },
        { id: "other_comments", label: "Other Comments", type: "long_text", required: true, order: 47, options: [] }
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
