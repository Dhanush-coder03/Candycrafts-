const mongoose = require('mongoose');
const ContactInfo = require('../models/ContactInfo');

/**
 * Format phone number to international format without + or spaces
 * Default to India (+91) if 10 digits provided
 */
const sanitizePhoneNumber = (phone) => {
  if (!phone) return '';
  const digitsOnly = phone.replace(/[^0-9]/g, '');
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
};

/**
 * Retrieve studio contact phone, brand name and WhatsApp API credentials from database or env
 */
const getWhatsAppConfig = async () => {
  let whatsappNumber = process.env.OWNER_PHONE || '+91 98765 43210';
  let token = process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_KEY || '';
  let phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
  let businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '';
  let brandName = 'Candy Crafts';
  let whatsappEnabled = true;

  try {
    if (mongoose.connection.readyState === 1) {
      const contact = await ContactInfo.findOne();
      if (contact) {
        if (contact.whatsappNumber && contact.whatsappNumber.trim()) {
          whatsappNumber = contact.whatsappNumber.trim();
        } else if (contact.phone && contact.phone.trim()) {
          whatsappNumber = contact.phone.trim();
        }
        if (contact.whatsappToken && contact.whatsappToken.trim()) {
          token = contact.whatsappToken.trim();
        }
        if (contact.whatsappPhoneNumberId && contact.whatsappPhoneNumberId.trim()) {
          phoneNumberId = contact.whatsappPhoneNumberId.trim();
        }
        if (contact.whatsappBusinessAccountId && contact.whatsappBusinessAccountId.trim()) {
          businessAccountId = contact.whatsappBusinessAccountId.trim();
        }
        if (contact.brandName && contact.brandName.trim()) {
          brandName = contact.brandName.trim();
        }
        if (typeof contact.whatsappEnabled === 'boolean') {
          whatsappEnabled = contact.whatsappEnabled;
        }
      }
    }
  } catch (err) {
    console.warn('Could not read WhatsApp credentials from database:', err.message);
  }

  return { whatsappNumber, token, phoneNumberId, businessAccountId, brandName, whatsappEnabled };
};

const getStudioContact = async () => {
  const config = await getWhatsAppConfig();
  return { studioPhone: config.whatsappNumber, brandName: config.brandName };
};

/**
 * Generate formatted WhatsApp message for the Owner
 */
const formatOwnerWhatsAppMessage = (order, studioPhone, brandName) => {
  const itemsText = (order.items || [])
    .map(i => `• ${i.name} (Qty: ${i.quantity}) - Rs. ${(i.price * i.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  return `🔔 *${brandName.toUpperCase()} - NEW CUSTOMER ORDER ALERT* 🔔

A new order query has been placed on the website!

• *Order ID:* #${order.id}
• *Date:* ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}

👤 *CUSTOMER CONTACT DETAILS:*
• *Name:* ${order.customerName}
• *Phone:* ${order.customerPhone}
• *Gmail / Email:* ${order.customerEmail}
• *Delivery Address:*
${order.shippingAddress || 'To be confirmed on call'}
${order.notes ? `\n• *Special Gift Note:* "${order.notes}"\n` : ''}
📦 *ORDERED CRAFT ITEMS:*
${itemsText}

💰 *TOTAL AMOUNT:* Rs. ${(order.totalAmount || 0).toLocaleString('en-IN')}
🎁 *Packaging:* Complimentary Handcrafted Presentation Box

👉 Action: Please contact customer at ${order.customerPhone} or ${order.customerEmail} to confirm customization and dispatch schedule.`;
};

/**
 * Generate formatted WhatsApp message for the Customer
 */
const formatCustomerWhatsAppMessage = (order, studioPhone, brandName) => {
  const itemsText = (order.items || [])
    .map(i => `• ${i.name} (Qty: ${i.quantity}) - Rs. ${(i.price * i.quantity).toLocaleString('en-IN')}`)
    .join('\n');

  return `🌸 *${brandName.toUpperCase()} - ORDER QUERY CONFIRMED* 🌸

Dear *${order.customerName}*,

Thank you for choosing ${brandName}! Your order query has been successfully received by our artisan studio team.

• *Order Reference:* #${order.id}
• *Status:* Query Received (Under Review)
• *Date:* ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}

