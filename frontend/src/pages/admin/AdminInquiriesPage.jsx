import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Search, 
  Eye, 
  MessageSquare, 
  Sparkles,
  Inbox,
  Send,
  MessageCircle
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { formatDate } from '../../utils/formatters';
import { 
  generateInquiryReplyEmail, 
  generateOwnerInquiryEmail, 
  generateWhatsAppInquiryUrl 
} from '../../utils/emailService';

export const AdminInquiriesPage = () => {
  const { inquiries, deleteInquiry, toggleInquiryRead, contactInfo } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All'); // 'All' | 'unread' | 'Custom Craft Request' | 'Contact Form Message'
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [viewingInquiry, setViewingInquiry] = useState(null);

  const ownerEmail = contactInfo?.ownerEmail || contactInfo?.email || 'candycraftssstudio@gmail.com';

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch = 
      !searchQuery.trim() ||
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.subject && inq.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = 
      filterType === 'All' ? true :
      filterType === 'unread' ? !inq.read :
      inq.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleDeleteConfirm = () => {
    if (inquiryToDelete) {
      deleteInquiry(inquiryToDelete.id);
      setInquiryToDelete(null);
    }
  };

  const handleOpenView = (inq) => {
    setViewingInquiry(inq);
    if (!inq.read) {
      toggleInquiryRead(inq.id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-walnut-900">
            Customer Inquiries & Messages
          </h2>
          <p className="text-xs text-walnut-500">
            Messages sent from the Contact page and Custom Craft request modal appear here in real time.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-terracotta-50 border border-terracotta-200 text-xs font-semibold text-terracotta-700 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>Owner Inbox: {ownerEmail}</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-cream-100 border border-cream-200 text-xs font-semibold text-walnut-700">
            Total: {inquiries.length}
          </span>
          <span className="px-3 py-1 rounded-full bg-rosewood-50 border border-rosewood-200 text-xs font-semibold text-rosewood-600">
            Unread: {inquiries.filter(i => !i.read).length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-cream-200 shadow-soft flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-walnut-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages by name, email, subject..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-cream-50 border border-cream-200 text-xs text-walnut-900 placeholder-walnut-400 focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
          {['All', 'unread', 'Custom Craft Request', 'Contact Form Message'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                filterType === type
                  ? 'bg-terracotta-500 text-white'
                  : 'bg-cream-100 text-walnut-600 hover:bg-cream-200'
              }`}
            >
              {type === 'unread' ? 'Unread Messages' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-soft overflow-hidden">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-cream-100 mx-auto flex items-center justify-center text-walnut-400">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-walnut-800">No Messages Found</h3>
            <p className="text-xs text-walnut-500 max-w-sm mx-auto">
              No customer inquiries match your current filter. When visitors submit contact forms, they will show up here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {filteredInquiries.map((inq) => (
              <div 
                key={inq.id}
                className={`p-5 sm:p-6 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  !inq.read ? 'bg-rosewood-50/20 hover:bg-rosewood-50/40' : 'hover:bg-cream-50/40'
                }`}
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-semibold text-walnut-900 text-sm">
                      {inq.name}
                    </span>
                    {!inq.read && (
                      <span className="px-2 py-0.5 rounded-full bg-rosewood-100 text-rosewood-700 text-[10px] font-bold uppercase tracking-wider">
                        New
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-cream-100 text-walnut-600 text-[11px] font-medium border border-cream-200">
                      {inq.type}
                    </span>
                    <span className="text-xs text-walnut-400">
                      {formatDate(inq.createdAt)}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-walnut-900 line-clamp-1">
                    {inq.subject || 'Customer Inquiry'}
                  </h4>

                  <p className="text-xs text-walnut-600 line-clamp-2 leading-relaxed">
                    {inq.message}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-walnut-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-terracotta-500" />
                      {inq.email}
                    </span>
                    {inq.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-terracotta-500" />
                        {inq.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleOpenView(inq)}
                    className="px-3.5 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-walnut-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="View full message"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => toggleInquiryRead(inq.id)}
                    className={`p-2 rounded-xl text-xs font-semibold transition ${
                      inq.read 
                        ? 'text-walnut-400 hover:text-walnut-700 hover:bg-cream-100' 
                        : 'text-sage-600 bg-sage-50 hover:bg-sage-100'
                    }`}
                    title={inq.read ? "Mark as unread" : "Mark as read"}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setInquiryToDelete(inq)}
                    className="p-2 text-walnut-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Message Modal */}
      {viewingInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-walnut-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-soft-lg border border-cream-200 space-y-4">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-terracotta-600 font-semibold block">
                  {viewingInquiry.type}
                </span>
                <h3 className="font-serif text-xl font-bold text-walnut-900">
                  {viewingInquiry.subject}
                </h3>
              </div>
              <span className="text-xs text-walnut-400 font-mono">
                {formatDate(viewingInquiry.createdAt)}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-walnut-700 space-y-1">
              <div><strong className="text-walnut-900">From:</strong> {viewingInquiry.name}</div>
              <div><strong className="text-walnut-900">Email:</strong> {viewingInquiry.email}</div>
              {viewingInquiry.phone && (
                <div><strong className="text-walnut-900">Phone:</strong> {viewingInquiry.phone}</div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-walnut-500 uppercase tracking-wider">
                Customer Message:
              </span>
              <p className="text-sm text-walnut-800 leading-relaxed bg-cream-50/50 p-4 rounded-2xl border border-cream-200 whitespace-pre-wrap">
                {viewingInquiry.message}
              </p>
            </div>

            {/* Email Routing Info Box */}
            <div className="p-3.5 rounded-2xl bg-terracotta-50/70 border border-terracotta-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-walnut-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Email Dispatch</span>
                </span>
                <span className="text-[11px] text-walnut-600 font-mono">
                  Owner: {ownerEmail}
                </span>
              </div>
              <p className="text-[11px] text-walnut-600 leading-relaxed">
                Reply to the customer using Owner email ({ownerEmail}) or forward this inquiry.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cream-200">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={generateInquiryReplyEmail(viewingInquiry, ownerEmail)}
                  className="px-4 py-2 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply from {ownerEmail}</span>
                </a>

                <a
                  href={generateOwnerInquiryEmail(viewingInquiry, ownerEmail)}
                  className="px-4 py-2 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-800 text-xs font-semibold flex items-center gap-1.5 transition border border-cream-300"
                >
                  <Mail className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Forward to Owner</span>
                </a>

                {viewingInquiry.phone && (
                  <a
                    href={`https://wa.me/${viewingInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${viewingInquiry.name}! We received your inquiry regarding "${viewingInquiry.subject}" at Candy Crafts.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewingInquiry(null)}
                className="px-5 py-2 rounded-full bg-cream-100 hover:bg-cream-200 text-walnut-700 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(inquiryToDelete)}
        title="Delete Customer Message"
        message={`Are you sure you want to delete the message from "${inquiryToDelete?.name}"? It will be removed from localStorage.`}
        confirmText="Yes, Delete Message"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setInquiryToDelete(null)}
      />

    </div>
  );
};
