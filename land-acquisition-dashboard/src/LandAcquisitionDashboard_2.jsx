import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  LayoutDashboard, MapPinned, ScrollText, Building2, Wallet, Home as HomeIcon,
  Map, FolderOpen, BarChart3, Bell, Settings, Menu, X, Sun, Moon,
  Search, Filter, ChevronDown, ChevronRight, Globe2, UserCircle2,
  TrendingUp, TrendingDown, Users, CheckCircle2, Clock, AlertTriangle,
  FileText, Download, ArrowUpRight, ArrowDownRight, Landmark, Sparkles,
  ShieldCheck, MapPin, ExternalLink, ClipboardList, ChevronLeft, Eye,
  BadgeCheck, CircleDot, Activity, ListFilter, X as XIcon, Info,
  FileCheck2, HandCoins, Building, Layers, PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadialBarChart, RadialBar,
} from "recharts";

/* ============================= DESIGN TOKENS ============================= */
const C = {
  navy: "#0A3D62",
  navyDeep: "#082C47",
  navyLight: "#eef4f8",
  green: "#0E8A4B",
  greenLight: "#e7f6ee",
  saffron: "#E97F1B",
  saffronLight: "#fdf1e4",
  red: "#D0453A",
  redLight: "#fbe9e7",
  amber: "#C68A0B",
  amberLight: "#fdf3dc",
  blueInfo: "#2464B4",
  blueInfoLight: "#e8f0fb",
};

const STATUS_COLOR = {
  Completed: C.green,
  "In Progress": C.blueInfo,
  Pending: C.saffron,
  Critical: C.red,
};

/* ================================ MOCK DATA =============================== */
const STATE_GRID = [
  { name: "Jammu & Kashmir", row: 0, col: 3, projects: 4, risk: "Medium" },
  { name: "Ladakh", row: 0, col: 4, projects: 1, risk: "Low" },
  { name: "Himachal Pradesh", row: 1, col: 3, projects: 3, risk: "Low" },
  { name: "Punjab", row: 1, col: 2, projects: 6, risk: "Medium" },
  { name: "Uttarakhand", row: 1, col: 4, projects: 3, risk: "Low" },
  { name: "Arunachal Pradesh", row: 1, col: 7, projects: 2, risk: "Low" },
  { name: "Haryana", row: 2, col: 3, projects: 7, risk: "High" },
  { name: "Rajasthan", row: 2, col: 2, projects: 9, risk: "Medium" },
  { name: "Uttar Pradesh", row: 2, col: 4, projects: 14, risk: "High" },
  { name: "Bihar", row: 2, col: 5, projects: 8, risk: "High" },
  { name: "Sikkim", row: 2, col: 6, projects: 1, risk: "Low" },
  { name: "Assam", row: 2, col: 7, projects: 5, risk: "Medium" },
  { name: "Nagaland", row: 2, col: 8, projects: 1, risk: "Low" },
  { name: "Meghalaya", row: 3, col: 7, projects: 2, risk: "Low" },
  { name: "Manipur", row: 3, col: 8, projects: 1, risk: "Medium" },
  { name: "Gujarat", row: 3, col: 1, projects: 10, risk: "Medium" },
  { name: "Madhya Pradesh", row: 3, col: 3, projects: 11, risk: "Medium" },
  { name: "Chhattisgarh", row: 3, col: 4, projects: 6, risk: "High" },
  { name: "Jharkhand", row: 3, col: 5, projects: 7, risk: "Critical" },
  { name: "West Bengal", row: 3, col: 6, projects: 9, risk: "Medium" },
  { name: "Tripura", row: 4, col: 7, projects: 1, risk: "Low" },
  { name: "Mizoram", row: 4, col: 8, projects: 1, risk: "Low" },
  { name: "Maharashtra", row: 4, col: 2, projects: 15, risk: "Medium" },
  { name: "Telangana", row: 4, col: 4, projects: 6, risk: "Medium" },
  { name: "Odisha", row: 4, col: 5, projects: 8, risk: "Critical" },
  { name: "Goa", row: 5, col: 2, projects: 1, risk: "Low" },
  { name: "Karnataka", row: 5, col: 3, projects: 10, risk: "Low" },
  { name: "Andhra Pradesh", row: 5, col: 4, projects: 7, risk: "Medium" },
  { name: "Kerala", row: 6, col: 3, projects: 4, risk: "Low" },
  { name: "Tamil Nadu", row: 6, col: 4, projects: 9, risk: "Medium" },
];

const PROJECTS = [
  { id: "LA-2024-0182", name: "Purvanchal Expressway Extension", state: "Uttar Pradesh", district: "Ghazipur", area: 412.6, families: 1840, stage: "Compensation Paid", progress: 82, comp: "Partially Paid", priority: "High", updated: "28 Aug 2026", status: "In Progress" },
  { id: "LA-2024-0157", name: "Mumbai–Ahmedabad Rail Corridor Sec-9", state: "Maharashtra", district: "Palghar", area: 268.3, families: 960, stage: "Possession Taken", progress: 91, comp: "Paid", priority: "High", updated: "27 Aug 2026", status: "In Progress" },
  { id: "LA-2024-0143", name: "Bhubaneswar Industrial Corridor", state: "Odisha", district: "Jajpur", area: 190.0, families: 705, stage: "Objection Hearing", progress: 34, comp: "Pending", priority: "Critical", updated: "25 Aug 2026", status: "Critical" },
  { id: "LA-2024-0121", name: "Deoghar Airport Approach Road", state: "Jharkhand", district: "Deoghar", area: 58.4, families: 212, stage: "Notification Issued", progress: 22, comp: "Pending", priority: "Critical", updated: "24 Aug 2026", status: "Critical" },
  { id: "LA-2024-0119", name: "Bengaluru Peripheral Ring Road", state: "Karnataka", district: "Bengaluru Rural", area: 331.2, families: 1120, stage: "Rehabilitation", progress: 96, comp: "Paid", priority: "Medium", updated: "22 Aug 2026", status: "Completed" },
  { id: "LA-2024-0110", name: "Amaravati Capital Region Ph-2", state: "Andhra Pradesh", district: "Guntur", area: 540.0, families: 2210, stage: "Compensation Processed", progress: 61, comp: "In Process", priority: "High", updated: "21 Aug 2026", status: "In Progress" },
  { id: "LA-2024-0098", name: "Chennai–Salem Greenfield Corridor", state: "Tamil Nadu", district: "Namakkal", area: 176.9, families: 640, stage: "Land Acquisition Approved", progress: 48, comp: "Pending", priority: "Medium", updated: "19 Aug 2026", status: "In Progress" },
  { id: "LA-2024-0087", name: "Sagarmala Port Connectivity — Kandla", state: "Gujarat", district: "Kutch", area: 265.5, families: 480, stage: "Survey Completed", progress: 18, comp: "Pending", priority: "Medium", updated: "16 Aug 2026", status: "Pending" },
  { id: "LA-2024-0071", name: "Patna Ring Road Package-3", state: "Bihar", district: "Patna Rural", area: 122.7, families: 890, stage: "Compensation Paid", progress: 88, comp: "Paid", priority: "High", updated: "14 Aug 2026", status: "In Progress" },
  { id: "LA-2024-0066", name: "Delhi–Meerut RRTS Depot Land", state: "Uttar Pradesh", district: "Meerut", area: 76.3, families: 305, stage: "Rehabilitation", progress: 99, comp: "Paid", priority: "Low", updated: "12 Aug 2026", status: "Completed" },
  { id: "LA-2024-0052", name: "Guwahati Water Grid Pipeline Corridor", state: "Assam", district: "Kamrup", area: 44.1, families: 150, stage: "Notification Issued", progress: 26, comp: "Pending", priority: "Medium", updated: "10 Aug 2026", status: "Pending" },
  { id: "LA-2024-0041", name: "Bhopal Metro Depot & Yard", state: "Madhya Pradesh", district: "Bhopal", area: 38.9, families: 96, stage: "Possession Taken", progress: 93, comp: "Paid", priority: "Low", updated: "08 Aug 2026", status: "Completed" },
];

const COMPENSATION_RECORDS = [
  { id: "BEN-118820", project: "LA-2024-0182", district: "Ghazipur", amount: 842000, status: "Paid", date: "18 Aug 2026", verify: "Verified" },
  { id: "BEN-118821", project: "LA-2024-0182", district: "Ghazipur", amount: 610000, status: "Pending", date: "—", verify: "Under Review" },
  { id: "BEN-114490", project: "LA-2024-0157", district: "Palghar", amount: 1250000, status: "Paid", date: "12 Aug 2026", verify: "Verified" },
  { id: "BEN-109932", project: "LA-2024-0143", district: "Jajpur", amount: 705000, status: "Pending", date: "—", verify: "Pending Docs" },
  { id: "BEN-109933", project: "LA-2024-0143", district: "Jajpur", amount: 512000, status: "Pending", date: "—", verify: "Pending Docs" },
  { id: "BEN-108120", project: "LA-2024-0119", district: "Bengaluru Rural", amount: 990000, status: "Paid", date: "02 Aug 2026", verify: "Verified" },
  { id: "BEN-107765", project: "LA-2024-0110", district: "Guntur", amount: 1475000, status: "In Process", date: "—", verify: "Verified" },
  { id: "BEN-106340", project: "LA-2024-0071", district: "Patna Rural", amount: 386000, status: "Paid", date: "29 Jul 2026", verify: "Verified" },
  { id: "BEN-105212", project: "LA-2024-0066", district: "Meerut", amount: 725000, status: "Paid", date: "22 Jul 2026", verify: "Verified" },
  { id: "BEN-104880", project: "LA-2024-0041", district: "Bhopal", amount: 298000, status: "Paid", date: "15 Jul 2026", verify: "Verified" },
];