📦 *CRAFTS REQUESTED:*
${itemsText}

💰 *TOTAL DUE:* Rs. ${(order.totalAmount || 0).toLocaleString('en-IN')}
🚚 *DELIVERY ADDRESS:*
${order.shippingAddress || 'To be confirmed on call'}

Our atelier team will contact you shortly on ${order.customerPhone} to confirm custom arrangements and dispatch schedule.

For any immediate custom requests or design photos, feel free to reply directly to this number (${studioPhone}).

Warm regards,
*${brandName} Artisan Atelier*`;
};

/**
 * Dispatch message via Meta / WhatsApp Cloud API
 */
const sendViaWhatsAppCloudApi = async (toPhone, messageText, customToken, customPhoneNumberId) => {
  const token = customToken || process.env.WHATSAPP_TOKEN || process.env.WHATSAPP_API_KEY;
  const phoneNumberId = customPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return { success: false, reason: 'Missing token or Phone Number ID' };
  }

  try {
    const cleanTo = sanitizePhoneNumber(toPhone);
    const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanTo,
        type: 'text',
        text: { body: messageText }
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`✅ [WhatsApp Cloud API] Message sent successfully to ${cleanTo}`);
      return { success: true, data };
    } else {
      console.warn(`⚠️ [WhatsApp Cloud API Error]:`, data);
      const errMsg = data.error?.message || (typeof data.error === 'string' ? data.error : JSON.stringify(data));
      return { success: false, error: errMsg };
    }
  } catch (error) {
    console.warn(`⚠️ [WhatsApp Cloud API Exception]:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Dispatch message via Twilio WhatsApp API if credentials exist
 */
const sendViaTwilio = async (toPhone, messageText) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || '+14155238886';

  if (!accountSid || !authToken) return false;

  try {
    const formattedTo = `whatsapp:+${toPhone}`;
    const formattedFrom = fromNumber.startsWith('whatsapp:') ? fromNumber : `whatsapp:${fromNumber}`;

    const bodyParams = new URLSearchParams();
    bodyParams.append('From', formattedFrom);
    bodyParams.append('To', formattedTo);
    bodyParams.append('Body', messageText);

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams.toString()
    });

    if (response.ok) {
      console.log(`✅ [Twilio WhatsApp] Message sent successfully to ${toPhone}`);
      return true;
    } else {
      const errData = await response.json().catch(() => ({}));
      console.warn(`⚠️ [Twilio WhatsApp Error]:`, errData);
      return false;
    }
  } catch (error) {
    console.warn(`⚠️ [Twilio WhatsApp Exception]:`, error.message);
    return false;
  }
};

/**
 * Live WhatsApp Verification & Test Dispatch for Admin Configuration
 */
const verifyAndTestWhatsApp = async (overrideNumber, overrideToken, overridePhoneNumberId) => {
  const config = await getWhatsAppConfig();
  const targetNumber = (overrideNumber || config.whatsappNumber || '').trim();
  const token = (overrideToken !== undefined ? overrideToken : config.token || '').trim();
  const phoneNumberId = (overridePhoneNumberId !== undefined ? overridePhoneNumberId : config.phoneNumberId || '').trim();

  if (!targetNumber) {
    throw new Error('Please enter your WhatsApp phone number with country code (e.g. +91 98765 43210).');
  }

  if (!token || !phoneNumberId) {
    throw new Error('Please enter both your Meta WhatsApp Access Token and Phone Number ID to test automated messaging.');
  }

  const cleanPhone = sanitizePhoneNumber(targetNumber);
  const brandName = config.brandName || 'Candy Crafts';
  const testMessage = `🌸 *${brandName.toUpperCase()} - WHATSAPP INTEGRATION TEST* 🌸\n\nHello! This is a live test message confirming your store's automated WhatsApp dispatch system.\n\n• *Configured Number:* ${targetNumber}\n• *Phone Number ID:* ${phoneNumberId}\n• *Status:* Connected & Operational\n• *Timestamp:* ${new Date().toLocaleString('en-IN')}\n\nWhen a customer places an order:\n1. The customer will receive an instant order receipt on their WhatsApp.\n2. You (the owner) will receive an instant order alert with all customer and delivery details!`;

  const result = await sendViaWhatsAppCloudApi(cleanPhone, testMessage, token, phoneNumberId);

  if (!result.success) {
    throw new Error(result.error || 'Failed to dispatch test message via WhatsApp Cloud API. Please check your token and Phone Number ID.');
  }

  return { success: true, phone: targetNumber, details: result.data };
};

