import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeads, updateLeadStatus, deleteLead } from '../api/leads';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { formatDate } from '../utils/formatters';
import {
  Search,
  LogOut,
  Trash2,
  RefreshCw,
  Inbox,
  Users,
  CheckCircle2,
  Clock,
  Archive,
  Filter,
  X
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, leadId: null, leadName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state per lead id
  const [updatingId, setUpdatingId] = useState(null);

  // Toast notification
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' });

  // Protect route check
  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  const loadLeads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetchLeads();
      if (res.success && Array.isArray(res.data)) {
        setLeads(res.data);
      } else {
        setLeads([]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load leads. Please check your backend connection.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadLeads();
    }
  }, [token]);

  // Handle status update
  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    try {
      const res = await updateLeadStatus(leadId, newStatus);
      if (res.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead._id === leadId ? { ...lead, status: newStatus } : lead))
        );
        setToast({ show: true, type: 'success', message: `Lead status updated to "${newStatus}"` });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update lead status.';
      setToast({ show: true, type: 'error', message: msg });
    } finally {
      setUpdatingId(null);
    }
  };

  // Confirm delete handler
  const confirmDelete = async () => {
    if (!deleteModal.leadId) return;

    setIsDeleting(true);
    try {
      const res = await deleteLead(deleteModal.leadId);
      if (res.success) {
        setLeads((prev) => prev.filter((lead) => lead._id !== deleteModal.leadId));
        setToast({ show: true, type: 'success', message: 'Lead deleted successfully' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete lead.';
      setToast({ show: true, type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, leadId: null, leadName: '' });
    }
  };

  // Filtered leads calculation (Name & Email search)
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (lead.name && lead.name.toLowerCase().includes(query)) ||
        (lead.email && lead.email.toLowerCase().includes(query));

      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  // Metrics summary
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
    const closedCount = leads.filter((l) => l.status === 'Closed').length;
    return { total, newCount, contactedCount, closedCount };
  }, [leads]);

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-900/5 dark:shadow-black/20 border border-slate-200/90 dark:border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F8FAFC] tracking-tight">Admin Lead Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-[#CBD5E1] mt-1">
            Manage incoming sales leads, update statuses, and monitor conversion pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLeads}
            disabled={isLoading}
            className="p-2.5 text-slate-600 dark:text-[#CBD5E1] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-[#CBD5E1] uppercase tracking-wider">Total Leads</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-[#F8FAFC] mt-0.5">{metrics.total}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-[#CBD5E1] uppercase tracking-wider">New Leads</p>
            <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{metrics.newCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-500/20">
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-[#CBD5E1] uppercase tracking-wider">Contacted</p>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{metrics.contactedCount}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1E293B] p-5 rounded-2xl border border-slate-200/90 dark:border-[#334155] shadow-lg shadow-slate-900/5 dark:shadow-black/20 flex items-center gap-4 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-[#CBD5E1] uppercase tracking-wider">Closed</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{metrics.closedCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl shadow-slate-900/5 dark:shadow-black/20 border border-slate-200/90 dark:border-[#334155] overflow-hidden transition-all">
        
        {/* Search & Filter Header Bar */}
        <div className="p-6 border-b border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name or Email..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0F172A] text-sm text-slate-900 dark:text-[#F8FAFC] placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Status Pill Filter */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {['All', 'New', 'Contacted', 'Closed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        {error ? (
          <div className="p-12 text-center text-red-600 dark:text-red-400">
            <p className="font-semibold text-lg">{error}</p>
            <button
              onClick={loadLeads}
              className="mt-4 px-4 py-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/20 hover:bg-red-100 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-16 text-center text-slate-500 dark:text-[#CBD5E1] flex flex-col items-center justify-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium">Fetching lead records...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-2">
              <Inbox className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-700 dark:text-[#F8FAFC]">No leads found</h4>
            <p className="text-xs text-slate-500 dark:text-[#CBD5E1] max-w-sm">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search query or filter criteria.'
                : 'No leads have been submitted yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-[#0F172A]/50 border-b border-slate-200 dark:border-[#334155] text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Budget</th>
                  <th className="py-4 px-6 max-w-xs">Message</th>
                  <th className="py-4 px-6">Status Badge</th>
                  <th className="py-4 px-6">Update Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#334155]/60 text-sm">
                {filteredLeads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-[#F8FAFC] whitespace-nowrap">
                      {lead.name}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-600 dark:text-[#CBD5E1] whitespace-nowrap">
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
                      >
                        {lead.email}
                      </a>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs">
                        {lead.budget}
                      </span>
                    </td>

                    {/* Message */}
                    <td className="py-4 px-6 text-slate-600 dark:text-[#CBD5E1] max-w-xs leading-relaxed">
                      <p className="line-clamp-2" title={lead.message}>
                        {lead.message}
                      </p>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={lead.status || 'New'} />
                    </td>

                    {/* Status Dropdown Selector */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status || 'New'}
                          disabled={updatingId === lead._id}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-[#334155] text-xs font-bold text-slate-800 dark:text-[#F8FAFC] bg-white dark:bg-[#0F172A] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
                        >
                          <option value="New" className="dark:bg-[#0F172A]">New</option>
                          <option value="Contacted" className="dark:bg-[#0F172A]">Contacted</option>
                          <option value="Closed" className="dark:bg-[#0F172A]">Closed</option>
                        </select>

                        {updatingId === lead._id && (
                          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDate(lead.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <button
                        onClick={() =>
                          setDeleteModal({
                            isOpen: true,
                            leadId: lead._id,
                            leadName: lead.name,
                          })
                        }
                        className="p-2 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Summary in Table */}
        {!isLoading && !error && filteredLeads.length > 0 && (
          <div className="p-4 bg-slate-50/80 dark:bg-[#0F172A]/50 border-t border-slate-200 dark:border-[#334155] text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>
              Showing <strong>{filteredLeads.length}</strong> of <strong>{leads.length}</strong> total leads
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Lead"
        message={`Are you sure you want to delete the lead from "${deleteModal.leadName}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, leadId: null, leadName: '' })}
        isLoading={isDeleting}
      />

      {/* Toast Notification */}
      {toast.show && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast({ show: false, type: 'success', message: '' })}
        />
      )}
    </div>
  );
}
