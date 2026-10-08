/**
 * Utility to generate pre-filled email and WhatsApp links
 * for both the Owner and the Customer.
 */

export const generateOwnerOrderEmail = (order, ownerEmail = 'candycraftssstudio@gmail.com') => {
  const subject = `[Candy Crafts] New Order Query: #${order.id} from ${order.customerName}`;
  
  const itemsText = (order.items || [])
    .map(i => `• ${i.name} (Qty: ${i.quantity}) - Rs. ${(i.price * i.quantity).toLocaleString()}`)
    .join('\n');

  const body = `Dear Candy Crafts Owner / Atelier Team,

A new customer order query has been received on the Candy Crafts website!

CUSTOMER CONTACT DETAILS:
----------------------------------------
• Name: ${order.customerName}
• Phone / WhatsApp: ${order.customerPhone}
• Gmail / Email: ${order.customerEmail}
• Delivery Address:
${order.shippingAddress || 'Not specified'}
${order.notes ? `\n• Special Note / Ribbon Card:\n"${order.notes}"\n` : ''}
ORDERED CRAFT DETAILS:
----------------------------------------
• Order Reference: #${order.id}
• Date & Time: ${new Date(order.createdAt || Date.now()).toLocaleString()}

ITEMS:
${itemsText}

========================================
ESTIMATED TOTAL: Rs. ${(order.totalAmount || 0).toLocaleString()}
Packaging: Complimentary Handcrafted Box
========================================

Action: Please contact the customer at ${order.customerPhone} or reply to ${order.customerEmail} to confirm custom crafting schedule and dispatch.

Candy Crafts Automated Storefront`;

  return `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const generateCustomerConfirmationEmail = (order, ownerEmail = 'candycraftssstudio@gmail.com') => {
  const subject = `[Candy Crafts] Your order query has been received! #${order.id}`;

  const itemsText = (order.items || [])
    .map(i => `• ${i.name} (Qty: ${i.quantity}) - Rs. ${(i.price * i.quantity).toLocaleString()}`)
    .join('\n');

  const body = `Dear ${order.customerName},

Thank you for choosing Candy Crafts!
Your order query has been received by our studio atelier team. We will contact you soon on ${order.customerPhone}.

YOUR ORDER QUERY SUMMARY:
----------------------------------------
• Order ID: #${order.id}
• Status: Query Received (Under Review)
• Date: ${new Date(order.createdAt || Date.now()).toLocaleString()}

CRAFTS REQUESTED:
${itemsText}

========================================
TOTAL DUE: Rs. ${(order.totalAmount || 0).toLocaleString()}
Delivery Address:
${order.shippingAddress || 'As discussed'}
========================================

Our artisan team will reach out to confirm your handcrafted arrangements, customization preferences, and dispatch schedule.

If you have any questions or wish to customize further, feel free to reply directly to this email (${ownerEmail}).

Warm regards,
Candy Crafts Atelier Team`;

  return `mailto:${encodeURIComponent(order.customerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const generateWhatsAppOrderUrl = (order, phone = '+91 98765 43210') => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = `Hello Candy Crafts! I have submitted an order query #${order.id} for "${order.items?.[0]?.name || 'Craft Product'}" (Total: Rs. ${order.totalAmount}).
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Gmail: ${order.customerEmail}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

/**
 * Generate email for Owner (candycraftssstudio@gmail.com) when a customer submits an inquiry
 */
export const generateOwnerInquiryEmail = (inquiry, ownerEmail = 'candycraftssstudio@gmail.com') => {
  const subject = `[Candy Crafts] New Customer Inquiry: from ${inquiry.name} (${inquiry.type || 'Enquiry'})`;
  const body = `Dear Candy Crafts Owner / Atelier Team,

A new customer inquiry has been received on the Candy Crafts website!

CUSTOMER DETAILS:
----------------------------------------
• Name: ${inquiry.name}
• Email: ${inquiry.email}
• Phone / WhatsApp: ${inquiry.phone || 'Not provided'}
• Inquiry Type: ${inquiry.type || 'Store Inquiry'}
• Subject: ${inquiry.subject || 'Craft Inquiry'}
• Received At: ${new Date(inquiry.createdAt || Date.now()).toLocaleString()}

CUSTOMER MESSAGE:
----------------------------------------
${inquiry.message}

========================================
Target Owner Inbox: ${ownerEmail}
========================================

Action: Please contact the customer at ${inquiry.email}${inquiry.phone ? ` or call/WhatsApp ${inquiry.phone}` : ''}.

Candy Crafts Automated Storefront`;

  return `mailto:${encodeURIComponent(ownerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate confirmation email for Customer acknowledging inquiry received by Candy Crafts
 */
export const generateCustomerInquiryConfirmationEmail = (inquiry, ownerEmail = 'candycraftssstudio@gmail.com') => {
  const subject = `[Candy Crafts] Your inquiry has been received! (${inquiry.subject || 'Atelier Inquiry'})`;
  const body = `Dear ${inquiry.name},

Thank you for reaching out to Candy Crafts!
We have successfully received your inquiry and our artisan studio team is reviewing your details.

YOUR INQUIRY SUMMARY:
----------------------------------------
• Topic / Subject: ${inquiry.subject || 'Atelier Craft Inquiry'}
• Inquiry Type: ${inquiry.type || 'Customer Inquiry'}
• Date: ${new Date(inquiry.createdAt || Date.now()).toLocaleString()}

YOUR MESSAGE:
"${inquiry.message}"

----------------------------------------
Our artisan team will reach out to you shortly via email or phone.

If you have urgent questions or wish to share reference designs, you can reply directly to this atelier email:
${ownerEmail}

Warm regards,
Candy Crafts Atelier Team
Official Email: ${ownerEmail}`;

  return `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate admin reply email to customer from owner email
 */
export const generateInquiryReplyEmail = (inquiry, ownerEmail = 'candycraftssstudio@gmail.com') => {
  const subject = `Re: [Candy Crafts] ${inquiry.subject || 'Inquiry Response'}`;
  const body = `Dear ${inquiry.name},

Thank you for contacting Candy Crafts!

[Please type your reply here]

----------------------------------------
Original Message:
From: ${inquiry.name} (${inquiry.email})
Subject: ${inquiry.subject || 'Inquiry'}
${inquiry.message}

----------------------------------------
Warm regards,
Candy Crafts Atelier Team
Official Email: ${ownerEmail}`;

  return `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

/**
 * Generate WhatsApp URL for inquiry
 */
export const generateWhatsAppInquiryUrl = (inquiry, phone = '+91 98765 43210') => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const text = `Hello Candy Crafts! I have submitted an inquiry on your website:
Name: ${inquiry.name}
Topic: ${inquiry.subject || 'Craft Inquiry'}
Email: ${inquiry.email}
${inquiry.phone ? `Phone: ${inquiry.phone}\n` : ''}Message: ${inquiry.message?.slice(0, 100)}...`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};

