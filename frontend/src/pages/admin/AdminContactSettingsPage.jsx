import React, { useState, useEffect } from 'react';
import {
  Save,
  MapPin,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Key,
  Eye,
  EyeOff,
  Send,
  AlertCircle,
  Loader2,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  MessageCircle,
  Smartphone,
  Hash,
  Zap,
  Info
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { api } from '../../utils/api';

export const AdminContactSettingsPage = () => {
  const { contactInfo, updateContactInfo } = useProducts();

  const [formData, setFormData] = useState({
    brandName: contactInfo?.brandName || 'Candy Crafts',
    tagline: contactInfo?.tagline || 'Artisan Studio & Workshop',
    address: contactInfo?.address || '',
    email: contactInfo?.email || 'candycraftssstudio@gmail.com',
    ownerEmail: contactInfo?.ownerEmail || 'candycraftssstudio@gmail.com',
    emailPass: contactInfo?.emailPass || '',
    phone: contactInfo?.phone || '',
    hours: contactInfo?.hours || '',
    instagramUrl: contactInfo?.instagramUrl || '',
    instagramHandle: contactInfo?.instagramHandle || '',
    whatsappNumber: contactInfo?.whatsappNumber || contactInfo?.phone || '+91 98765 43210',
    whatsappToken: contactInfo?.whatsappToken || '',
    whatsappPhoneNumberId: contactInfo?.whatsappPhoneNumberId || '',
    whatsappBusinessAccountId: contactInfo?.whatsappBusinessAccountId || '',
    whatsappEnabled: contactInfo?.whatsappEnabled ?? true
  });

  // Sync formData whenever contactInfo loads from server or changes
  useEffect(() => {
    if (contactInfo) {
      setFormData(prev => ({
        ...prev,
        brandName: contactInfo.brandName ?? prev.brandName,
        tagline: contactInfo.tagline ?? prev.tagline,
        address: contactInfo.address ?? prev.address,
        email: contactInfo.email ?? prev.email,
        ownerEmail: contactInfo.ownerEmail ?? prev.ownerEmail,
        emailPass: contactInfo.emailPass ?? prev.emailPass ?? '',
        phone: contactInfo.phone ?? prev.phone,
        hours: contactInfo.hours ?? prev.hours,
        instagramUrl: contactInfo.instagramUrl ?? prev.instagramUrl,
        instagramHandle: contactInfo.instagramHandle ?? prev.instagramHandle,
        whatsappNumber: contactInfo.whatsappNumber ?? prev.whatsappNumber ?? prev.phone ?? '+91 98765 43210',
        whatsappToken: contactInfo.whatsappToken ?? prev.whatsappToken ?? '',
        whatsappPhoneNumberId: contactInfo.whatsappPhoneNumberId ?? prev.whatsappPhoneNumberId ?? '',
        whatsappBusinessAccountId: contactInfo.whatsappBusinessAccountId ?? prev.whatsappBusinessAccountId ?? '',
        whatsappEnabled: contactInfo.whatsappEnabled ?? prev.whatsappEnabled ?? true
      }));
    }
  }, [contactInfo]);

  const [showPassword, setShowPassword] = useState(false);
  const [showWhatsAppToken, setShowWhatsAppToken] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [whatsAppTestResult, setWhatsAppTestResult] = useState(null);
  const [showWhatsAppGuide, setShowWhatsAppGuide] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateContactInfo(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    } catch (err) {
      console.error('Failed to save contact info:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!formData.ownerEmail || !formData.emailPass) {
      setTestResult({
        success: false,
        message: 'Please enter both your Gmail address and 16-character App Password to test.'
      });
      return;
    }

    setIsTestingEmail(true);
    setTestResult(null);

    try {
      const res = await api.testEmailConfig({
        email: formData.ownerEmail.trim(),
        emailPass: formData.emailPass.trim()
      });

      if (res && res.success) {
        if (res.data) {
          updateContactInfo(res.data);
        } else {
          updateContactInfo(formData);
        }
        setTestResult({
          success: true,
          message: res.message || `SMTP verified & saved to database! A test email was delivered to ${formData.ownerEmail}.`
        });
      } else {
        setTestResult({
          success: false,
          message: res?.message || 'SMTP Authentication failed. Please check your App Password.'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to connect to Gmail SMTP. Please verify credentials.'
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleTestWhatsApp = async () => {
    if (!formData.whatsappNumber) {
      setWhatsAppTestResult({
        success: false,
        message: 'Please enter your WhatsApp business/owner phone number with country code (e.g. +91 98765 43210).'
      });
      return;
    }

    if (!formData.whatsappToken || !formData.whatsappPhoneNumberId) {
      setWhatsAppTestResult({
        success: false,
        message: 'Please enter both your Meta WhatsApp Access Token and Phone Number ID to test automated messaging.'
      });
      return;
    }

    setIsTestingWhatsApp(true);
    setWhatsAppTestResult(null);

    try {
      const res = await api.testWhatsAppConfig({
        whatsappNumber: formData.whatsappNumber.trim(),
        whatsappToken: formData.whatsappToken.trim(),
        whatsappPhoneNumberId: formData.whatsappPhoneNumberId.trim(),
        whatsappBusinessAccountId: formData.whatsappBusinessAccountId?.trim() || '',
        whatsappEnabled: formData.whatsappEnabled
      });

      if (res && res.success) {
        if (res.data) {
          updateContactInfo(res.data);
        } else {
          updateContactInfo(formData);
        }
        setWhatsAppTestResult({
          success: true,
          message: res.message || `WhatsApp Cloud API verified & saved to database! A test WhatsApp message was delivered to ${formData.whatsappNumber}.`
        });
      } else {
        setWhatsAppTestResult({
          success: false,
          message: res?.message || 'WhatsApp Cloud API authentication failed. Please check your Access Token and Phone Number ID.'
        });
      }
    } catch (err) {
      setWhatsAppTestResult({
        success: false,
        message: err.message || 'Failed to connect to Meta WhatsApp Cloud API. Please verify credentials.'
      });
    } finally {
      setIsTestingWhatsApp(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-walnut-900">
          Studio Contact, Email & WhatsApp Settings
        </h2>
        <p className="text-xs text-walnut-500">
          Configure your studio contact information, Gmail SMTP credentials, and automated WhatsApp order notifications. All order confirmations to customers and owner alerts are dispatched through these settings without requiring server restarts.
        </p>
      </div>

      {isSaved && (
        <div className="p-4 bg-sage-50 text-sage-700 border border-sage-200 rounded-2xl text-xs font-medium flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-sage-600 shrink-0" />
          <span>Contact details, Gmail & WhatsApp dispatch settings saved successfully and live across the store!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-6">

        {/* Studio Name & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
              Studio Brand Name
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Contact Numbers and Concierge Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-100">
          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Contact Phone / WhatsApp *</span>
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210 (10 AM - 7 PM IST)"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Public Concierge Email *</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="candycraftssstudio@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Dedicated Email Sending & App Password Configuration (Gmail SMTP) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-terracotta-50/80 via-white to-cream-100 border-2 border-terracotta-200/80 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-terracotta-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-walnut-900">
                  Automated Email Dispatch Settings (Gmail SMTP)
                </h3>
                <p className="text-[11px] text-walnut-500">
                  Configure Gmail credentials directly here — no server .env required.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showGuide ? 'Hide App Password Guide' : 'How to get App Password?'}</span>
            </button>
          </div>

          {/* Guide Dropdown */}
          {showGuide && (
            <div className="p-4 bg-white rounded-2xl border border-cream-300 text-xs text-walnut-700 space-y-2 animate-fade-in">
              <p className="font-bold text-walnut-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                How to generate a 16-character Google App Password:
              </p>
              <ol className="list-decimal pl-5 space-y-1.5 text-walnut-600">
                <li>Go to your Google Account at <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-terracotta-600 underline font-medium inline-flex items-center gap-0.5">myaccount.google.com/security <ExternalLink className="w-2.5 h-2.5" /></a>.</li>
                <li>Make sure <strong>2-Step Verification</strong> is enabled on your account.</li>
                <li>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-terracotta-600 underline font-medium inline-flex items-center gap-0.5">myaccount.google.com/apppasswords <ExternalLink className="w-2.5 h-2.5" /></a>.</li>
                <li>Enter an app name (e.g. <em>Candy Crafts Store</em>) and click <strong>Create</strong>.</li>
                <li>Copy the generated <strong>16-character password</strong> (e.g. <code>xxxx yyyy zzzz wwww</code>) and paste it below.</li>
              </ol>
              <p className="text-[11px] text-walnut-500 italic">
                * Note: Your standard Google account password will NOT work. Google requires this dedicated 16-character App Password for SMTP security.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender / Owner Gmail */}
            <div>
              <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1">
                Store Gmail Address (Sender & Receiver) *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.ownerEmail}
                  onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                  placeholder="candycraftssstudio@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-terracotta-500 font-medium text-walnut-900"
                />
                <Mail className="w-4 h-4 text-walnut-400 absolute left-3.5 top-3" />
              </div>
              <span className="text-[11px] text-walnut-500 mt-1 block">
                Order queries arrive here and customer confirmations are dispatched from this address.
              </span>
            </div>

            {/* Google App Password */}
            <div>
              <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1">
                Google App Password (16 characters) *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.emailPass}
                  onChange={(e) => setFormData({ ...formData, emailPass: e.target.value })}
                  placeholder="Enter 16-character app password"
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-terracotta-500 font-mono text-walnut-900 tracking-wider"
                />
                <Key className="w-4 h-4 text-walnut-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-walnut-400 hover:text-walnut-700 transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-walnut-500 mt-1 block">
                {formData.emailPass ? 'Password entered. Click "Test Connection" to verify.' : 'Paste your 16-character Google App Password here.'}
              </span>
            </div>
          </div>

          {/* Test Email Connection Button & Status */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTestEmail}
              disabled={isTestingEmail || !formData.ownerEmail || !formData.emailPass}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
                isTestingEmail || !formData.ownerEmail || !formData.emailPass
                  ? 'bg-cream-200 text-walnut-400 cursor-not-allowed'
                  : 'bg-walnut-800 hover:bg-walnut-900 text-white shadow-xs active:scale-95'
              }`}
            >
              {isTestingEmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing SMTP Connection...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Test Email Connection Live</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-walnut-500">
              Verifies authentication with Google SMTP and sends a test email to your inbox.
            </span>
          </div>

          {/* Test Result Feedback */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-fade-in ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {testResult.success ? 'SMTP Connection Successful!' : 'Connection Failed'}
                </span>
                <span className="text-[11px] leading-relaxed block">{testResult.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated WhatsApp Automated Notification Configuration */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-50/80 via-white to-cream-100 border-2 border-emerald-200/80 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-200/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-walnut-900">
                    Automated WhatsApp Dispatch Settings
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    FREE: 1,000 Messages / Mo
                  </span>
                </div>
                <p className="text-[11px] text-walnut-500">
                  Sends automated order confirmations to customers and new order alerts to the store owner.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWhatsAppGuide(!showWhatsAppGuide)}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showWhatsAppGuide ? 'Hide Free Setup Guide' : 'How to use Free WhatsApp?'}</span>
            </button>
          </div>

          {/* Guide Dropdown for Free WhatsApp */}
          {showWhatsAppGuide && (
            <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs text-walnut-700 space-y-3 animate-fade-in shadow-xs">
              <div className="flex items-start gap-2 text-emerald-900">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Official Meta WhatsApp Cloud API — 100% Free Tier (1,000 Free Monthly Conversations):</p>
                  <p className="text-[11px] text-walnut-600">Meta provides every WhatsApp Business Account with 1,000 free service conversations per month with zero hosting costs. Follow these steps to obtain your free credentials:</p>
                </div>
              </div>

              <ol className="list-decimal pl-5 space-y-1.5 text-walnut-600 text-[11px] leading-relaxed">
                <li>
                  Go to <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5">developers.facebook.com <ExternalLink className="w-2.5 h-2.5" /></a> and log in or create a free Meta Developer account.
                </li>
                <li>
                  Click <strong>My Apps</strong> &rarr; <strong>Create App</strong> &rarr; Select <strong>Other</strong> &rarr; Choose <strong>Business</strong> as the app type.
                </li>
                <li>
                  Scroll to the <strong>WhatsApp</strong> product tile and click <strong>Set up</strong>.
                </li>
                <li>
                  In the left sidebar, navigate to <strong>WhatsApp &rarr; API Setup</strong>:
                  <ul className="list-disc pl-4 mt-1 space-y-0.5">
                    <li>Copy your <strong>Phone Number ID</strong> and paste it into the field below.</li>
                    <li>Copy the <strong>Temporary / Permanent Access Token</strong> and paste it into the Access Token field below.</li>
                    <li>(For continuous production): In <em>Business Settings &rarr; System Users</em>, create a system user token that never expires.</li>
                  </ul>
                </li>
                <li>
                  Enter your store's WhatsApp number below and click <strong>Test WhatsApp Connection Live</strong>.
                </li>
              </ol>

              <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-[11px] text-walnut-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
                <span>
                  <strong>100% Free Instant Fallback:</strong> If Meta API credentials are not yet configured, Candy Crafts automatically creates pre-formatted 1-click WhatsApp order confirmation links for both customer and store owner.
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Owner WhatsApp Number */}
            <div>
              <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Store Owner WhatsApp Number *</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-emerald-500 font-medium text-walnut-900"
                />
                <Phone className="w-4 h-4 text-walnut-400 absolute left-3.5 top-3" />
              </div>
              <span className="text-[11px] text-walnut-500 mt-1 block">
                All customer order alerts arrive at this WhatsApp number. Format: +91 followed by 10 digits.
              </span>
            </div>

            {/* Phone Number ID */}
            <div>
              <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                <span>Meta WhatsApp Phone Number ID</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.whatsappPhoneNumberId}
                  onChange={(e) => setFormData({ ...formData, whatsappPhoneNumberId: e.target.value })}
                  placeholder="e.g. 105938472910482"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-walnut-900"
                />
                <Smartphone className="w-4 h-4 text-walnut-400 absolute left-3.5 top-3" />
              </div>
              <span className="text-[11px] text-walnut-500 mt-1 block">
                Found in Meta Developer Dashboard &rarr; WhatsApp &rarr; API Setup.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Meta WhatsApp Access Token */}
            <div>
              <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-600" />
                <span>Meta Cloud API Access Token</span>
              </label>
              <div className="relative">
                <input
                  type={showWhatsAppToken ? 'text' : 'password'}
                  value={formData.whatsappToken}
                  onChange={(e) => setFormData({ ...formData, whatsappToken: e.target.value })}
                  placeholder="Paste EAABw... Meta Access Token"
                  autoComplete="off"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-walnut-900 tracking-wider"
                />
                <Key className="w-4 h-4 text-walnut-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                  className="absolute right-3 top-3 text-walnut-400 hover:text-walnut-700 transition"
                  title={showWhatsAppToken ? "Hide token" : "Show token"}
                >
                  {showWhatsAppToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[11px] text-walnut-500 mt-1 block">
                {formData.whatsappToken ? 'Token entered. Click "Test WhatsApp Connection Live" to verify.' : 'Temporary or System User Access Token from Meta Developer Console.'}
              </span>
            </div>

            {/* WhatsApp Business Account ID (WABA ID) */}
            <div>
              <label className="block text-xs font-semibold text-walnut-800 uppercase mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Business Account ID (WABA ID - Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.whatsappBusinessAccountId}
                  onChange={(e) => setFormData({ ...formData, whatsappBusinessAccountId: e.target.value })}
                  placeholder="e.g. 192837465019283"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-walnut-900"
                />
                <ShieldCheck className="w-4 h-4 text-walnut-400 absolute left-3.5 top-3" />
              </div>
              <span className="text-[11px] text-walnut-500 mt-1 block">
                Used for managing message templates and Meta Business verification.
              </span>
            </div>
          </div>

          {/* Test WhatsApp Connection Button & Status */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTestWhatsApp}
              disabled={isTestingWhatsApp || !formData.whatsappNumber || !formData.whatsappToken || !formData.whatsappPhoneNumberId}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition ${
                isTestingWhatsApp || !formData.whatsappNumber || !formData.whatsappToken || !formData.whatsappPhoneNumberId
                  ? 'bg-cream-200 text-walnut-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs active:scale-95'
              }`}
            >
              {isTestingWhatsApp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing WhatsApp Dispatch...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Test WhatsApp Connection Live</span>
                </>
              )}
            </button>

            <span className="text-[11px] text-walnut-500">
              Sends an immediate live test WhatsApp confirmation to {formData.whatsappNumber || 'your number'}.
            </span>
          </div>

          {/* Test WhatsApp Result Feedback */}
          {whatsAppTestResult && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 animate-fade-in ${
                whatsAppTestResult.success
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {whatsAppTestResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5">
                <span className="font-bold block">
                  {whatsAppTestResult.success ? 'WhatsApp Connection Verified & Dispatched!' : 'WhatsApp Test Failed'}
                </span>
                <span className="text-[11px] leading-relaxed block">{whatsAppTestResult.message}</span>
              </div>
            </div>
          )}
        </div>

        {/* Physical Address */}
        <div className="pt-2 border-t border-cream-100">
          <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Studio Physical Address *</span>
          </label>
          <textarea
            rows="2"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Studio location / Workshop street address..."
            className="w-full px-4 py-2 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Studio Hours */}
        <div className="pt-2 border-t border-cream-100">
          <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Operating / Studio Hours</span>
          </label>
          <input
            type="text"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
            placeholder="e.g. Monday – Saturday, 10:00 AM – 6:30 PM"
            className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
          />
        </div>

        {/* Social: Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cream-100">
          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1 flex items-center gap-1.5">
              <span>Instagram Profile URL *</span>
            </label>
            <input
              type="url"
              required
              value={formData.instagramUrl}
              onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
              placeholder="https://www.instagram.com/candycrafts2026?..."
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-walnut-700 uppercase mb-1">
              Instagram Handle
            </label>
            <input
              type="text"
              value={formData.instagramHandle}
              onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
              placeholder="@candycrafts2026"
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 text-sm focus:outline-none focus:border-terracotta-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-cream-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-semibold uppercase tracking-wider shadow-soft transition flex items-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Configuration...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Contact, Email & WhatsApp Configuration</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
