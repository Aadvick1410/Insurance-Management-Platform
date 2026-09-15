import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  FiUsers,
  FiShield,
  FiAlertCircle,
  FiFileText,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiRefreshCw,
  FiDownload,
  FiTrendingUp,
  FiClock,
  FiChevronRight,
  FiActivity,
} from 'react-icons/fi';
import { getDashboardMetrics, downloadMonthlyReportPdf } from '../../services/reportService';
import toast from 'react-hot-toast';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

/* =========================================================
   MOCK / DEMO DATA
   Set VITE_USE_MOCK_DATA=true in Vercel env vars for demo.
   Set VITE_USE_MOCK_DATA=false (or omit) for production.
========================================================= */
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const MOCK_DATA = {
  // Primary KPIs â€” field names match DashboardMetricsResponse DTO exactly
  totalCustomers: 1248,
  totalActivePolicies: 986,
  totalExpiredPolicies: 142,
  totalPendingClaims: 37,
  totalRevenue: 4872650,
  totalOverduePayments: 18,

  // Charts â€” backend returns Map<String,Long>; mock uses same shape
  policiesByType: {
    Health: 382,
    Life: 298,
    Vehicle: 241,
    Home: 126,
    Travel: 81,
  },
  claimsByStatus: {
    APPROVED: 324,
    PENDING: 37,
    REJECTED: 46,
  },
  monthlyRevenue: {
    '2026-04': 285000,
    '2026-05': 338000,
    '2026-06': 310000,
    '2026-07': 397000,
    '2026-08': 442000,
    '2026-09': 518000,
  },

  // Extra fields only used in mock/demo mode
  approvedClaims: 324,
  rejectedClaims: 46,
  premiumPayments: 864,

  recentActivity: [
    { id: 1, title: 'Claim CLM-2026-0418 submitted',  subtitle: 'Health Insurance â€¢ Aarav Sharma',  time: '8 min ago',  status: 'PENDING'  },
    { id: 2, title: 'Premium payment received',        subtitle: 'â‚¹24,500 â€¢ POL-2026-1092',          time: '24 min ago', status: 'PAID'     },
    { id: 3, title: 'New policy activated',            subtitle: 'Vehicle Insurance â€¢ POL-2026-1128', time: '1 hr ago',   status: 'ACTIVE'   },
    { id: 4, title: 'Claim CLM-2026-0407 approved',   subtitle: 'â‚¹85,000 settlement',               time: '2 hrs ago',  status: 'APPROVED' },
    { id: 5, title: 'New customer registered',         subtitle: 'Meera Kapoor â€¢ CUS-1248',          time: '3 hrs ago',  status: 'NEW'      },
  ],
};

/* =========================================================
   FORMATTERS
========================================================= */
const currency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const number = (value) =>
  new Intl.NumberFormat('en-IN').format(Number(value || 0));

const pct = (part, total) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

/* =========================================================
   CHART COLOURS
========================================================= */
const CHART_COLORS = ['#4f46e5', '#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const claimColor = (status) => {
  const s = String(status).toLowerCase();
  if (s === 'approved') return '#10b981';
  if (s === 'pending')  return '#f59e0b';
  if (s === 'rejected') return '#ef4444';
  return '#6366f1';
};

/* =========================================================
   SMALL REUSABLE COMPONENTS
========================================================= */
function Card({ children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, topBorderColor, to }) {
  const content = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
        <Icon size={20} />
      </div>
    </div>
  );

  return (
    <Card className={`p-5 border-t-4 ${topBorderColor} transition hover:-translate-y-0.5 hover:shadow-md group cursor-pointer`}>
      {to ? <Link to={to} className="block">{content}</Link> : content}
    </Card>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-0.5 text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = String(status || '').toLowerCase();
  let cls = 'bg-slate-100 text-slate-700';
  if (['approved', 'active', 'paid'].includes(s)) cls = 'bg-emerald-50 text-emerald-700';
  else if (['pending'].includes(s))               cls = 'bg-amber-50 text-amber-700';
  else if (['rejected', 'expired', 'overdue'].includes(s)) cls = 'bg-red-50 text-red-700';
  else if (['new'].includes(s))                   cls = 'bg-blue-50 text-blue-700';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}