/**
 * Main WhatsApp Dispatch Service for Orders:
 * Handles WhatsApp confirmation for BOTH Customer and Owner.
 */
const sendOrderWhatsApp = async (order) => {
  const config = await getWhatsAppConfig();
  const studioPhone = config.whatsappNumber;
  const brandName = config.brandName;
  const cleanOwnerPhone = sanitizePhoneNumber(studioPhone);
  const cleanCustomerPhone = sanitizePhoneNumber(order.customerPhone);

  const ownerMessage = formatOwnerWhatsAppMessage(order, studioPhone, brandName);
  const customerMessage = formatCustomerWhatsAppMessage(order, studioPhone, brandName);

  // Generate web/app direct links
  const ownerWhatsAppUrl = `https://api.whatsapp.com/send?phone=${cleanOwnerPhone}&text=${encodeURIComponent(ownerMessage)}`;
  const customerWhatsAppUrl = cleanCustomerPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanCustomerPhone}&text=${encodeURIComponent(customerMessage)}`
    : '#';

  console.log(`📱 [WhatsApp Dispatch Service] Initializing Order #${order.id}:`);
  console.log(`   • Recipient 1 (Owner): ${studioPhone} (${cleanOwnerPhone})`);
  console.log(`   • Recipient 2 (Customer): ${order.customerPhone} (${cleanCustomerPhone})`);

  let ownerApiSent = false;
  let customerApiSent = false;

  // 1. Try direct Meta WhatsApp Cloud API sending if credentials exist in DB or env
  if (config.token && config.phoneNumberId) {
    const ownerRes = await sendViaWhatsAppCloudApi(cleanOwnerPhone, ownerMessage, config.token, config.phoneNumberId);
    ownerApiSent = ownerRes.success;

    if (cleanCustomerPhone) {
      const custRes = await sendViaWhatsAppCloudApi(cleanCustomerPhone, customerMessage, config.token, config.phoneNumberId);
      customerApiSent = custRes.success;
    }
  } 
  // 2. Fallback to Twilio if configured
  else if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    ownerApiSent = await sendViaTwilio(cleanOwnerPhone, ownerMessage);
    if (cleanCustomerPhone) {
      customerApiSent = await sendViaTwilio(cleanCustomerPhone, customerMessage);
    }
  } else {
    console.log(`ℹ️ [WhatsApp Service] Direct automated API not configured. Generated instant pre-formatted WhatsApp URLs for Owner and Customer.`);
  }

  return {
    success: true,
    orderId: order.id,
    ownerPhone: studioPhone,
    customerPhone: order.customerPhone,
    cleanOwnerPhone,
    cleanCustomerPhone,
    ownerWhatsAppUrl,
    customerWhatsAppUrl,
    messages: {
      owner: ownerMessage,
      customer: customerMessage
    },
    automated: {
      ownerSent: ownerApiSent,
      customerSent: customerApiSent,
      hasConfiguredApi: Boolean((config.token && config.phoneNumberId) || (process.env.TWILIO_ACCOUNT_SID))
    }
  };
};

module.exports = {
  sendOrderWhatsApp,
  formatOwnerWhatsAppMessage,
  formatCustomerWhatsAppMessage,
  sanitizePhoneNumber,
  verifyAndTestWhatsApp,
  getWhatsAppConfig,
  getStudioContact
};