const ALERTS_DATA = [
  { id: 1, sev: "CRITICAL", cat: "Delay", msg: "Objection hearing overdue by 34 days", project: "LA-2024-0143 · Bhubaneswar Industrial Corridor", time: "1 hour ago", read: false },
  { id: 2, sev: "CRITICAL", cat: "Compensation", msg: "Compensation disbursal stalled — bank verification pending for 212 families", project: "LA-2024-0121 · Deoghar Airport Approach Road", time: "3 hours ago", read: false },
  { id: 3, sev: "HIGH", cat: "Approval", msg: "District Collector approval pending beyond SLA (15 days)", project: "LA-2024-0098 · Chennai–Salem Greenfield Corridor", time: "6 hours ago", read: false },
  { id: 4, sev: "HIGH", cat: "Documents", msg: "Title-deed verification mismatch flagged for 18 parcels", project: "LA-2024-0182 · Purvanchal Expressway Extension", time: "9 hours ago", read: true },
  { id: 5, sev: "MEDIUM", cat: "Rehabilitation", msg: "Resettlement site handover delayed by contractor", project: "LA-2024-0119 · Bengaluru Peripheral Ring Road", time: "1 day ago", read: false },
  { id: 6, sev: "MEDIUM", cat: "Deadline", msg: "Section-11 notification validity expiring in 12 days", project: "LA-2024-0052 · Guwahati Water Grid Pipeline Corridor", time: "1 day ago", read: true },
  { id: 7, sev: "LOW", cat: "Documents", msg: "Survey sketch upload pending for 4 parcels", project: "LA-2024-0087 · Sagarmala Port Connectivity — Kandla", time: "2 days ago", read: true },
  { id: 8, sev: "MEDIUM", cat: "Compensation", msg: "Enhanced compensation appeal filed by 26 land owners", project: "LA-2024-0110 · Amaravati Capital Region Ph-2", time: "2 days ago", read: false },
];

const ACTIVITY_FEED = [
  { icon: FileCheck2, text: "Land parcel GZ-4471 verified and geo-tagged", time: "2 minutes ago" },
  { icon: HandCoins, text: "Compensation approved for 18 beneficiaries in Palghar", time: "15 minutes ago" },
  { icon: ClipboardList, text: "Survey completed for Sagarmala Port Connectivity — Kandla", time: "42 minutes ago" },
  { icon: Activity, text: "Project status updated: Amaravati Capital Region Ph-2 → 61%", time: "1 hour ago" },
  { icon: FolderOpen, text: "Award document uploaded for LA-2024-0071", time: "1 hour ago" },
  { icon: BadgeCheck, text: "Rehabilitation case closed for family unit RH-2290", time: "2 hours ago" },
  { icon: FileCheck2, text: "Land parcel MZ-1182 verified and geo-tagged", time: "3 hours ago" },
  { icon: HandCoins, text: "Compensation disbursed — ₹9.9L to BEN-108120", time: "3 hours ago" },
];

const STAGE_DATA = [
  { stage: "Survey Completed", value: 96 },
  { stage: "Notification Issued", value: 88 },
  { stage: "Acquisition Approved", value: 74 },
  { stage: "Compensation Processed", value: 62 },
  { stage: "Compensation Paid", value: 51 },
  { stage: "Possession Taken", value: 44 },
  { stage: "Rehabilitation Completed", value: 33 },
];

const MONTHLY_TREND = [
  { m: "Mar", acquired: 21, compensated: 14 },
  { m: "Apr", acquired: 26, compensated: 19 },
  { m: "May", acquired: 24, compensated: 22 },
  { m: "Jun", acquired: 31, compensated: 25 },
  { m: "Jul", acquired: 29, compensated: 27 },
  { m: "Aug", acquired: 35, compensated: 30 },
];

const STATUS_SPLIT = [
  { name: "Completed", value: 312, color: C.green },
  { name: "In Progress", value: 486, color: C.blueInfo },
  { name: "Pending", value: 214, color: C.saffron },
  { name: "Critical", value: 58, color: C.red },
];

const STATE_COMPENSATION = [
  { state: "UP", amount: 184 },
  { state: "MH", amount: 226 },
  { state: "BR", amount: 96 },
  { state: "OD", amount: 78 },
  { state: "GJ", amount: 112 },
  { state: "KA", amount: 143 },
  { state: "AP", amount: 168 },
  { state: "JH", amount: 61 },
];

const PAID_VS_PENDING = [
  { name: "Paid", value: 1428, color: C.green },
  { name: "Pending", value: 462, color: C.saffron },
  { name: "In Process", value: 210, color: C.blueInfo },
];

const DELAY_ANALYSIS = [
  { cause: "Compensation\nProcessing", days: 46 },
  { cause: "Title/Records\nVerification", days: 38 },
  { cause: "Objection\nHearings", days: 33 },
  { cause: "Resettlement\nSite Handover", days: 29 },
  { cause: "Document\nDigitisation", days: 17 },
];

const KPI_DATA = [
  { key: "parcels", label: "Total Land Parcels", value: "48,216", change: "+3.2%", up: true, icon: Layers, trend: [4,6,5,7,8,7,9] },
  { key: "active", label: "Active Acquisition Projects", value: "1,070", change: "+1.8%", up: true, icon: Building2, trend: [5,5,6,6,7,7,8] },
  { key: "completed", label: "Acquisition Completed", value: "312", change: "+4.6%", up: true, icon: CheckCircle2, trend: [3,4,4,5,6,7,8] },
  { key: "pending", label: "Pending Approvals", value: "214", change: "-2.1%", up: false, icon: Clock, trend: [8,7,7,6,6,5,5] },
  { key: "comp", label: "Compensation Disbursed", value: "₹1,428 Cr", change: "+6.4%", up: true, icon: Wallet, trend: [4,5,6,6,7,8,9] },
  { key: "families", label: "Affected Families", value: "18,940", change: "+0.9%", up: true, icon: Users, trend: [6,6,6,7,7,7,8] },
  { key: "rehab", label: "Rehabilitation Completed", value: "6,105", change: "+2.7%", up: true, icon: HomeIcon, trend: [3,4,5,5,6,6,7] },
  { key: "critical", label: "Critical Alerts", value: "58", change: "+11%", up: false, icon: AlertTriangle, trend: [3,4,4,6,7,8,9], bad: true },
];

const TIMELINE_STEPS = ["Survey", "Notification", "Objection", "Approval", "Compensation", "Possession", "Rehabilitation", "Completed"];

const LAND_RECORDS = [
  { survey: "112/4A", district: "Ghazipur", state: "Uttar Pradesh", village: "Rasoolpur", owner: "Ram Bahadur Yadav", type: "Agricultural", area: "2.14 Ha", status: "Acquired" },
  { survey: "88/2", district: "Palghar", state: "Maharashtra", village: "Kaman", owner: "Sunita Patil", type: "Residential", area: "0.42 Ha", status: "Under Process" },
  { survey: "45/1B", district: "Jajpur", state: "Odisha", village: "Danagadi", owner: "Bijay Mohapatra", type: "Agricultural", area: "1.80 Ha", status: "Disputed" },
  { survey: "201/9", district: "Bengaluru Rural", state: "Karnataka", village: "Nelamangala", owner: "K. Manjunath", type: "Commercial", area: "0.95 Ha", status: "Acquired" },
  { survey: "76/3", district: "Guntur", state: "Andhra Pradesh", village: "Tadepalli", owner: "P. Lakshmi Devi", type: "Agricultural", area: "3.02 Ha", status: "Under Process" },
  { survey: "19/2A", district: "Kutch", state: "Gujarat", village: "Gandhidham", owner: "Harish Thakkar", type: "Barren", area: "5.60 Ha", status: "Notified" },
];

function fmtINR(n) {
  return "₹" + n.toLocaleString("en-IN");
}

/* ============================== UI PRIMITIVES ============================= */
function Badge({ children, tone = "info", size = "sm" }) {
  const map = {
    success: { bg: C.greenLight, fg: C.green },
    info: { bg: C.blueInfoLight, fg: C.blueInfo },
    warn: { bg: C.saffronLight, fg: C.saffron },
    danger: { bg: C.redLight, fg: C.red },
    amber: { bg: C.amberLight, fg: C.amber },
    navy: { bg: C.navyLight, fg: C.navy },
  };
  const s = map[tone] || map.info;
  return (
    <span
      style={{ background: s.bg, color: s.fg, fontSize: size === "sm" ? 11 : 12.5 }}
      className="font-semibold px-2.5 py-1 rounded-full inline-flex items-center gap-1 whitespace-nowrap"
    >
      {children}
    </span>
  );
}

