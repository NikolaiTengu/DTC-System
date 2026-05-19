import {
  Box,
  Button,
  Checkbox,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../api/http";

export default function UserWelcomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");
  const guestName = location.state?.guestName || sessionStorage.getItem("dtc_user_name") || "";
  const sessionId = location.state?.sessionId || sessionStorage.getItem("dtc_user_session_id") || "";
  const ticketCode = sessionStorage.getItem("dtc_user_ticket_code") || "";
  const storedProfile = sessionStorage.getItem("dtc_user_guest_profile");
  let parsedProfile = null;
  if (storedProfile) {
    try {
      parsedProfile = JSON.parse(storedProfile);
    } catch (err) {
      parsedProfile = null;
    }
  }
  const guestProfile = location.state?.guestProfile || parsedProfile || null;

  const mapAgeToOption = (ageValue) => {
    const age = Number(ageValue);
    if (!Number.isFinite(age)) return "";
    if (age >= 20 && age <= 30) return "20_30";
    if (age >= 31 && age <= 40) return "31_40";
    if (age >= 41 && age <= 50) return "41_50";
    if (age >= 51 && age <= 60) return "51_60";
    if (age > 60) return "above_60";
    return "";
  };

  const mapSexToGender = (sexValue) => {
    if (!sexValue) return "";
    const normalized = String(sexValue).trim().toLowerCase();
    if (normalized === "male") return "male";
    if (normalized === "female") return "female";
    return "";
  };

  const initialAnswers = {};
  if (guestProfile?.email) initialAnswers.email = guestProfile.email;
  if (guestProfile?.fullName) initialAnswers.participant_name = guestProfile.fullName;
  const ageOption = mapAgeToOption(guestProfile?.age);
  if (ageOption) initialAnswers.age = ageOption;
  const genderOption = mapSexToGender(guestProfile?.sex);
  if (genderOption) initialAnswers.gender = genderOption;

  const [answers, setAnswers] = useState(initialAnswers);
  const welcomeText = guestName ? `Welcome, ${guestName}!` : "Welcome!";
  const sectionCardSx = {
    p: { xs: 2, md: 2.5 },
    borderRadius: "16px",
    border: "1px solid rgba(13, 43, 107, 0.12)",
    background: "#FFFFFF",
    boxShadow: "0 12px 28px rgba(13, 43, 107, 0.08)"
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      if (ticketCode) {
        await apiFetch("/tickets/checkout", {
          method: "POST",
          body: JSON.stringify({ ticketCode, triggerFeedback: true })
        });
      } else if (sessionId) {
        await apiFetch(`/sessions/${sessionId}/checkout`, {
          method: "POST",
          body: JSON.stringify({ triggerFeedback: true })
        });
      }
    } finally {
      sessionStorage.removeItem("dtc_user_name");
      sessionStorage.removeItem("dtc_user_session_id");
      sessionStorage.removeItem("dtc_user_ticket_code");
      sessionStorage.removeItem("dtc_user_guest_profile");
      navigate("/login", { replace: true });
    }
  };

  const handleCheckoutRequest = () => {
    setFeedbackError("");
    setFeedbackOpen(true);
  };
  const handleCheckoutCancel = () => setFeedbackOpen(false);

  const handleThankYouClose = () => {
    setThankYouOpen(false);
    handleLogout();
  };

  const handleFeedbackSubmit = async () => {
    const missingRequired = feedbackQuestions
      .flatMap((group) => group.questions)
      .filter((question) => question.required)
      .some((question) => {
        const value = answers[question.id];
        if (question.type === "checkbox") {
          return !Array.isArray(value) || value.length === 0;
        }
        return value === undefined || value === null || String(value).trim() === "";
      });

    if (missingRequired) {
      setFeedbackError("Please complete all required fields before checking out.");
      return;
    }

    setFeedbackError("");
    try {
      await apiFetch("/feedback-responses", {
        method: "POST",
        body: JSON.stringify({
          visitSessionId: sessionId || null,
          submittedByType: "guest",
          answers
        })
      });
      setFeedbackOpen(false);
      setThankYouOpen(true);
    } catch (err) {
      setFeedbackError(err.message || "Unable to submit feedback. Please try again.");
    }
  };

  const ratingOptions = [
    { value: "5", label: "5 - Excellent" },
    { value: "4", label: "4 - Very Satisfactory" },
    { value: "3", label: "3 - Satisfactory" },
    { value: "2", label: "2 - Fair" },
    { value: "1", label: "1 - Poor / Needs Improvement" }
  ];

  const regionProvinceMap = {
    region_i: ["Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan"],
    region_ii: ["Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino"],
    region_iii: ["Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales"],
    region_iva: ["Cavite", "Laguna", "Batangas", "Rizal", "Quezon"],
    region_ivb: ["Occidental Mindoro", "Oriental Mindoro", "Marinduque", "Romblon", "Palawan"],
    region_v: ["Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon"],
    region_vi: ["Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental"],
    region_vii: ["Bohol", "Cebu", "Negros Oriental", "Siquijor"],
    region_viii: ["Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte"],
    region_ix: ["Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay"],
    region_x: ["Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental"],
    region_xi: ["Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental"],
    region_xii: ["Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat"],
    region_xiii: ["Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur"],
    ncr: [
      "City of Manila",
      "Caloocan",
      "Las Pinas",
      "Makati",
      "Malabon",
      "Mandaluyong",
      "Marikina",
      "Muntinlupa",
      "Navotas",
      "Paranaque",
      "Pasay",
      "Pasig",
      "Pateros",
      "Quezon City",
      "San Juan",
      "Taguig",
      "Valenzuela"
    ]
  };

  const feedbackQuestions = [
    {
      title: "Data Privacy Agreement",
      description: "Per Section 2 (Declaration of Policy) of the Data Privacy Act of 2012, please confirm your agreement.",
      questions: [
        {
          id: "privacy_agreement",
          label: "I agree to the Data Privacy Act statement and certification requirements.",
          type: "checkbox",
          required: true,
          options: [{ label: "Agree", value: "agree" }]
        }
      ]
    },
    {
      title: "Personal Information",
      description:
        "Please ensure that you have typed the correct spelling of your name (Last Name, First Name, Middle Name) and mailing address.",
      questions: [
        { id: "email", label: "Email", type: "short_text", required: true },
        { id: "participant_name", label: "Participant's Name", type: "short_text", required: true },
        {
          id: "region",
          label: "Region",
          type: "multiple_choice",
          required: true,
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
        { id: "province", label: "Province", type: "multiple_choice", required: true, options: [] },
        {
          id: "age",
          label: "Age",
          type: "multiple_choice",
          required: true,
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
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Prefer not to answer", value: "prefer_not" }
          ]
        },
        { id: "citizenship", label: "Citizenship", type: "short_text", required: true },
        {
          id: "agency_office",
          label: "Agency/Office",
          type: "multiple_choice",
          required: true,
          options: [
            { label: "NGA", value: "nga" },
            { label: "SUC (Personnel)", value: "suc_personnel" },
            { label: "LGU", value: "lgu" },
            { label: "SUC/HEI (Student)", value: "suc_hei_student" },
            { label: "GOCC", value: "gocc" },
            { label: "Others", value: "others" }
          ]
        }
      ]
    },
    {
      title: "",
      description: "",
      questions: [
        {
          id: "social_category",
          label: "Social Category (Choose all that apply)",
          type: "checkbox",
          required: true,
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
        { id: "social_category_other", label: "Social Category (Other)", type: "short_text", required: false }
      ]
    },
    {
      title: "Course Evaluation",
      description: "Please rate each item on a 5-1 scale (5 is the highest and 1 is the lowest).",
      questions: [
        { id: "relevance_current_work", label: "Relevance to your current work", type: "rating", required: true },
        { id: "relevance_future_work", label: "Relevance to your future / desired work", type: "rating", required: true },
        { id: "relevance_institution", label: "Relevance to your institution's / agency's goals", type: "rating", required: true },
        { id: "info_amount", label: "Amount of information covered in the course", type: "rating", required: true },
        { id: "info_useful", label: "Extent to which you gained ideas useful to your work", type: "rating", required: true },
        { id: "info_new_skills", label: "Extent to which you have acquired new skills", type: "rating", required: true },
        { id: "info_expectations", label: "Extent that this course / training / seminar met your expectations", type: "rating", required: true },
        { id: "design_objectives", label: "Effectiveness of the course / training / seminar objectives", type: "rating", required: true },
        { id: "design_visual_aids", label: "Effectiveness of the visual aids in reinforcing learning", type: "rating", required: true },
        { id: "design_time_topics", label: "Adequacy of time allotted to each topic", type: "rating", required: true },
        { id: "design_sequence", label: "Logic in the progression or sequence of topics", type: "rating", required: true },
        { id: "design_discussion_time", label: "Time allotted for discussions and Q and A", type: "rating", required: true },
        { id: "design_methods", label: "Variety of the training methods used", type: "rating", required: true },
        { id: "interaction_encouragement", label: "Effectiveness of the resource person / trainer in encouraging interaction", type: "rating", required: true },
        { id: "interaction_responsiveness", label: "Responsiveness of the resource person / trainer to questions", type: "rating", required: true },
        { id: "interaction_participants", label: "Interaction between participants and resource person / trainer", type: "rating", required: true }
      ]
    },
    {
      title: "Resource Person / Trainer Evaluation",
      description: "Please rate each item on a 5-1 scale (5 is the highest and 1 is the lowest).",
      questions: [
        { id: "mastery_knowledge", label: "Knowledge about the subject matter", type: "rating", required: true },
        { id: "mastery_organized", label: "Presents topics in a well-organized manner", type: "rating", required: true },
        { id: "mastery_current", label: "Injects current developments relevant to the subject", type: "rating", required: true },
        { id: "mastery_notes", label: "Uses notes wisely", type: "rating", required: true },
        { id: "methodology_explain", label: "Able to explain theories and concepts clearly", type: "rating", required: true },
        { id: "methodology_exercises", label: "Gives adequate exercises / assignments", type: "rating", required: true },
        { id: "methodology_materials", label: "Utilizes instructional materials effectively", type: "rating", required: true },
        { id: "methodology_questions", label: "Encourages participants to raise questions", type: "rating", required: true },
        { id: "methodology_time", label: "Makes use of time efficiently", type: "rating", required: true },
        { id: "communication_voice", label: "Projects a clear and audible voice", type: "rating", required: true },
        { id: "communication_clarity", label: "Expresses his / her ideas clearly, fluently and spontaneously", type: "rating", required: true },
        { id: "class_inspire", label: "Able to inspire and maintain the participants' interest", type: "rating", required: true },
        { id: "class_help", label: "Willingness to help in the participant's learning", type: "rating", required: true },
        { id: "class_open", label: "Open to criticism and gives / accepts suggestions", type: "rating", required: true },
        { id: "class_discipline", label: "Able to maintain class / classroom discipline", type: "rating", required: true },
        { id: "quality_time", label: "Follows the time duration (class hours)", type: "rating", required: true },
        { id: "quality_dress", label: "Dresses neatly and appropriately", type: "rating", required: true },
        { id: "quality_courteous", label: "Courteous in answering the participant's questions", type: "rating", required: true },
        { id: "quality_authority", label: "Projects image of authority", type: "rating", required: true }
      ]
    },
    {
      title: "Other Comments",
      description: "Please share any additional feedback.",
      questions: [
        { id: "other_comments", label: "Other Comments", type: "long_text", required: true }
      ]
    }
  ];

  const updateAnswer = (id, value) => {
    if (id === "region") {
      setAnswers((current) => ({ ...current, region: value, province: "" }));
      return;
    }
    setAnswers((current) => ({ ...current, [id]: value }));
  };

  const toggleCheckbox = (id, value) => {
    setAnswers((current) => {
      const existing = Array.isArray(current[id]) ? current[id] : [];
      if (id === "social_category") {
        if (value === "not_applicable") {
          const next = existing.includes(value) ? [] : [value];
          return { ...current, [id]: next };
        }
        const withoutNotApplicable = existing.filter((item) => item !== "not_applicable");
        const next = withoutNotApplicable.includes(value)
          ? withoutNotApplicable.filter((item) => item !== value)
          : [...withoutNotApplicable, value];
        return { ...current, [id]: next };
      }
      const next = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];
      return { ...current, [id]: next };
    });
  };

  const hasPrivacyAgreement = Array.isArray(answers.privacy_agreement)
    && answers.privacy_agreement.includes("agree");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        height: "100vh",
        px: { xs: 2, md: 4 },
        py: { xs: 5, md: 8 },
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
        position: "relative",
        background:
          "radial-gradient(circle at 12% 12%, rgba(13, 43, 107, 0.12), transparent 35%), radial-gradient(circle at 88% 18%, rgba(204, 32, 39, 0.12), transparent 35%), linear-gradient(180deg, #F6F8FD 0%, #EEF3FA 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.35,
          backgroundImage: "radial-gradient(circle, rgba(13, 43, 107, 0.12) 1px, transparent 1px)",
          backgroundSize: "26px 26px"
        }
      }}
    >
      <Box sx={{ width: "min(1100px, 100%)", position: "relative", zIndex: 1 }}>
        <div className="page-stack page-content">
          <div className="panel">
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 2,
                pb: 2.5,
                borderBottom: "1px solid rgba(13, 43, 107, 0.12)"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  component="img"
                  src="/DICT-Logo-2.png"
                  alt="DICT logo"
                  sx={{
                    width: { xs: 52, md: 60 },
                    height: { xs: 52, md: 60 },
                    borderRadius: "16px",
                    p: 1,
                    background: "#FFFFFF",
                    border: "1px solid rgba(13, 43, 107, 0.15)",
                    boxShadow: "0 8px 20px rgba(13, 43, 107, 0.12)"
                  }}
                />
                <Box>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "#0D2B6B",
                      fontWeight: 700,
                      letterSpacing: "0.24em",
                      display: "block"
                    }}
                  >
                    DICT DTC
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "#0D2B6B", mb: 0.5 }}>
                    {welcomeText}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#4B5E7D", fontWeight: 600 }}>
                    Digital Transformation Center
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                endIcon={<LogoutIcon />}
                onClick={handleCheckoutRequest}
                disabled={isLoggingOut}
                sx={{
                  borderColor: "var(--color-border)",
                  color: "#0D2B6B",
                  borderWidth: "1.5px",
                  textTransform: "none",
                  alignSelf: { xs: "flex-start", md: "center" },
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    borderColor: "#CC2027",
                    color: "#CC2027",
                  },
                }}
              >
                Checkout
              </Button>
            </Box>
            <Box sx={{ mt: 3, display: "grid", gap: 2.5 }}>
              <Box sx={sectionCardSx}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0D2B6B", mb: 0.5 }}>
                  Mission
                </Typography>
                <Typography variant="body1" sx={{ color: "#0D2B6B", fontWeight: 700 }}>
                  "DICT of the people and for the people."
                </Typography>
                <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 600, mt: 1.5 }}>
                  The Department of Information and Communications Technology commits to:
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 3, color: "#0D2B6B", display: "grid", gap: 0.5 }}>
                  <li>Provide every Filipino access to vital ICT infostructure and services</li>
                  <li>Ensure sustainable growth of Philippine ICT-enabled industries resulting to creation of more jobs</li>
                  <li>Establish a One Digitized Government, One Nation</li>
                  <li>Support the administration in fully achieving its goals</li>
                  <li>Be the enabler, innovator, achiever and leader in pushing the country’s development and transition towards a world-class digital economy</li>
                </Box>
              </Box>

              <Box sx={sectionCardSx}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0D2B6B", mb: 0.5 }}>
                  Vision
                </Typography>
                <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 400 }}>
                  "An innovative, safe and happy nation that thrives through and is enabled by Information and Communications Technology."
                </Typography>
                <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 400, mt: 1 }}>
                  DICT aspires for the Philippines to develop and flourish through innovation and constant development of ICT in the pursuit of a progressive, safe, secured, contented and happy Filipino nation.
                </Typography>
              </Box>

              <Box sx={sectionCardSx}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#0D2B6B", mb: 0.5 }}>
                  Core Values
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 3, color: "#0D2B6B", display: "grid", gap: 0.5 }}>
                  <li>D - Dignity</li>
                  <li>I - Integrity</li>
                  <li>C - Competency and Compassion</li>
                  <li>T - Transparency</li>
                </Box>
              </Box>
            </Box>
          </div>
        </div>
      </Box>
      <Dialog
        open={feedbackOpen}
        onClose={handleCheckoutCancel}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0D2B6B" }}>Feedback</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 500, mb: 2 }}>
            Please complete the feedback before checking out.
          </Typography>
          <Box sx={{ display: "grid", gap: 2 }}>
            {feedbackQuestions.map((group) => (
              <Box
                key={group.title}
                sx={{
                  display: "grid",
                  gap: 1.5,
                  pb: 2,
                  borderBottom: "1px solid rgba(13, 43, 107, 0.12)",
                  "&:last-of-type": { borderBottom: "none", pb: 0 }
                }}
              >
                {group.title ? (
                  <Typography variant="subtitle2" sx={{ color: "#0D2B6B", fontWeight: 800 }}>
                    {group.title}
                  </Typography>
                ) : null}
                {group.description ? (
                  <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 500 }}>
                    {group.description}
                  </Typography>
                ) : null}
                {group.questions.map((question) => {
                  if (question.id === "social_category_other") {
                    const categories = answers.social_category || [];
                    if (!Array.isArray(categories) || !categories.includes("other")) {
                      return null;
                    }
                  }

                  const value = answers[question.id] || (question.type === "checkbox" ? [] : "");
                  const isDisabled = question.id !== "privacy_agreement" && !hasPrivacyAgreement;

                  return (
                    <Box key={question.id}>
                      {question.type === "short_text" ? (
                        <TextField
                          fullWidth
                          label={question.label}
                          value={value}
                          onChange={(event) => updateAnswer(question.id, event.target.value)}
                          disabled={isDisabled}
                        />
                      ) : null}

                      {question.type === "long_text" ? (
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          label={question.label}
                          value={value}
                          onChange={(event) => updateAnswer(question.id, event.target.value)}
                          disabled={isDisabled}
                        />
                      ) : null}

                      {question.type === "multiple_choice" ? (
                        (() => {
                          const isProvince = question.id === "province";
                          const regionValue = answers.region;
                          const provinceOptions = isProvince && regionValue
                            ? (regionProvinceMap[regionValue] || [])
                            : [];
                          const options = isProvince
                            ? provinceOptions.map((name) => ({ label: name, value: name }))
                            : question.options;
                          const selectDisabled = isDisabled || (isProvince && !regionValue);

                          return (
                            <TextField
                              select
                              fullWidth
                              label={question.label}
                              value={value}
                              onChange={(event) => updateAnswer(question.id, event.target.value)}
                              disabled={selectDisabled}
                            >
                              <MenuItem value="" disabled>
                                {selectDisabled ? "Select region first" : "Select"}
                              </MenuItem>
                              {options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          );
                        })()
                      ) : null}

                      {question.type === "rating" ? (
                        <FormControl fullWidth disabled={isDisabled}>
                          <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 600, mb: 0.75 }}>
                            {question.label}
                          </Typography>
                          <RadioGroup
                            row
                            value={value}
                            onChange={(event) => updateAnswer(question.id, event.target.value)}
                            sx={{ gap: 0.75, flexWrap: "wrap" }}
                          >
                            {ratingOptions.map((option) => {
                              const isSelected = value === option.value;

                              return (
                                <FormControlLabel
                                  key={option.value}
                                  value={option.value}
                                  control={<Radio size="small" />}
                                  label={option.value}
                                  sx={{
                                    m: 0,
                                    px: 1,
                                    py: 0.5,
                                    minHeight: 40,
                                    borderRadius: "999px",
                                    border: "1px solid",
                                    borderColor: isSelected ? "#0D2B6B" : "rgba(13, 43, 107, 0.18)",
                                    backgroundColor: isSelected ? "rgba(13, 43, 107, 0.08)" : "#FFFFFF",
                                    transition: "border-color 160ms ease, background-color 160ms ease",
                                    "& .MuiFormControlLabel-label": {
                                      color: "#0D2B6B",
                                      fontWeight: 700,
                                      fontSize: "0.92rem"
                                    }
                                  }}
                                />
                              );
                            })}
                          </RadioGroup>
                        </FormControl>
                      ) : null}

                      {question.type === "checkbox" ? (
                        <Box>
                          <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 600, mb: 0.5 }}>
                            {question.label}
                          </Typography>
                          <FormGroup>
                            {question.options.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                control={
                                  <Checkbox
                                    checked={value.includes(option.value)}
                                    onChange={() => toggleCheckbox(question.id, option.value)}
                                    disabled={
                                      isDisabled
                                      || (question.id === "social_category"
                                        && value.includes("not_applicable")
                                        && option.value !== "not_applicable")
                                    }
                                  />
                                }
                                label={option.label}
                                disabled={
                                  isDisabled
                                  || (question.id === "social_category"
                                    && value.includes("not_applicable")
                                    && option.value !== "not_applicable")
                                }
                              />
                            ))}
                          </FormGroup>
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
          {feedbackError ? (
            <Typography variant="caption" sx={{ color: "#CC2027", fontWeight: 600, mt: 1, display: "block" }}>
              {feedbackError}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="text"
            onClick={handleCheckoutCancel}
            sx={{ color: "#0D2B6B", fontWeight: 600, textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            endIcon={<LogoutIcon />}
            onClick={handleFeedbackSubmit}
            disabled={isLoggingOut}
            sx={{
              borderColor: "var(--color-border)",
              color: "#0D2B6B",
              borderWidth: "1.5px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderColor: "#CC2027",
                color: "#CC2027",
              },
            }}
          >
            Submit & Checkout
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={thankYouOpen} onClose={handleThankYouClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 800, color: "#0D2B6B" }}>Thank you!</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#0D2B6B", fontWeight: 500 }}>
            Thank you for your feedback. Come again to DTC.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleThankYouClose}
            sx={{
              borderColor: "var(--color-border)",
              color: "#0D2B6B",
              borderWidth: "1.5px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.06)",
                borderColor: "#CC2027",
                color: "#CC2027"
              }
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
