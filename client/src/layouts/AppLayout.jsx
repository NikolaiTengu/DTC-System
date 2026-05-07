import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Button,
  Stack,
  Tooltip,
  Badge,
  Avatar,
  useMediaQuery,
  Menu,
  ListItemAvatar,
  MenuItem,
} from "@mui/material";
import ErrorBoundary from "../components/ErrorBoundary";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  DashboardOutlined as DashboardOutlinedIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  BadgeOutlined as BadgeOutlinedIcon,
  PersonAddAlt1Outlined as PersonAddAlt1OutlinedIcon,
  PersonOutlined as PersonOutlinedIcon,
  HistoryOutlined as HistoryOutlinedIcon,
  ComputerOutlined as ComputerOutlinedIcon,
  GridViewOutlined as GridViewOutlinedIcon,
  EventNoteOutlined as EventNoteOutlinedIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  FeedbackOutlined as FeedbackOutlinedIcon,
  AssessmentOutlined as AssessmentOutlinedIcon,
  PolicyOutlined as PolicyOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
} from "@mui/icons-material";

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 48;

const navGroups = [
  {
    label: "Management",
    items: [
      { label: "Dashboard", href: "/", icon: DashboardOutlinedIcon, end: true },
      { label: "Users", href: "/users", icon: GroupsOutlinedIcon },
      { label: "Roles", href: "/roles", icon: BadgeOutlinedIcon },
      { label: "Register Guest", href: "/guests/register", icon: PersonAddAlt1OutlinedIcon },
      { label: "Active Guests", href: "/guests/active", icon: PersonOutlinedIcon },
      { label: "History", href: "/guests/history", icon: HistoryOutlinedIcon },
      { label: "PCs", href: "/pcs", icon: ComputerOutlinedIcon },
      { label: "Layout", href: "/layout", icon: GridViewOutlinedIcon },
      { label: "Events", href: "/events", icon: EventNoteOutlinedIcon },
      { label: "Feedback Templates", href: "/feedback/templates", icon: DescriptionOutlinedIcon },
      { label: "Feedback Responses", href: "/feedback/responses", icon: FeedbackOutlinedIcon },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Reports", href: "/reports", icon: AssessmentOutlinedIcon },
      { label: "Audit Logs", href: "/audit-logs", icon: PolicyOutlinedIcon },
      { label: "Settings", href: "/settings", icon: SettingsOutlinedIcon },
    ],
  },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width:767.95px)");
  const isCompactDesktop = useMediaQuery("(min-width:768px) and (max-width:1024px)");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const collapsed = !isMobile && (isCompactDesktop || !sidebarOpen);

  // Notifications state (mocked). Replace with API calls when backend available.
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock initial notifications
    const now = Date.now();
    setNotifications([
      { id: 1, title: "New guest registered", body: "A new guest registered at PC-12.", createdAt: now - 1000 * 60 * 5, read: false },
      { id: 2, title: "System maintenance", body: "Scheduled maintenance at 10:00 PM.", createdAt: now - 1000 * 60 * 60 * 2, read: false },
      { id: 3, title: "Report ready", body: "Monthly report is ready to download.", createdAt: now - 1000 * 60 * 60 * 24, read: true },
    ]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const formatTime = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  };

  const drawerContent = (collapsedView = false) => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #0D2B6B 0%, #0A245D 100%)",
        color: "#C8D8F5",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 2.25,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsedView ? "center" : "flex-start",
          gap: 1.25,
          minHeight: 82,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.2,
            background: "rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.8rem",
            border: "2px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        >
          DTC
        </Box>
        {!collapsedView ? (
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.15, color: "#FFFFFF", fontSize: "0.95rem" }}>
              DTC System
            </Typography>
            <Typography variant="caption" sx={{ color: "#C8D8F5", fontSize: "0.74rem" }}>
              Management dashboard
            </Typography>
          </Box>
        ) : null}
      </Box>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mx: 2 }} />
      <Box sx={{ flex: 1, overflowY: "auto", px: 1.5, py: 1.25, scrollbarWidth: "thin" }}>
        {navGroups.map((group) => (
          <Box key={group.label} sx={{ mb: 1.25 }}>
            {!collapsedView ? (
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  px: 2,
                  py: 0.75,
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.16em",
                  fontWeight: 700,
                }}
              >
                {group.label}
              </Typography>
            ) : null}

            <List sx={{ p: 0 }}>
              {group.items.map((item, index) => {
                const ItemIcon = item.icon;

                return (
                  <ListItem key={item.href} disablePadding sx={{ mb: 0.25 }}>
                    <Tooltip title={collapsedView ? item.label : ""} placement="right" arrow>
                      <ListItemButton
                        component={NavLink}
                        to={item.href}
                        end={item.end ?? false}
                        sx={{
                          borderRadius: 1.25,
                          minHeight: 44,
                          mx: 1,
                          px: collapsedView ? 1 : 1.75,
                          gap: 1.25,
                          color: "rgba(255, 255, 255, 0.85)",
                          borderLeft: "3px solid transparent",
                          transition: "all 0.2s ease",
                          animation: "navSlideIn 0.35s ease both",
                          animationDelay: `${0.04 * index}s`,
                          "&.active": {
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            borderLeftColor: "#F5C300",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                            "& .MuiListItemText-primary": {
                              fontWeight: 700,
                            },
                          },
                          "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.08)",
                            color: "#FFFFFF",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 20,
                            display: "grid",
                            placeItems: "center",
                            color: "inherit",
                            flexShrink: 0,
                          }}
                        >
                          <ItemIcon fontSize="small" />
                        </Box>
                        {!collapsedView ? (
                          <ListItemText
                            primary={item.label}
                            sx={{
                              m: 0,
                              color: "inherit",
                              "& .MuiListItemText-primary": {
                                color: "inherit",
                                fontSize: "0.92rem",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              },
                            }}
                          />
                        ) : null}
                      </ListItemButton>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--color-bg-page)",
      }}
    >
      {/* Desktop Drawer - fixed sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: isCompactDesktop ? DRAWER_COLLAPSED_WIDTH : sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          flexShrink: 0,
          whiteSpace: "nowrap",
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: isCompactDesktop ? DRAWER_COLLAPSED_WIDTH : sidebarOpen ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
            boxSizing: "border-box",
            borderRight: "none",
            backgroundColor: "#0D2B6B",
            color: "#C8D8F5",
            overflowX: "hidden",
            transition: "width 0.25s ease",
            boxShadow: "var(--shadow-lg)",
          },
        }}
      >
        {drawerContent(isCompactDesktop || !sidebarOpen)}
      </Drawer>

      {/* Mobile Drawer - toggleable */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#0D2B6B",
            color: "#C8D8F5",
          },
        }}
      >
        {drawerContent(false)}
      </Drawer>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppBar
          position="sticky"
          sx={{
            background: "#FFFFFF",
            backdropFilter: "blur(16px)",
            color: "#0D1B3E",
            boxShadow: "0 1px 0 var(--color-border), var(--shadow-sm)",
            borderBottom: "none",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64, gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                edge="start"
                onClick={toggleSidebar}
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "rgba(255, 255, 255, 0.06)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                  color: "#0D2B6B",
                  color: "#FFFFFF",
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  letterSpacing: "-0.02em",
                  color: "#0D2B6B",
                }}
              >
                DTC Management
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Badge
                badgeContent={unreadCount}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#0D2B6B",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    minWidth: 16,
                    height: 16,
                    padding: 0,
                  },
                }}
              >
                <IconButton
                  aria-label="Notifications"
                  onClick={handleBellClick}
                  sx={{
                    color: "#0D2B6B",
                    bgcolor: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                  }}
                >
                  <NotificationsOutlinedIcon fontSize="small" />
                </IconButton>
              </Badge>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{ sx: { width: 320, maxWidth: "90%" } }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Box sx={{ px: 2, py: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Notifications</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button size="small" onClick={markAllRead}>Mark all read</Button>
                    <Button size="small" onClick={handleClose}>Close</Button>
                  </Stack>
                </Box>
                <Divider />
                {notifications.length === 0 ? (
                  <MenuItem disabled>
                    <ListItemText primary="No notifications" />
                  </MenuItem>
                ) : (
                  notifications.map((n) => (
                    <MenuItem
                      key={n.id}
                      onClick={() => {
                        markRead(n.id);
                      }}
                      sx={{ alignItems: "flex-start", gap: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: n.read ? "#F3F6FB" : "#0D2B6B", color: n.read ? "#0D2B6B" : "#fff" }}>
                          {n.title.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: n.read ? 500 : 700 }}>{n.title}</Typography>}
                        secondary={<Typography variant="caption" sx={{ color: "var(--color-text-muted)" }}>{n.body} • {formatTime(n.createdAt)}</Typography>}
                      />
                    </MenuItem>
                  ))
                )}
                <Divider />
                <Box sx={{ px: 2, py: 1 }}>
                  <Button fullWidth size="small" variant="outlined" onClick={() => { /* placeholder: navigate to notifications page */ handleClose(); }}>
                    View all notifications
                  </Button>
                </Box>
              </Menu>

              <Divider orientation="vertical" flexItem sx={{ borderColor: "var(--color-border)" }} />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0D2B6B" }}>
                  DICT Administrator
                </Typography>
                <Typography variant="caption" sx={{ color: "var(--color-text-muted)" }}>
                  super_admin
                </Typography>
              </Box>

              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#0D2B6B",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                DA
              </Avatar>

              <Button
                variant="outlined"
                size="small"
                endIcon={<LogoutIcon />}
                onClick={logout}
                sx={{
                  borderColor: "var(--color-border)",
                  color: "#0D2B6B",
                  borderWidth: "1.5px",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.06)",
                    borderColor: "#CC2027",
                    color: "#CC2027",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <ErrorBoundary>
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
            overflow: "auto",
            p: { xs: 2, sm: 3.5 },
            position: "relative",
            background:
              "radial-gradient(circle at 15% 20%, rgba(13, 43, 107, 0.08), transparent 28%), radial-gradient(circle at 88% 12%, rgba(204, 32, 39, 0.08), transparent 18%), linear-gradient(180deg, #F7FAFF 0%, #F0F4FB 100%)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage: "radial-gradient(circle, rgba(203, 213, 225, 0.45) 1.5px, transparent 1.5px)",
              backgroundSize: "28px 28px",
              opacity: 0.45,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Outlet />
          </Box>
        </Box>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