function statusTone(status) {
  if (status === "Completed" || status === "Paid" || status === "Acquired" || status === "Verified") return "success";
  if (status === "In Progress" || status === "In Process" || status === "Under Process") return "info";
  if (status === "Pending" || status === "Notified" || status === "Pending Docs" || status === "Partially Paid") return "warn";
  if (status === "Critical" || status === "Disputed") return "danger";
  return "navy";
}

function sevTone(sev) {
  return sev === "CRITICAL" ? "danger" : sev === "HIGH" ? "amber" : sev === "MEDIUM" ? "warn" : "info";
}

function ProgressBar({ value, color = C.green, track = "var(--track)", h = 8 }) {
  return (
    <div style={{ height: h, background: track, borderRadius: 99 }} className="w-full overflow-hidden">
      <div
        style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 99, transition: "width 900ms cubic-bezier(.4,0,.2,1)" }}
      />
    </div>
  );
}

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 60;
      const y = 22 - ((v - min) / (max - min || 1)) * 20;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width="64" height="24" viewBox="0 0 64 24" className="opacity-90">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Card({ children, className = "", style = {}, ...rest }) {
  return (
    <div
      className={`rounded-2xl transition-shadow duration-300 hover:shadow-md ${className}`}
      style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 2px rgba(10,61,98,0.04)", ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
      <div>
        {eyebrow && (
          <div style={{ color: C.green }} className="text-[11px] font-bold tracking-[0.14em] uppercase mb-1">
            {eyebrow}
          </div>
        )}
        <h2 style={{ color: "var(--text)" }} className="text-lg font-bold">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function IconBubble({ icon: Icon, bg, fg, size = 40 }) {
  return (
    <div
      style={{ width: size, height: size, background: bg, color: fg }}
      className="rounded-xl flex items-center justify-center shrink-0"
    >
      <Icon size={size * 0.5} strokeWidth={2.2} />
    </div>
  );
}

/* ================================== TOAST ================================= */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-[fadeIn_.25s_ease]">
      <div
        style={{ background: C.navyDeep, color: "#fff" }}
        className="px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium max-w-xs"
      >
        <CheckCircle2 size={16} color={C.green} />
        {toast}
      </div>
    </div>
  );
}

/* ================================= MODAL =================================== */
function Modal({ open, onClose, children, wide }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[150] flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto"
      style={{ background: "rgba(8,20,32,0.55)", backdropFilter: "blur(2px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} rounded-2xl shadow-2xl my-6 animate-[popIn_.2s_ease] overflow-hidden`}
      >
        {children}
      </div>
    </div>
  );
}

/* ================================ NAV CONFIG =============================== */
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "acquisition", label: "Land Acquisition", icon: ScrollText },
  { key: "records", label: "Land Records", icon: FileText },
  { key: "projects", label: "Projects", icon: Building2 },
  { key: "compensation", label: "Compensation", icon: Wallet },
  { key: "rehabilitation", label: "Rehabilitation & Resettlement", icon: HomeIcon },
  { key: "gis", label: "GIS Map", icon: Map },
  { key: "documents", label: "Documents", icon: FolderOpen },
  { key: "reports", label: "Reports & Analytics", icon: BarChart3 },
  { key: "alerts", label: "Alerts", icon: Bell },
  { key: "settings", label: "Settings", icon: Settings },
];