function ProgressRow({ label, value, total, colorClass }) {
  const w = pct(value, total);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">
          {number(value)}
          <span className="ml-1.5 font-normal text-slate-400">{w}%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
      <FiActivity size={28} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function AttentionItem({ value, title, subtitle, toneClass, to }) {
  const content = (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0 group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-xl px-2 text-sm font-bold transition-transform group-hover:scale-105 ${toneClass}`}>
          {number(value)}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">{title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <FiChevronRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-600" />
    </div>
  );
  return to ? <Link to={to} className="block">{content}</Link> : content;
}

/* =========================================================
   DASHBOARD PAGE
========================================================= */
const ReportsDashboard = () => {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [downloading, setDownloading] = useState(false);
  const [refreshing, setRefreshing]   = useState(false);
  const [dateRange, setDateRange]     = useState('6months');

  const fetchData = async () => {
    try {
      setError('');
      if (USE_MOCK_DATA) {
        await new Promise((r) => setTimeout(r, 350));
        setData(MOCK_DATA);
      } else {
        const raw = await getDashboardMetrics();
        setData(raw);
      }
    } catch (err) {
      console.error('[Dashboard] fetch failed:', err);
      setError('Dashboard data could not be loaded. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadMonthlyReportPdf();
      toast.success('Report downloaded successfully');
    } catch {
      toast.error('Failed to download PDF report');
    } finally {
      setDownloading(false);
    }
  };

  /* derived */
  const totalPolicies = useMemo(
    () => Number(data?.totalActivePolicies || 0) + Number(data?.totalExpiredPolicies || 0),
    [data]
  );

  const totalClaims = useMemo(() => {
    if (!data?.claimsByStatus) return 0;
    return Object.values(data.claimsByStatus).reduce((s, v) => s + Number(v || 0), 0);
  }, [data]);

  /* revenue chart */
  const revenueChartData = useMemo(() => {
    if (!data?.monthlyRevenue) return null;
    const sorted = Object.keys(data.monthlyRevenue).sort();
    const labels = sorted.map((k) => {
      const d = new Date(k + '-01');
      return d.toLocaleString('default', { month: 'short' });
    });
    const values = sorted.map((k) => Number(data.monthlyRevenue[k] || 0));
    if (values.every((v) => v === 0)) return null;
    return {
      labels,
      datasets: [{
        label: 'Premium Revenue',
        data: values,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.10)',
        pointBackgroundColor: '#4f46e5',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      }],
    };
  }, [data]);

  /* policy type chart */
  const policyChartData = useMemo(() => {
    if (!data?.policiesByType) return null;
    const keys   = Object.keys(data.policiesByType);
    const values = Object.values(data.policiesByType).map(Number);
    if (values.every((v) => v === 0)) return null;
    return {
      labels: keys,
      datasets: [{ data: values, backgroundColor: CHART_COLORS, borderWidth: 0, hoverOffset: 5 }],
    };
  }, [data]);

  /* claims chart */
  const claimChartData = useMemo(() => {
    if (!data?.claimsByStatus) return null;
    const keys   = Object.keys(data.claimsByStatus);
    const values = Object.values(data.claimsByStatus).map(Number);
    if (values.every((v) => v === 0)) return null;
    return {
      labels: keys,
      datasets: [{ data: values, backgroundColor: keys.map(claimColor), borderWidth: 0, hoverOffset: 5 }],
    };
  }, [data]);

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => ` Revenue: ${currency(ctx.raw)}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#64748b',
          callback: (v) => {
            if (v >= 100000) return `â‚¹${(v / 100000).toFixed(1)}L`;
            if (v >= 1000)   return `â‚¹${Math.round(v / 1000)}K`;
            return `â‚¹${v}`;
          },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 8, padding: 16, color: '#475569' },
      },
    },
  };

  /* LOADING */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8 h-9 w-64 animate-pulse rounded-xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[1,2,3,4,5].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <div className="h-96 animate-pulse rounded-2xl bg-white xl:col-span-2" />
            <div className="h-96 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  /* RENDER */
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">

        {/* HEADER */}
        <header className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Dashboard &amp; Reports
              </h1>
              {USE_MOCK_DATA && (
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                  Demo Data
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-slate-500">
              Monitor customers, policies, claims and premium performance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
            >
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <FiRefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              aria-label="Download PDF report"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              <FiDownload size={15} />
              {downloading ? 'Generatingâ€¦' : 'Download PDF Report'}
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button onClick={fetchData} className="font-semibold underline">Retry</button>
          </div>
        )}

        {/* OVERDUE ALERT */}
        {data?.totalOverduePayments > 0 && (
          <Link to="/payments" className="block mb-6">
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 transition hover:bg-amber-100 cursor-pointer">
              <FiAlertCircle size={18} className="shrink-0" />
              <span>
                <strong>{number(data.totalOverduePayments)}</strong> overdue premium payments require follow-up.
              </span>
            </div>
          </Link>
        )}

        {/* PRIMARY KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard to="/customers" title="Total Customers"  value={number(data?.totalCustomers)}        subtitle="Registered customers" icon={FiUsers}       topBorderColor="border-blue-500"   />
          <StatCard to="/policies"  title="Active Policies"  value={number(data?.totalActivePolicies)}   subtitle="Currently active"     icon={FiShield}      topBorderColor="border-emerald-500"/>
          <StatCard to="/policies"  title="Expired Policies" value={number(data?.totalExpiredPolicies)}  subtitle="Requires attention"   icon={FiAlertCircle} topBorderColor="border-red-500"    />
          <StatCard to="/claims"    title="Pending Claims"   value={number(data?.totalPendingClaims)}    subtitle="Awaiting review"      icon={FiFileText}    topBorderColor="border-amber-500"  />
          <StatCard to="/payments"  title="Total Revenue"    value={currency(data?.totalRevenue)}        subtitle="Premium collected"    icon={FiDollarSign}  topBorderColor="border-indigo-500" />
        </div>

        {/* SECONDARY MINI STATS â€” mock only */}
        {USE_MOCK_DATA && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="Total Policies"   value={number(totalPolicies)}          icon={FiShield}      />
            <MiniStat label="Claims Approved"  value={number(data?.approvedClaims)}   icon={FiCheckCircle} />
            <MiniStat label="Claims Rejected"  value={number(data?.rejectedClaims)}   icon={FiXCircle}     />
            <MiniStat label="Premium Payments" value={number(data?.premiumPayments)}  icon={FiCreditCard}  />
          </div>
        )}

        {/* ROW 1: Revenue + Policy Type */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <Card className="p-5 sm:p-6 xl:col-span-2">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Monthly Revenue</h2>
                <p className="mt-1 text-sm text-slate-500">Premium collection performance</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                <FiTrendingUp size={13} />
                Revenue
              </div>
            </div>
            <div className="h-[300px]">
              {revenueChartData
                ? <Line data={revenueChartData} options={revenueOptions} />
                : <EmptyChart message="No revenue data available yet." />}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Policies by Type</h2>
            <p className="mt-1 text-sm text-slate-500">Portfolio distribution</p>
            <div className="relative mt-4 h-[300px]">
              {policyChartData ? (
                <>
                  <Doughnut data={policyChartData} options={doughnutOptions} />
                  <div className="pointer-events-none absolute left-1/2 top-[41%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{number(totalPolicies)}</p>
                  </div>
                </>
              ) : (
                <EmptyChart message="No policy data available yet." />
              )}
            </div>
          </Card>
        </div>

        {/* ROW 2: Claims + Policy Overview + Attention */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Claims Status Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Current claim distribution</p>
            <div className="relative mt-4 h-[280px]">
              {claimChartData ? (
                <>
                  <Doughnut data={claimChartData} options={doughnutOptions} />
                  <div className="pointer-events-none absolute left-1/2 top-[41%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{number(totalClaims)}</p>
                  </div>
                </>
              ) : (
                <EmptyChart message="No claim data available yet." />
              )}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Policy Overview</h2>
            <p className="mt-1 text-sm text-slate-500">Portfolio health</p>
            <div className="mt-7 space-y-7">
              <ProgressRow label="Active Policies"  value={data?.totalActivePolicies  || 0} total={totalPolicies} colorClass="bg-emerald-500" />
              <ProgressRow label="Expired Policies" value={data?.totalExpiredPolicies || 0} total={totalPolicies} colorClass="bg-red-500"     />
            </div>
            <div className="mt-8 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Active portfolio rate</span>
                <span className="font-bold text-slate-900">
                  {pct(data?.totalActivePolicies || 0, totalPolicies)}%
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Percentage of policies currently active across the insurance portfolio.
              </p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <FiClock size={18} className="text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900">Attention Required</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">Items requiring operational review</p>
            <div className="mt-5 divide-y divide-slate-100">
              <AttentionItem to="/claims"   value={data?.totalPendingClaims    || 0} title="Pending Claims"   subtitle="Awaiting review"             toneClass="bg-amber-50 text-amber-700"   />
              <AttentionItem to="/policies" value={data?.totalExpiredPolicies  || 0} title="Expired Policies" subtitle="Renewal follow-up required"   toneClass="bg-red-50 text-red-700"       />
              <AttentionItem to="/payments" value={data?.totalOverduePayments  || 0} title="Overdue Premiums" subtitle="Payment follow-up required"   toneClass="bg-violet-50 text-violet-700" />
            </div>
          </Card>
        </div>

        {/* RECENT ACTIVITY â€” only rendered in demo mode */}
        {USE_MOCK_DATA && data?.recentActivity?.length > 0 && (
          <Card className="mt-6 overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-2">
                <FiActivity size={18} className="text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
              </div>
              <p className="mt-1 text-sm text-slate-500">Latest activity across your insurance operations</p>
            </div>
            <div className="divide-y divide-slate-100">
              {data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <FiActivity size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-14 sm:pl-0">
                    <span className="text-xs text-slate-400">{item.time}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

      </main>
    </div>
  );
};

export default ReportsDashboard;