/* ================================== HEADER ================================= */
function Header({ collapsed, setCollapsed, dark, setDark, setMobileOpen, page, setPage, unread }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("English");
  return (
    <header
      style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
      className="h-16 sticky top-0 z-40 flex items-center gap-3 px-3 md:px-5"
    >
      <button
        onClick={() => setMobileOpen((v) => !v)}
        className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)]"
        style={{ color: "var(--text)" }}
      >
        <Menu size={22} />
      </button>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="hidden md:flex p-2 rounded-lg hover:bg-[var(--hover)]"
        style={{ color: "var(--text)" }}
        title="Collapse sidebar"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => setPage("dashboard")}>
        <div
          style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.green})` }}
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
        >
          <Landmark size={18} color="#fff" />
        </div>
        <div className="min-w-0 hidden sm:block">
          <div style={{ color: "var(--text)" }} className="text-[13px] md:text-[14px] font-extrabold leading-tight truncate">
            National Land Acquisition &amp; Management System
          </div>
          <div style={{ color: "var(--muted)" }} className="text-[11px] leading-tight truncate">
            Ministry of Rural Development · Government of India
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <div className="hidden lg:flex items-center gap-2 mr-1" style={{ color: "var(--muted)" }}>
        <Search size={16} />
        <input
          placeholder="Search project, district, survey no..."
          style={{ background: "var(--track)", color: "var(--text)" }}
          className="text-sm rounded-lg px-3 py-2 w-64 outline-none focus:ring-2 ring-offset-0"
        />
      </div>

      <div className="relative">
        <button
          onClick={() => { setLangOpen((v) => !v); setNotifOpen(false); }}
          className="p-2 rounded-lg hover:bg-[var(--hover)] flex items-center gap-1"
          style={{ color: "var(--text)" }}
        >
          <Globe2 size={19} />
          <span className="hidden md:inline text-xs font-semibold">{lang}</span>
          <ChevronDown size={14} className="hidden md:inline" />
        </button>
        {langOpen && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }} className="absolute right-0 mt-2 w-40 rounded-xl shadow-lg py-1 z-50 animate-[popIn_.15s_ease]">
            {["English", "हिन्दी", "বাংলা", "தமிழ்", "తెలుగు"].map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setLangOpen(false); }}
                style={{ color: "var(--text)" }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--hover)]"
              >
                {l}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setDark((v) => !v)}
        className="p-2 rounded-lg hover:bg-[var(--hover)]"
        style={{ color: "var(--text)" }}
        title="Toggle theme"
      >
        {dark ? <Sun size={19} /> : <Moon size={19} />}
      </button>

      <div className="relative">
        <button
          onClick={() => { setNotifOpen((v) => !v); setLangOpen(false); }}
          className="p-2 rounded-lg hover:bg-[var(--hover)] relative"
          style={{ color: "var(--text)" }}
        >
          <Bell size={19} />
          {unread > 0 && (
            <span style={{ background: C.red }} className="absolute top-1 right-1 w-2 h-2 rounded-full" />
          )}
        </button>
        {notifOpen && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }} className="absolute right-0 mt-2 w-80 rounded-xl shadow-lg z-50 overflow-hidden animate-[popIn_.15s_ease]">
            <div style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-3 flex items-center justify-between">
              <span style={{ color: "var(--text)" }} className="text-sm font-bold">Notifications</span>
              <Badge tone="danger">{unread} new</Badge>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {ALERTS_DATA.slice(0, 5).map((a) => (
                <div key={a.id} style={{ borderBottom: "1px solid var(--border)" }} className="px-4 py-3 hover:bg-[var(--hover)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={sevTone(a.sev)}>{a.sev}</Badge>
                    <span style={{ color: "var(--muted)" }} className="text-[11px]">{a.time}</span>
                  </div>
                  <div style={{ color: "var(--text)" }} className="text-xs leading-snug">{a.msg}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setPage("alerts"); setNotifOpen(false); }}
              style={{ color: C.navy }}
              className="w-full text-center py-2.5 text-xs font-bold hover:bg-[var(--hover)]"
            >
              View all alerts
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pl-2 ml-1" style={{ borderLeft: "1px solid var(--border)" }}>
        <UserCircle2 size={30} style={{ color: C.navy }} />
        <div className="hidden md:block leading-tight">
          <div style={{ color: "var(--text)" }} className="text-xs font-bold">A. Sharma</div>
          <div style={{ color: "var(--muted)" }} className="text-[10px]">District Officer</div>
        </div>
      </div>
    </header>
  );
}

/* ================================= SIDEBAR ================================= */
function Sidebar({ page, setPage, collapsed, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border)", width: collapsed ? 76 : 252 }}
        className={`fixed md:sticky top-16 md:top-16 h-[calc(100vh-64px)] z-50 md:z-30 transition-all duration-300 flex flex-col
        ${mobileOpen ? "left-0" : "-left-72 md:left-0"}`}
      >
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {NAV.map((item) => {
            const active = page === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setPage(item.key); setMobileOpen(false); }}
                title={collapsed ? item.label : ""}
                style={{
                  background: active ? C.navy : "transparent",
                  color: active ? "#fff" : "var(--text)",
                }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200 hover:translate-x-[1px] ${
                  active ? "shadow-sm" : "hover:bg-[var(--hover)]"
                }`}
              >
                <item.icon size={19} className="shrink-0" strokeWidth={active ? 2.4 : 2} />
                {!collapsed && <span className="truncate text-left">{item.label}</span>}
                {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </nav>
        {!collapsed && (
          <div style={{ borderTop: "1px solid var(--border)" }} className="p-3">
            <div style={{ background: "var(--track)" }} className="rounded-xl p-3 flex items-start gap-2">
              <ShieldCheck size={18} style={{ color: C.green }} className="shrink-0 mt-0.5" />
              <div style={{ color: "var(--muted)" }} className="text-[10.5px] leading-snug">
                Prototype build for SIH26016 · Demonstration data only, not linked to live government records.
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

/* ============================== KPI CARD =================================== */
function KpiCard({ item }) {
  return (
    <Card className="p-4 group cursor-default">
      <div className="flex items-start justify-between">
        <IconBubble icon={item.icon} bg={item.bad ? C.redLight : C.navyLight} fg={item.bad ? C.red : C.navy} />
        <Sparkline data={item.trend} color={item.bad ? C.red : C.green} />
      </div>
      <div style={{ color: "var(--text)" }} className="text-2xl font-extrabold mt-3 tracking-tight">
        {item.value}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span style={{ color: "var(--muted)" }} className="text-[12px] font-medium">{item.label}</span>
      </div>
      <div className="flex items-center gap-1 mt-2">
        {item.up ? (
          <ArrowUpRight size={14} color={item.bad ? C.red : C.green} />
        ) : (
          <ArrowDownRight size={14} color={item.bad ? C.green : C.red} />
        )}
        <span style={{ color: item.up ? (item.bad ? C.red : C.green) : (item.bad ? C.green : C.red) }} className="text-xs font-bold">
          {item.change}
        </span>
        <span style={{ color: "var(--muted)" }} className="text-[11px]">vs last month</span>
      </div>
    </Card>
  );
}

/* =============================== DASHBOARD HOME ============================= */
function DashboardHome({ setPage, openProject }) {
  return (
    <div className="space-y-6">
      <div
        style={{ background: `linear-gradient(120deg, ${C.navyDeep}, ${C.navy} 60%, ${C.green})` }}
        className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute right-24 bottom-[-40px] w-40 h-40 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 text-white/80 text-xs font-bold tracking-[0.14em] uppercase mb-3">
            <Sparkles size={14} /> Real-time decision support
          </div>
          <h1 className="text-2xl md:text-[28px] font-extrabold leading-tight max-w-2xl">
            National Land Acquisition &amp; Management System
          </h1>
          <p className="text-white/85 mt-2 max-w-xl text-sm md:text-[15px]">
            Real-time monitoring, transparent land acquisition management and decision support.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <button
              onClick={() => setPage("gis")}
              style={{ background: "#fff", color: C.navy }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Map size={16} /> Open GIS Map
            </button>
            <button
              onClick={() => setPage("reports")}
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.35)" }}
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2"
            >
              <BarChart3 size={16} /> Reports &amp; Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_DATA.map((k) => <KpiCard key={k.key} item={k} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle eyebrow="Real-time monitoring" title="Land Acquisition Progress by Stage" />
          <div className="space-y-4">
            {STAGE_DATA.map((s) => (
              <div key={s.stage}>
                <div className="flex justify-between mb-1.5">
                  <span style={{ color: "var(--text)" }} className="text-[13px] font-medium">{s.stage}</span>
                  <span style={{ color: C.navy }} className="text-[13px] font-bold">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} color={s.value > 60 ? C.green : s.value > 35 ? C.saffron : C.red} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Project Status Split" />
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={STATUS_SPLIT} dataKey="value" nameKey="name" innerRadius={52} outerRadius={78} paddingAngle={2}>
                {STATUS_SPLIT.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {STATUS_SPLIT.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span style={{ background: s.color }} className="w-2.5 h-2.5 rounded-full shrink-0" />
                <span style={{ color: "var(--muted)" }} className="text-[11px] font-medium">{s.name} · {s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle title="Monthly Acquisition vs Compensation Trend" />
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={MONTHLY_TREND}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.navy} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.navy} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.green} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="acquired" name="Projects Acquired" stroke={C.navy} fill="url(#g1)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="compensated" name="Compensation Cleared" stroke={C.green} fill="url(#g2)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 flex flex-col">
          <SectionTitle title="Live Activity Feed" />
          <div className="space-y-4 overflow-y-auto max-h-[230px] pr-1">
            {ACTIVITY_FEED.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div style={{ background: C.greenLight, color: C.green }} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                  <a.icon size={15} />
                </div>
                <div className="min-w-0">
                  <div style={{ color: "var(--text)" }} className="text-[12.5px] leading-snug">{a.text}</div>
                  <div style={{ color: "var(--muted)" }} className="text-[10.5px] mt-0.5">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5" style={{ borderLeft: `4px solid ${C.navy}` }}>
        <div className="flex items-center gap-2 mb-4">
          <div style={{ background: C.navyLight, color: C.navy }} className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles size={16} />
          </div>
          <h2 style={{ color: "var(--text)" }} className="text-lg font-bold">Decision Support Panel</h2>
          <Badge tone="navy">Simulated insights</Badge>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            { icon: AlertTriangle, tone: "danger", text: "12 projects are currently at high risk of delay, concentrated in Jharkhand and Odisha." },
            { icon: Wallet, tone: "warn", text: "Compensation processing is the major bottleneck in 4 districts — avg. 46-day backlog." },
            { icon: ShieldCheck, tone: "amber", text: "3 projects require immediate administrative attention due to overdue objection hearings." },
            { icon: MapPinned, tone: "info", text: "Rehabilitation site handovers are trailing target in Bengaluru Rural and Palghar." },
          ].map((row, i) => (
            <div key={i} style={{ background: "var(--track)" }} className="rounded-xl p-3.5 flex items-start gap-3">
              <IconBubble icon={row.icon} bg={{success:C.greenLight,info:C.blueInfoLight,warn:C.saffronLight,danger:C.redLight,amber:C.amberLight}[row.tone]} fg={{success:C.green,info:C.blueInfo,warn:C.saffron,danger:C.red,amber:C.amber}[row.tone]} size={34} />
              <p style={{ color: "var(--text)" }} className="text-[13px] leading-snug">{row.text}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => setPage("reports")}
          style={{ color: C.navy }}
          className="mt-4 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
        >
          View full analytics <ChevronRight size={16} />
        </button>
      </Card>
    </div>
  );
}

/* ============================= LAND ACQUISITION PAGE ======================== */
function LandAcquisitionPage() {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Process monitoring" title="Land Acquisition Progress" />
      <Card className="p-5">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={STAGE_DATA} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
            <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
            <YAxis dataKey="stage" type="category" width={170} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} fill={C.navy}>
              {STAGE_DATA.map((s, i) => <Cell key={i} fill={s.value > 60 ? C.green : s.value > 35 ? C.saffron : C.red} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Avg. days: Notification → Approval", value: "94 days", icon: Clock },
          { label: "Avg. days: Approval → Compensation Paid", value: "61 days", icon: Wallet },
          { label: "Avg. days: Possession → Rehabilitation", value: "128 days", icon: HomeIcon },
        ].map((s) => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <IconBubble icon={s.icon} bg={C.navyLight} fg={C.navy} />
            <div>
              <div style={{ color: "var(--text)" }} className="text-lg font-extrabold">{s.value}</div>
              <div style={{ color: "var(--muted)" }} className="text-[11.5px]">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <SectionTitle title="Stage-wise Project Timeline (typical flow)" />
        <TimelineBar active={4} />
      </Card>
    </div>
  );
}

function TimelineBar({ active }) {
  return (
    <div className="flex items-start overflow-x-auto pb-2">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step} className="flex items-center shrink-0" style={{ minWidth: 108 }}>
          <div className="flex flex-col items-center text-center" style={{ width: 108 }}>
            <div
              style={{
                background: i <= active ? C.green : "var(--track)",
                color: i <= active ? "#fff" : "var(--muted)",
                border: i === active ? `2px solid ${C.navy}` : "none",
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500"
            >
              {i < active ? <CheckCircle2 size={16} /> : i + 1}
            </div>
            <span style={{ color: i <= active ? "var(--text)" : "var(--muted)" }} className="text-[11px] font-semibold mt-2 leading-tight px-1">
              {step}
            </span>
          </div>
          {i < TIMELINE_STEPS.length - 1 && (
            <div style={{ background: i < active ? C.green : "var(--border)" }} className="h-[2px] w-8 mt-[18px] shrink-0 transition-all duration-500" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ================================= PROJECTS PAGE ============================= */
function ProjectsPage({ openProject }) {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const perPage = 6;

  const filtered = useMemo(() => {
    let rows = PROJECTS.filter(
      (p) =>
        (statusFilter === "All" || p.status === statusFilter) &&
        (p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.state.toLowerCase().includes(q.toLowerCase()) ||
          p.district.toLowerCase().includes(q.toLowerCase()) ||
          p.id.toLowerCase().includes(q.toLowerCase()))
    );
    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        if (typeof va === "number") return sortAsc ? va - vb : vb - va;
        return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
      });
    }
    return rows;
  }, [q, statusFilter, sortKey, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageRows = filtered.slice((pageNum - 1) * perPage, pageNum * perPage);

  const Th = ({ label, k, className = "" }) => (
    <th
      onClick={() => k && (setSortKey(k), setSortAsc(sortKey === k ? !sortAsc : true))}
      className={`text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${k ? "cursor-pointer select-none" : ""} ${className}`}
      style={{ color: "var(--muted)" }}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {k && sortKey === k && (sortAsc ? <ChevronRight size={12} className="-rotate-90" /> : <ChevronRight size={12} className="rotate-90" />)}
      </span>
    </th>
  );

  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Project monitoring" title="Active Land Acquisition Projects" />
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]" style={{ background: "var(--track)" }}>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 w-full" style={{ background: "var(--track)" }}>
              <Search size={15} style={{ color: "var(--muted)" }} />
              <input
                value={q}
                onChange={(e) => { setQ(e.target.value); setPageNum(1); }}
                placeholder="Search project, state, district, ID..."
                style={{ color: "var(--text)" }}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} style={{ color: "var(--muted)" }} />
            {["All", "Completed", "In Progress", "Pending", "Critical"].map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPageNum(1); }}
                style={{
                  background: statusFilter === s ? C.navy : "var(--track)",
                  color: statusFilter === s ? "#fff" : "var(--text)",
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto -mx-1">
          <table className="w-full border-collapse min-w-[980px]">
            <thead style={{ borderBottom: "1px solid var(--border)" }}>
              <tr>
                <Th label="Project ID" k="id" />
                <Th label="Project Name" k="name" />
                <Th label="State" k="state" />
                <Th label="District" k="district" />
                <Th label="Land Area (ha)" k="area" />
                <Th label="Families" k="families" />
                <Th label="Current Stage" />
                <Th label="Progress" k="progress" />
                <Th label="Compensation" />
                <Th label="Priority" k="priority" />
                <Th label="Updated" />
                <Th label="Action" />
              </tr>
            </thead>
            <tbody>
              {pageRows.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[var(--hover)] transition-colors">
                  <td className="px-3 py-3 text-[12.5px] font-mono" style={{ color: C.navy }}>{p.id}</td>
                  <td className="px-3 py-3 text-[13px] font-semibold max-w-[220px]" style={{ color: "var(--text)" }}>{p.name}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{p.state}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{p.district}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{p.area}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{p.families.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-3 text-[12.5px]" style={{ color: "var(--text)" }}>{p.stage}</td>
                  <td className="px-3 py-3 w-32">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={p.progress} color={STATUS_COLOR[p.status]} h={6} />
                      <span style={{ color: "var(--muted)" }} className="text-[11px] font-bold">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><Badge tone={statusTone(p.comp)}>{p.comp}</Badge></td>
                  <td className="px-3 py-3"><Badge tone={p.priority === "Critical" ? "danger" : p.priority === "High" ? "amber" : p.priority === "Medium" ? "warn" : "info"}>{p.priority}</Badge></td>
                  <td className="px-3 py-3 text-[12px]" style={{ color: "var(--muted)" }}>{p.updated}</td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => openProject(p)}
                      style={{ color: C.navy, borderColor: C.navy }}
                      className="text-xs font-bold border rounded-lg px-2.5 py-1.5 flex items-center gap-1 hover:bg-[var(--hover)]"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr><td colSpan={12} className="text-center py-10 text-sm" style={{ color: "var(--muted)" }}>No projects match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
          <span style={{ color: "var(--muted)" }} className="text-xs">
            Showing {pageRows.length ? (pageNum - 1) * perPage + 1 : 0}–{Math.min(pageNum * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pageNum === 1}
              onClick={() => setPageNum((n) => Math.max(1, n - 1))}
              className="p-1.5 rounded-lg disabled:opacity-30"
              style={{ background: "var(--track)", color: "var(--text)" }}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPageNum(i + 1)}
                style={{ background: pageNum === i + 1 ? C.navy : "var(--track)", color: pageNum === i + 1 ? "#fff" : "var(--text)" }}
                className="w-7 h-7 rounded-lg text-xs font-bold"
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={pageNum === totalPages}
              onClick={() => setPageNum((n) => Math.min(totalPages, n + 1))}
              className="p-1.5 rounded-lg disabled:opacity-30"
              style={{ background: "var(--track)", color: "var(--text)" }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ============================ PROJECT DETAIL MODAL =========================== */
function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;
  const stageIndex = Math.min(Math.floor((project.progress / 100) * TIMELINE_STEPS.length), TIMELINE_STEPS.length - 1);
  return (
    <Modal open={!!project} onClose={onClose} wide>
      <div style={{ background: `linear-gradient(120deg, ${C.navyDeep}, ${C.navy})` }} className="p-5 text-white flex items-start justify-between">
        <div>
          <div className="text-[11px] font-mono opacity-80">{project.id}</div>
          <h3 className="text-lg font-extrabold mt-0.5">{project.name}</h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-[12.5px] opacity-90">
            <MapPin size={13} /> {project.district}, {project.state}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/15"><X size={20} /></button>
      </div>

      <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Land Area", value: `${project.area} Ha` },
            { label: "Affected Families", value: project.families.toLocaleString("en-IN") },
            { label: "Completion", value: `${project.progress}%` },
            { label: "Priority", value: project.priority },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--track)" }} className="rounded-xl p-3">
              <div style={{ color: "var(--muted)" }} className="text-[10.5px] font-semibold uppercase tracking-wide">{s.label}</div>
              <div style={{ color: "var(--text)" }} className="text-base font-extrabold mt-0.5">{s.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ color: "var(--text)" }} className="text-sm font-bold mb-3">Acquisition Timeline</div>
          <TimelineBar active={stageIndex} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div style={{ border: "1px solid var(--border)" }} className="rounded-xl p-4">
            <div style={{ color: "var(--text)" }} className="text-sm font-bold mb-2 flex items-center gap-2"><Wallet size={15} color={C.green} /> Compensation Details</div>
            <div className="space-y-2 text-[12.5px]" style={{ color: "var(--text)" }}>
              <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Status</span><Badge tone={statusTone(project.comp)}>{project.comp}</Badge></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Current Stage</span><span className="font-semibold">{project.stage}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Last Updated</span><span className="font-semibold">{project.updated}</span></div>
            </div>
          </div>
          <div style={{ border: "1px solid var(--border)" }} className="rounded-xl p-4">
            <div style={{ color: "var(--text)" }} className="text-sm font-bold mb-2 flex items-center gap-2"><Building size={15} color={C.navy} /> Officer / Department</div>
            <div className="space-y-2 text-[12.5px]" style={{ color: "var(--text)" }}>
              <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Land Acquisition Officer</span><span className="font-semibold">R. Kulkarni</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Department</span><span className="font-semibold">Revenue &amp; LA Dept.</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>Nodal Ministry</span><span className="font-semibold">Ministry of Rural Development</span></div>
            </div>
          </div>
        </div>

        <div style={{ border: "1px solid var(--border)" }} className="rounded-xl p-4">
          <div style={{ color: "var(--text)" }} className="text-sm font-bold mb-2 flex items-center gap-2"><HomeIcon size={15} color={C.saffron} /> Rehabilitation &amp; Resettlement</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Families Relocated", v: Math.round(project.families * (project.progress / 130)) },
              { l: "Houses Provided", v: Math.round(project.families * (project.progress / 160)) },
              { l: "Employment Assistance", v: Math.round(project.families * (project.progress / 220)) },
            ].map((x) => (
              <div key={x.l} className="text-center">
                <div style={{ color: C.navy }} className="text-lg font-extrabold">{x.v}</div>
                <div style={{ color: "var(--muted)" }} className="text-[10.5px]">{x.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: "1px solid var(--border)" }} className="rounded-xl p-4">
          <div style={{ color: "var(--text)" }} className="text-sm font-bold mb-2 flex items-center gap-2"><FolderOpen size={15} color={C.blueInfo} /> Important Documents</div>
          <div className="flex flex-wrap gap-2">
            {["Section-11 Notification.pdf", "Survey Sketch.pdf", "Award Order.pdf", "Compensation Statement.xlsx"].map((d) => (
              <span key={d} style={{ background: "var(--track)", color: "var(--text)" }} className="text-[11.5px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                <FileText size={12} /> {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

/* ================================= LAND RECORDS PAGE ========================= */
function LandRecordsPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const rows = LAND_RECORDS.filter((r) =>
    Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Land records" title="Searchable Land Parcel Records" />
      <Card className="p-4">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-4 max-w-md" style={{ background: "var(--track)" }}>
          <Search size={15} style={{ color: "var(--muted)" }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search survey no., owner, village..." style={{ color: "var(--text)" }} className="bg-transparent outline-none text-sm w-full" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[860px]">
            <thead style={{ borderBottom: "1px solid var(--border)" }}>
              <tr>
                {["Survey No.", "District", "State", "Village", "Owner", "Land Type", "Area", "Status", ""].map((h) => (
                  <th key={h} style={{ color: "var(--muted)" }} className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.survey} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[var(--hover)]">
                  <td className="px-3 py-3 text-[12.5px] font-mono" style={{ color: C.navy }}>{r.survey}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.district}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.state}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.village}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.owner}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.type}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.area}</td>
                  <td className="px-3 py-3"><Badge tone={statusTone(r.status)}>{r.status}</Badge></td>
                  <td className="px-3 py-3">
                    <button onClick={() => setSelected(r)} style={{ color: C.navy, borderColor: C.navy }} className="text-xs font-bold border rounded-lg px-2.5 py-1.5">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: "var(--text)" }} className="text-base font-extrabold">Land Parcel — {selected.survey}</h3>
              <button onClick={() => setSelected(null)}><X size={18} style={{ color: "var(--muted)" }} /></button>
            </div>
            <div className="space-y-2.5 text-[13px]">
              {[
                ["Parcel ID", "PID-" + selected.survey.replace("/", "")],
                ["Survey Number", selected.survey],
                ["Owner Name", selected.owner],
                ["Area", selected.area],
                ["Land Classification", selected.type],
                ["Current Status", selected.status],
                ["Village / District / State", `${selected.village}, ${selected.district}, ${selected.state}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between" style={{ borderBottom: "1px dashed var(--border)" }}>
                  <span style={{ color: "var(--muted)" }} className="pb-2">{k}</span>
                  <span style={{ color: "var(--text)" }} className="font-semibold pb-2">{v}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Mutation Record.pdf", "Title Deed.pdf"].map((d) => (
                <span key={d} style={{ background: "var(--track)", color: "var(--text)" }} className="text-[11.5px] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5"><FileText size={12} /> {d}</span>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================================ COMPENSATION PAGE =========================== */
function CompensationPage() {
  const totalAmt = COMPENSATION_RECORDS.reduce((a, b) => a + b.amount, 0);
  const paidAmt = COMPENSATION_RECORDS.filter((r) => r.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const pendingAmt = totalAmt - paidAmt;
  const stats = [
    { label: "Total Compensation Amount", value: "₹1,890 Cr", icon: Wallet },
    { label: "Amount Paid", value: "₹1,428 Cr", icon: CheckCircle2 },
    { label: "Amount Pending", value: "₹462 Cr", icon: Clock },
    { label: "Beneficiaries", value: "18,940", icon: Users },
    { label: "Average Compensation", value: "₹9.98 L", icon: HandCoins },
  ];
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Compensation tracking" title="Compensation Dashboard" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <IconBubble icon={s.icon} bg={C.greenLight} fg={C.green} size={34} />
            <div style={{ color: "var(--text)" }} className="text-lg font-extrabold mt-2.5">{s.value}</div>
            <div style={{ color: "var(--muted)" }} className="text-[11px] mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <SectionTitle title="Payment Progress" />
        <ProgressBar value={75.6} color={C.green} h={14} />
        <div className="flex justify-between mt-2 text-xs" style={{ color: "var(--muted)" }}>
          <span>₹1,428 Cr disbursed</span><span className="font-bold" style={{ color: C.green }}>75.6% complete</span><span>₹462 Cr pending</span>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 lg:col-span-2">
          <SectionTitle title="Monthly Compensation Distribution (₹ Cr)" />
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="compensated" name="Compensation Cleared (₹Cr)" stroke={C.green} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Paid vs Pending" />
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={PAID_VS_PENDING} dataKey="value" nameKey="name" innerRadius={50} outerRadius={78} paddingAngle={2}>
                {PAID_VS_PENDING.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {PAID_VS_PENDING.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11.5px]">
                <span className="flex items-center gap-1.5" style={{ color: "var(--text)" }}><span style={{ background: s.color }} className="w-2.5 h-2.5 rounded-full" />{s.name}</span>
                <span style={{ color: "var(--muted)" }} className="font-bold">₹{s.value} Cr</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle title="State-wise Compensation Disbursed (₹ Cr)" />
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={STATE_COMPENSATION}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="state" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill={C.navy} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <SectionTitle title="Compensation Records" action={
          <button style={{ color: C.navy, borderColor: C.navy }} className="text-xs font-bold border rounded-lg px-3 py-1.5 flex items-center gap-1.5"><Download size={13} /> Export CSV</button>
        } />
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[820px]">
            <thead style={{ borderBottom: "1px solid var(--border)" }}>
              <tr>
                {["Beneficiary ID", "Project", "District", "Amount", "Payment Status", "Payment Date", "Verification"].map((h) => (
                  <th key={h} style={{ color: "var(--muted)" }} className="text-left px-3 py-3 text-[11px] font-bold uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPENSATION_RECORDS.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }} className="hover:bg-[var(--hover)]">
                  <td className="px-3 py-3 text-[12.5px] font-mono" style={{ color: C.navy }}>{r.id}</td>
                  <td className="px-3 py-3 text-[12.5px]" style={{ color: "var(--text)" }}>{r.project}</td>
                  <td className="px-3 py-3 text-[13px]" style={{ color: "var(--text)" }}>{r.district}</td>
                  <td className="px-3 py-3 text-[13px] font-semibold" style={{ color: "var(--text)" }}>{fmtINR(r.amount)}</td>
                  <td className="px-3 py-3"><Badge tone={statusTone(r.status)}>{r.status}</Badge></td>
                  <td className="px-3 py-3 text-[12px]" style={{ color: "var(--muted)" }}>{r.date}</td>
                  <td className="px-3 py-3"><Badge tone={statusTone(r.verify)}>{r.verify}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================= REHABILITATION PAGE =========================== */
function RehabilitationPage() {
  const stats = [
    { label: "Total Affected Families", value: "18,940", pct: 100 },
    { label: "Families Relocated", value: "9,820", pct: 52 },
    { label: "Compensation Received", value: "14,205", pct: 75 },
    { label: "Houses Provided", value: "6,940", pct: 37 },
    { label: "Employment Assistance", value: "4,110", pct: 22 },
    { label: "Pending Cases", value: "3,215", pct: 17, warn: true },
  ];
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Rehabilitation & resettlement" title="Rehabilitation Overview" />
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex justify-between items-baseline mb-2">
              <span style={{ color: "var(--muted)" }} className="text-[12px] font-semibold">{s.label}</span>
              <span style={{ color: "var(--text)" }} className="text-lg font-extrabold">{s.value}</span>
            </div>
            <ProgressBar value={s.pct} color={s.warn ? C.saffron : C.green} />
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle title="Resettlement Progress by Category" />
          <ResponsiveContainer width="100%" height={230}>
            <RadialBarChart
              innerRadius="30%" outerRadius="100%" data={[
                { name: "Relocated", value: 52, fill: C.navy },
                { name: "Compensated", value: 75, fill: C.green },
                { name: "Housed", value: 37, fill: C.saffron },
                { name: "Employed", value: 22, fill: C.blueInfo },
              ]}
              startAngle={90} endAngle={-270}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={8} />
              <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              <Tooltip />
            </RadialBarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Districts with Pending Rehabilitation" />
          <div className="space-y-3">
            {[
              { d: "Jajpur, Odisha", n: 705, sev: "danger" },
              { d: "Deoghar, Jharkhand", n: 212, sev: "danger" },
              { d: "Guntur, Andhra Pradesh", n: 340, sev: "amber" },
              { d: "Namakkal, Tamil Nadu", n: 188, sev: "warn" },
            ].map((r) => (
              <div key={r.d} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--track)" }}>
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: "var(--muted)" }} />
                  <span style={{ color: "var(--text)" }} className="text-[13px] font-medium">{r.d}</span>
                </div>
                <Badge tone={r.sev}>{r.n} pending</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ================================== GIS MAP PAGE ============================== */
function GisMapPage({ openProject }) {
  const [stateFilter, setStateFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [q, setQ] = useState("");
  const [activeState, setActiveState] = useState(null);

  const maxRow = Math.max(...STATE_GRID.map((s) => s.row));
  const maxCol = Math.max(...STATE_GRID.map((s) => s.col));

  const riskColor = { Low: C.green, Medium: C.saffron, High: C.amber, Critical: C.red };

  const filteredProjects = PROJECTS.filter(
    (p) =>
      (stateFilter === "All" || p.state === stateFilter) &&
      (statusFilter === "All" || p.status === statusFilter) &&
      (p.name.toLowerCase().includes(q.toLowerCase()) || p.district.toLowerCase().includes(q.toLowerCase()) || p.state.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Geo-spatial monitoring" title="GIS Land Acquisition Map" />

      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2 flex-1 min-w-[200px]" style={{ background: "var(--track)" }}>
            <Search size={15} style={{ color: "var(--muted)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search location, district, project..." style={{ color: "var(--text)" }} className="bg-transparent outline-none text-sm w-full" />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} style={{ background: "var(--track)", color: "var(--text)" }} className="text-sm rounded-lg px-3 py-2 outline-none">
            <option>All</option>
            {[...new Set(PROJECTS.map((p) => p.state))].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: "var(--track)", color: "var(--text)" }} className="text-sm rounded-lg px-3 py-2 outline-none">
            <option>All</option>
            <option>Completed</option><option>In Progress</option><option>Pending</option><option>Critical</option>
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ background: "var(--track)", color: "var(--text)" }} className="text-sm rounded-lg px-3 py-2 outline-none">
            <option>All Land Types</option><option>Agricultural</option><option>Residential</option><option>Commercial</option><option>Barren</option>
          </select>
        </div>
      </Card>

      <div className="grid lg:grid-cols-5 gap-5">
        <Card className="p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "var(--text)" }} className="text-sm font-bold">State-wise Project Grid Map</span>
            <div className="flex items-center gap-3 text-[10.5px]" style={{ color: "var(--muted)" }}>
              {Object.entries(riskColor).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1"><span style={{ background: v }} className="w-2 h-2 rounded-full" />{k}</span>
              ))}
            </div>
          </div>
          <div
            className="grid gap-1.5 select-none"
            style={{
              gridTemplateRows: `repeat(${maxRow + 1}, minmax(34px, 1fr))`,
              gridTemplateColumns: `repeat(${maxCol + 1}, minmax(34px, 1fr))`,
            }}
          >
            {STATE_GRID.map((s) => (
              <button
                key={s.name}
                onClick={() => setActiveState(s.name === activeState ? null : s.name)}
                title={s.name}
                style={{
                  gridRow: s.row + 1,
                  gridColumn: s.col + 1,
                  background: riskColor[s.risk],
                  opacity: activeState && activeState !== s.name ? 0.35 : 1,
                  outline: activeState === s.name ? `2px solid ${C.navyDeep}` : "none",
                  outlineOffset: 2,
                }}
                className="rounded-md flex flex-col items-center justify-center text-white text-[8.5px] font-bold leading-tight p-0.5 hover:scale-[1.08] transition-all duration-150 shadow-sm"
              >
                <span className="truncate w-full text-center">{s.name.split(" ").map((w) => w[0]).join("").slice(0, 3)}</span>
                <span className="text-[9px] opacity-90">{s.projects}</span>
              </button>
            ))}
          </div>
          <p style={{ color: "var(--muted)" }} className="text-[10.5px] mt-3">
            Illustrative statistical grid map (tile cartogram) — tile position approximates state location; tile colour reflects delay-risk level, and the number shows active projects. Click a tile to filter the list.
          </p>
        </Card>

        <Card className="p-5 lg:col-span-2 max-h-[430px] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span style={{ color: "var(--text)" }} className="text-sm font-bold">
              {activeState ? `Projects in ${activeState}` : "All Project Markers"}
            </span>
            {activeState && <button onClick={() => setActiveState(null)} style={{ color: C.navy }} className="text-xs font-bold">Clear</button>}
          </div>
          <div className="space-y-2.5 overflow-y-auto pr-1">
            {filteredProjects.filter((p) => !activeState || p.state === activeState).map((p) => (
              <button
                key={p.id}
                onClick={() => openProject(p)}
                style={{ background: "var(--track)" }}
                className="w-full text-left p-3 rounded-xl hover:shadow-sm transition-all flex items-start gap-2.5"
              >
                <span style={{ background: STATUS_COLOR[p.status] }} className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <div style={{ color: "var(--text)" }} className="text-[12.5px] font-bold truncate">{p.name}</div>
                  <div style={{ color: "var(--muted)" }} className="text-[11px] mt-0.5">{p.district}, {p.state}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                    <span style={{ color: "var(--muted)" }} className="text-[10.5px]">{p.area} Ha · {p.families} families</span>
                  </div>
                </div>
              </button>
            ))}
            {filteredProjects.length === 0 && <p style={{ color: "var(--muted)" }} className="text-sm text-center py-6">No matching projects.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* =============================== DOCUMENTS PAGE =============================== */
function DocumentsPage() {
  const docs = [
    { name: "Section-11 Notification — Ghazipur.pdf", project: "LA-2024-0182", type: "Notification", size: "1.2 MB", date: "18 Aug 2026" },
    { name: "Award Order — Palghar.pdf", project: "LA-2024-0157", type: "Award", size: "860 KB", date: "12 Aug 2026" },
    { name: "Compensation Statement — Guntur.xlsx", project: "LA-2024-0110", type: "Compensation", size: "410 KB", date: "20 Aug 2026" },
    { name: "Survey Sketch — Jajpur.pdf", project: "LA-2024-0143", type: "Survey", size: "2.4 MB", date: "05 Aug 2026" },
    { name: "Rehabilitation Plan — Bengaluru Rural.pdf", project: "LA-2024-0119", type: "Rehabilitation", size: "1.6 MB", date: "22 Jul 2026" },
    { name: "Title Deed Verification — Kutch.pdf", project: "LA-2024-0087", type: "Verification", size: "980 KB", date: "16 Aug 2026" },
  ];
  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Records repository" title="Documents" action={
        <button style={{ background: C.navy }} className="text-xs font-bold text-white rounded-lg px-3 py-2 flex items-center gap-1.5"><FolderOpen size={14} /> Upload Document</button>
      } />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {docs.map((d) => (
          <Card key={d.name} className="p-4 flex items-start gap-3">
            <IconBubble icon={FileText} bg={C.blueInfoLight} fg={C.blueInfo} />
            <div className="min-w-0 flex-1">
              <div style={{ color: "var(--text)" }} className="text-[13px] font-bold truncate">{d.name}</div>
              <div style={{ color: "var(--muted)" }} className="text-[11px] mt-1">{d.project} · {d.size}</div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge tone="navy">{d.type}</Badge>
                <span style={{ color: "var(--muted)" }} className="text-[10.5px]">{d.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================= REPORTS & ANALYTICS PAGE ======================= */
function ReportsPage({ showToast }) {
  return (
    <div className="space-y-6">
      <SectionTitle eyebrow="Insights" title="Reports & Analytics" action={
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => showToast("Report export started (demo)")} style={{ color: C.navy, borderColor: C.navy }} className="text-xs font-bold border rounded-lg px-3 py-2 flex items-center gap-1.5"><FileText size={13} /> Export Report</button>
          <button onClick={() => showToast("Generating PDF preview (demo)")} style={{ color: C.navy, borderColor: C.navy }} className="text-xs font-bold border rounded-lg px-3 py-2 flex items-center gap-1.5"><Download size={13} /> Generate PDF</button>
          <button onClick={() => showToast("CSV download started (demo)")} style={{ background: C.navy }} className="text-xs font-bold text-white rounded-lg px-3 py-2 flex items-center gap-1.5"><Download size={13} /> Download CSV</button>
        </div>
      } />

      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle title="State-wise Acquisition (Projects)" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={STATE_GRID.slice(0, 10).sort((a,b)=>b.projects-a.projects)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="projects" radius={[6, 6, 0, 0]} fill={C.green} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Project Completion Rate" />
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={STATUS_SPLIT} dataKey="value" nameKey="name" innerRadius={0} outerRadius={85} label={(e) => `${e.name} ${(e.percent * 100).toFixed(0)}%`}>
                {STATUS_SPLIT.map((s, i) => <Cell key={i} fill={s.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Acquisition Progress Trend" />
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="m" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="acquired" name="Acquired" stroke={C.navy} strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="compensated" name="Compensated" stroke={C.green} strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <SectionTitle title="Delay Analysis — Avg. Days by Cause" />
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DELAY_ANALYSIS} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="cause" type="category" width={110} tick={{ fontSize: 10.5 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="days" radius={[0, 6, 6, 0]} fill={C.saffron} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <SectionTitle title="Rehabilitation Statistics" />
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { l: "Relocated", v: 52 }, { l: "Compensated", v: 75 }, { l: "Housed", v: 37 }, { l: "Employed", v: 22 },
          ].map((s) => (
            <div key={s.l}>
              <div className="flex justify-between mb-1.5">
                <span style={{ color: "var(--text)" }} className="text-[12.5px] font-medium">{s.l}</span>
                <span style={{ color: C.navy }} className="text-[12.5px] font-bold">{s.v}%</span>
              </div>
              <ProgressBar value={s.v} color={C.navy} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* =================================== ALERTS PAGE =============================== */
function AlertsPage({ alerts, setAlerts }) {
  const [filter, setFilter] = useState("All");
  const rows = alerts.filter((a) => filter === "All" || a.sev === filter);
  const markRead = (id) => setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));

  return (
    <div className="space-y-5">
      <SectionTitle eyebrow="Alert center" title="Alerts & Notifications" action={
        <button onClick={markAllRead} style={{ color: C.navy, borderColor: C.navy }} className="text-xs font-bold border rounded-lg px-3 py-2">Mark all as read</button>
      } />
      <div className="flex gap-2 flex-wrap">
        {["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{ background: filter === s ? C.navy : "var(--track)", color: filter === s ? "#fff" : "var(--text)" }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {rows.map((a) => (
          <Card key={a.id} className="p-4 flex items-start gap-3" style={{ opacity: a.read ? 0.65 : 1, borderLeft: `4px solid ${ {CRITICAL:C.red,HIGH:C.amber,MEDIUM:C.saffron,LOW:C.blueInfo}[a.sev] }` }}>
            <IconBubble icon={AlertTriangle} bg={{CRITICAL:C.redLight,HIGH:C.amberLight,MEDIUM:C.saffronLight,LOW:C.blueInfoLight}[a.sev]} fg={{CRITICAL:C.red,HIGH:C.amber,MEDIUM:C.saffron,LOW:C.blueInfo}[a.sev]} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge tone={sevTone(a.sev)}>{a.sev}</Badge>
                <Badge tone="navy">{a.cat}</Badge>
                {!a.read && <span style={{ background: C.red }} className="w-1.5 h-1.5 rounded-full" />}
              </div>
              <div style={{ color: "var(--text)" }} className="text-[13.5px] font-semibold">{a.msg}</div>
              <div style={{ color: "var(--muted)" }} className="text-[12px] mt-1">{a.project}</div>
              <div style={{ color: "var(--muted)" }} className="text-[11px] mt-1">{a.time}</div>
            </div>
            {!a.read && (
              <button onClick={() => markRead(a.id)} style={{ color: C.navy }} className="text-xs font-bold whitespace-nowrap">Mark as read</button>
            )}
          </Card>
        ))}
        {rows.length === 0 && <p style={{ color: "var(--muted)" }} className="text-sm text-center py-10">No alerts in this category.</p>}
      </div>
    </div>
  );
}

/* =================================== SETTINGS PAGE ============================== */
function SettingsPage({ dark, setDark }) {
  const [rows, setRows] = useState({ email: true, sms: false, weekly: true, autoRefresh: true });
  const toggle = (k) => setRows((r) => ({ ...r, [k]: !r[k] }));
  const Toggle = ({ on, onClick }) => (
    <button onClick={onClick} style={{ background: on ? C.green : "var(--border)" }} className="w-11 h-6 rounded-full relative transition-colors duration-200">
      <span style={{ left: on ? 22 : 3 }} className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200" />
    </button>
  );
  return (
    <div className="space-y-5 max-w-2xl">
      <SectionTitle eyebrow="Preferences" title="Settings" />
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div style={{ color: "var(--text)" }} className="text-sm font-bold">Dark Mode</div>
            <div style={{ color: "var(--muted)" }} className="text-[12px]">Switch between light and dark interface themes.</div>
          </div>
          <Toggle on={dark} onClick={() => setDark((v) => !v)} />
        </div>
        {[
          ["email", "Email Notifications", "Receive alerts and updates on your registered email."],
          ["sms", "SMS Alerts", "Receive critical alerts via SMS."],
          ["weekly", "Weekly Summary Report", "Get a digest of key metrics every Monday."],
          ["autoRefresh", "Auto-refresh Dashboard", "Automatically refresh live data every 5 minutes."],
        ].map(([k, t, d]) => (
          <div key={k} style={{ borderTop: "1px solid var(--border)" }} className="flex items-center justify-between pt-4">
            <div>
              <div style={{ color: "var(--text)" }} className="text-sm font-bold">{t}</div>
              <div style={{ color: "var(--muted)" }} className="text-[12px]">{d}</div>
            </div>
            <Toggle on={rows[k]} onClick={() => toggle(k)} />
          </div>
        ))}
      </Card>
      <Card className="p-5">
        <div style={{ color: "var(--text)" }} className="text-sm font-bold mb-1">About this prototype</div>
        <p style={{ color: "var(--muted)" }} className="text-[12.5px] leading-relaxed">
          Built for Smart India Hackathon problem statement SIH26016 — Real-Time National Land Acquisition &amp; Management System, Ministry of Rural Development. Frontend-only demonstration; all data shown is simulated for presentation purposes.
        </p>
      </Card>
    </div>
  );
}

/* =================================== LANDING PAGE =============================== */
function LandingPage({ onEnter, onMap }) {
  const features = [
    { icon: Activity, title: "Real-Time Monitoring", text: "Live progress tracking across survey, notification, approval, compensation and possession stages." },
    { icon: Map, title: "GIS-Based Land Management", text: "Visualise projects across states with status-coded markers and drill-down details." },
    { icon: Wallet, title: "Transparent Compensation", text: "End-to-end visibility of disbursals, pending dues and beneficiary verification." },
    { icon: HomeIcon, title: "Rehabilitation & Resettlement", text: "Track relocation, housing and employment-assistance outcomes for affected families." },
    { icon: Sparkles, title: "Decision Support", text: "Simulated risk signals highlight delay-prone projects and bottleneck districts." },
    { icon: BarChart3, title: "Analytics", text: "State and district-level reports on acquisition, compensation and delay patterns." },
  ];
  return (
    <div style={{ background: "var(--bg)" }} className="min-h-screen">
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }} className="sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 h-16">
          <div className="flex items-center gap-3">
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.green})` }} className="w-9 h-9 rounded-lg flex items-center justify-center">
              <Landmark size={18} color="#fff" />
            </div>
            <div>
              <div style={{ color: "var(--text)" }} className="text-[13px] font-extrabold leading-tight">NLAMS</div>
              <div style={{ color: "var(--muted)" }} className="text-[10.5px] leading-tight">Ministry of Rural Development</div>
            </div>
          </div>
          <button onClick={onEnter} style={{ background: C.navy }} className="text-white text-sm font-bold px-4 py-2 rounded-xl hover:shadow-md transition-all">
            Explore Dashboard
          </button>
        </div>
      </header>

      <section style={{ background: `radial-gradient(circle at 80% -10%, ${C.navyLight}, transparent 55%)` }} className="max-w-6xl mx-auto px-5 pt-16 pb-14 text-center">
        <div style={{ color: C.green, background: C.greenLight }} className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full mb-6">
          <Sparkles size={12} /> Smart India Hackathon · SIH26016
        </div>
        <h1 style={{ color: "var(--text)" }} className="text-3xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          National Land Acquisition &amp; Management System
        </h1>
        <p style={{ color: "var(--muted)" }} className="mt-5 text-base md:text-lg max-w-xl mx-auto">
          Transparent. Real-Time. Data-Driven Land Acquisition Management.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <button onClick={onEnter} style={{ background: C.navy }} className="text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all">
            Explore Dashboard <ChevronRight size={17} />
          </button>
          <button onClick={onMap} style={{ borderColor: C.navy, color: C.navy }} className="border font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[var(--hover)] transition-all">
            <Map size={17} /> View GIS Map
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 max-w-3xl mx-auto">
          {[
            { v: "48,216", l: "Land Parcels Tracked" },
            { v: "1,070", l: "Active Projects" },
            { v: "₹1,428 Cr", l: "Compensation Disbursed" },
            { v: "18,940", l: "Families Supported" },
          ].map((s) => (
            <div key={s.l} style={{ background: "var(--surface)", border: "1px solid var(--border)" }} className="rounded-2xl p-4">
              <div style={{ color: C.navy }} className="text-xl font-extrabold">{s.v}</div>
              <div style={{ color: "var(--muted)" }} className="text-[11px] mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-16">
        <div className="text-center mb-10">
          <div style={{ color: C.green }} className="text-[11px] font-bold tracking-[0.14em] uppercase mb-2">About the system</div>
          <h2 style={{ color: "var(--text)" }} className="text-2xl font-extrabold">Key Features</h2>
          <p style={{ color: "var(--muted)" }} className="mt-2 max-w-xl mx-auto text-sm">
            A unified digital platform for monitoring land acquisition end-to-end — built for accountability, speed and citizen trust.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} style={{ background: "var(--surface)", border: "1px solid var(--border)" }} className="rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <IconBubble icon={f.icon} bg={C.navyLight} fg={C.navy} />
              <div style={{ color: "var(--text)" }} className="text-[15px] font-bold mt-3">{f.title}</div>
              <div style={{ color: "var(--muted)" }} className="text-[12.5px] mt-1.5 leading-relaxed">{f.text}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: C.navyDeep }} className="text-white/80">
        <div className="max-w-6xl mx-auto px-5 py-10 grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-white font-extrabold text-sm">Government of India</div>
            <div className="text-[12.5px] mt-1">Ministry of Rural Development</div>
            <div className="text-[11.5px] mt-3 max-w-sm text-white/60">
              National Land Acquisition &amp; Management System — Smart India Hackathon 2026 prototype (SIH26016).
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end text-[12.5px] items-start">
            {["Privacy Policy", "Terms & Conditions", "Accessibility", "Contact", "Help & Support"].map((l) => (
              <span key={l} className="hover:text-white cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ===================================== APP ROOT ================================== */
export default function App() {
  const [entered, setEntered] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [project, setProject] = useState(null);
  const [alerts, setAlerts] = useState(ALERTS_DATA);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const unread = alerts.filter((a) => !a.read).length;

  const vars = dark
    ? { "--bg": "#0b1620", "--surface": "#101d29", "--text": "#eaf1f6", "--muted": "#8fa3b3", "--border": "#1d2c3a", "--hover": "#16232f", "--track": "#16232f" }
    : { "--bg": "#f4f7f9", "--surface": "#ffffff", "--text": "#122436", "--muted": "#5b7286", "--border": "#e4eaee", "--hover": "#f1f5f8", "--track": "#f0f4f7" };

  if (!entered) {
    return (
      <div style={vars} className={dark ? "dark" : ""}>
        <GlobalStyle />
        <LandingPage onEnter={() => { setEntered(true); setPage("dashboard"); }} onMap={() => { setEntered(true); setPage("gis"); }} />
      </div>
    );
  }

  const pages = {
    dashboard: <DashboardHome setPage={setPage} openProject={setProject} />,
    acquisition: <LandAcquisitionPage />,
    records: <LandRecordsPage />,
    projects: <ProjectsPage openProject={setProject} />,
    compensation: <CompensationPage />,
    rehabilitation: <RehabilitationPage />,
    gis: <GisMapPage openProject={setProject} />,
    documents: <DocumentsPage />,
    reports: <ReportsPage showToast={showToast} />,
    alerts: <AlertsPage alerts={alerts} setAlerts={setAlerts} />,
    settings: <SettingsPage dark={dark} setDark={setDark} />,
  };

  return (
    <div style={{ ...vars, background: "var(--bg)", minHeight: "100vh" }} className={dark ? "dark" : ""}>
      <GlobalStyle />
      <Header
        collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} setDark={setDark}
        setMobileOpen={setMobileOpen} page={page} setPage={setPage} unread={unread}
      />
      <div className="flex">
        <Sidebar page={page} setPage={setPage} collapsed={collapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 min-w-0 p-4 md:p-6 animate-[fadeIn_.3s_ease]">
          <div className="max-w-[1400px] mx-auto">{pages[page]}</div>
        </main>
      </div>
      <ProjectDetailModal project={project} onClose={() => setProject(null)} />
      <Toast toast={toast} />
    </div>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      body { font-family: 'Segoe UI', 'Inter', system-ui, -apple-system, sans-serif; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes popIn { from { opacity: 0; transform: scale(.97) translateY(4px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 8px; }
      select { -webkit-appearance: none; appearance: none; }
    `}</style>
  );
}
