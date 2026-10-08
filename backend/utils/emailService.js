const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ContactInfo = require('../models/ContactInfo');

/**
 * Retrieve dynamic email credentials and contact details from database (Admin Settings) or fallback to env
 */
const getEmailCredentials = async () => {
  let user = process.env.EMAIL_USER || 'candycraftssstudio@gmail.com';
  let pass = process.env.EMAIL_PASS || '';
  let ownerEmail = process.env.OWNER_EMAIL || user;
  let contact = null;

  try {
    if (mongoose.connection.readyState === 1) {
      contact = await ContactInfo.findOne();
      if (contact) {
        if (contact.emailPass && contact.emailPass.trim()) {
          pass = contact.emailPass.trim().replace(/\s+/g, '');
        }
        if (contact.ownerEmail && contact.ownerEmail.trim()) {
          ownerEmail = contact.ownerEmail.trim();
          user = contact.ownerEmail.trim();
        } else if (contact.email && contact.email.trim()) {
          ownerEmail = contact.email.trim();
          user = contact.email.trim();
        }
      }
    }
  } catch (err) {
    console.warn('Could not read email credentials from database:', err.message);
  }

  return { user, pass, ownerEmail, contact };
};

const createTransporter = async () => {
  const { user, pass, ownerEmail, contact } = await getEmailCredentials();

  if (!pass) {
    return { transporter: null, user, ownerEmail, contact };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });

  return { transporter, user, ownerEmail, contact };
};

/**
 * Test given credentials or stored credentials
 */
const verifyAndTestEmail = async (overrideUser, overridePass) => {
  let user = overrideUser;
  let pass = overridePass;

  if (!user || !pass) {
    const creds = await getEmailCredentials();
    user = user || creds.user;
    pass = pass || creds.pass;
  }

  if (!pass) {
    throw new Error('No App Password provided. Please enter a 16-character Google App Password.');
  }

  const cleanPass = pass.replace(/\s+/g, '');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: cleanPass
    }
  });

  await transporter.verify();

  // Send a test verification email with both text and HTML
  await transporter.sendMail({
    from: `"Candy Crafts Atelier" <${user}>`,
    to: user,
    replyTo: user,
    subject: '🌸 Candy Crafts - Email Dispatch Setup Verified!',
    text: `Hello,\n\nYour Candy Crafts email dispatch settings have been successfully configured from the Admin Panel!\n\nConfigured Sender: ${user}\nTimestamp: ${new Date().toLocaleString()}\n\nAll customer order queries and notifications will now dispatch through this account automatically.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf7f2; border-radius: 16px; overflow: hidden; border: 1px solid #e8dfd8;">
        <div style="background: #c86d51; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Candy Crafts Atelier</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.95;">Email Dispatch System Verified</p>
        </div>
        <div style="padding: 28px 24px; background: #ffffff;">
          <p style="font-size: 15px; color: #2b2623; margin: 0 0 16px;">Hello Studio Admin,</p>
          <p style="font-size: 14px; color: #5c5550; line-height: 1.6; margin: 0 0 20px;">
            Your Gmail credentials have been successfully authenticated with Google SMTP! All customer order queries and contact inquiries will now dispatch automatically.
          </p>
          <div style="background: #fbf7f4; border: 1px solid #ebdcd5; border-radius: 12px; padding: 16px; margin: 0 0 24px;">
            <p style="margin: 0 0 8px; font-size: 13px; color: #2b2623;"><strong>Configured Sender:</strong> ${user}</p>
            <p style="margin: 0; font-size: 13px; color: #2b2623;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p style="font-size: 13px; color: #8c827a; margin: 0;">Candy Crafts Studio Atelier &bull; New Delhi</p>
        </div>
      </div>
    `
  });

  return { success: true, email: user };
};

/**
 * Send Order Query Notification to Owner & Customer Confirmation
 */
const sendOrderEmails = async (order) => {
  const { transporter, ownerEmail, contact } = await createTransporter();

  if (!transporter) {
    console.log('ℹ️ Nodemailer: EMAIL_PASS not configured in Admin Settings or env. Skipping automated SMTP delivery.');
    return;
  }

  const brandName = contact?.brandName || 'Candy Crafts';
  const studioPhone = contact?.phone || '+91 98765 43210';
  const studioAddress = contact?.address || 'New Delhi, India';
  const instagramUrl = contact?.instagramUrl || 'https://www.instagram.com/candycrafts2026';

  const itemsListPlain = (order.items || [])
    .map(item => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');

  const itemsRowsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e9e4;">
        <strong style="color: #2b2623; font-size: 14px;">${item.name}</strong>
        ${item.category ? `<br><span style="color: #8c827a; font-size: 12px;">${item.category}</span>` : ''}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e9e4; text-align: center; color: #5c5550; font-size: 14px;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #f0e9e4; text-align: right; color: #2b2623; font-weight: 600; font-size: 14px;">
        ₹${(item.price * item.quantity).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('');

  try {
    // 1. Send Notification to Owner
    await transporter.sendMail({
      from: `"${brandName} Store" <${ownerEmail}>`,
      to: ownerEmail,
      replyTo: order.customerEmail,
      subject: `[${brandName}] New Order Query #${order.id} - ${order.customerName}`,
      text: `Dear ${brandName} Team,

A new customer order query has been placed!

CUSTOMER DETAILS:
• Name: ${order.customerName}
• Phone: ${order.customerPhone}
• Email: ${order.customerEmail}
• Delivery Address: ${order.shippingAddress || 'Not specified'}
${order.notes ? `• Gift Note: "${order.notes}"\n` : ''}

ORDER DETAILS:
• Reference: #${order.id}
• Total Amount: ₹${order.totalAmount}
• Items:
${itemsListPlain}

Action: Contact customer at ${order.customerPhone} or reply to ${order.customerEmail}.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #faf7f2; border-radius: 16px; overflow: hidden; border: 1px solid #e8dfd8;">
          <div style="background: #2b2623; padding: 24px; color: #ffffff;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #c86d51; font-weight: 700;">New Order Query</span>
            <h1 style="margin: 6px 0 0; font-size: 22px; font-weight: 700;">Order #${order.id}</h1>
          </div>
          <div style="padding: 24px; background: #ffffff;">
            <div style="background: #fdfaf7; border: 1px solid #f0e5dd; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #c86d51;">Customer Information</h3>
              <p style="margin: 0 0 6px; font-size: 14px; color: #2b2623;"><strong>Name:</strong> ${order.customerName}</p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #2b2623;"><strong>Phone / WhatsApp:</strong> <a href="tel:${order.customerPhone}" style="color: #c86d51;">${order.customerPhone}</a></p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #2b2623;"><strong>Email:</strong> <a href="mailto:${order.customerEmail}" style="color: #c86d51;">${order.customerEmail}</a></p>
              <p style="margin: 0 0 6px; font-size: 14px; color: #2b2623;"><strong>Delivery Address:</strong> ${order.shippingAddress || 'To be confirmed on call'}</p>
              ${order.notes ? `<p style="margin: 0; font-size: 14px; color: #2b2623;"><strong>Notes:</strong> <em>"${order.notes}"</em></p>` : ''}
            </div>

            <h3 style="margin: 0 0 12px; font-size: 14px; color: #2b2623;">Ordered Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #faf7f2; color: #5c5550; font-size: 12px; text-transform: uppercase;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px 8px; font-weight: 700; color: #2b2623; text-align: right; font-size: 14px;">Estimated Total:</td>
                  <td style="padding: 12px 8px; font-weight: 700; color: #c86d51; text-align: right; font-size: 16px;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>

            <div style="text-align: center; margin-top: 24px;">
              <a href="https://wa.me/${(order.customerPhone || '').replace(/[^0-9]/g, '')}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-size: 13px; font-weight: 600; margin-right: 8px;">Chat on WhatsApp</a>
              <a href="mailto:${order.customerEmail}" style="display: inline-block; background: #c86d51; color: #ffffff; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-size: 13px; font-weight: 600;">Reply via Email</a>
            </div>
          </div>
        </div>
      `
    });

    // 2. Send Professional Confirmation to Customer (Optimized for Inbox Delivery)
    await transporter.sendMail({
      from: `"${brandName} Atelier" <${ownerEmail}>`,
      to: order.customerEmail,
      replyTo: ownerEmail,
      subject: `Order Query Confirmed: #${order.id} | ${brandName}`,
      text: `Dear ${order.customerName},

Thank you for choosing ${brandName}!

Your order query #${order.id} has been received by our artisan studio team. We are carefully reviewing your request and will contact you shortly on ${order.customerPhone}.

ORDER SUMMARY:
• Order Reference: #${order.id}
• Estimated Total: ₹${order.totalAmount}
• Items:
${itemsListPlain}

Delivery Address:
${order.shippingAddress || 'To be confirmed on call'}

If you have any questions or wish to customize your order, simply reply directly to this email or reach us at ${studioPhone}.

Warm regards,
${brandName} Artisan Atelier
${studioAddress}
Phone: ${studioPhone}
Instagram: ${instagramUrl}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation #${order.id}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #faf7f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2b2623;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #faf7f2; padding: 24px 12px;">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e8dfd8; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
                  <!-- Header -->
                  <tr>
                    <td style="background-color: #c86d51; padding: 32px 24px; text-align: center; color: #ffffff;">
                      <h1 style="margin: 0; font-size: 26px; font-weight: 700; letter-spacing: 0.5px;">${brandName}</h1>
                      <p style="margin: 6px 0 0; font-size: 13px; color: #faede9; letter-spacing: 0.5px;">Handcrafted Botanical Art & Floral Keepsakes</p>
                    </td>
                  </tr>

                  <!-- Confirmation Banner -->
                  <tr>
                    <td style="padding: 24px 28px 12px; text-align: center; border-bottom: 1px solid #f4ede7;">
                      <div style="display: inline-block; background-color: #edf7ee; color: #2e7d32; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 999px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                        ✓ Order Query Received
                      </div>
                      <h2 style="margin: 0 0 8px; font-size: 20px; color: #2b2623; font-weight: 700;">Thank You, ${order.customerName}!</h2>
                      <p style="margin: 0; font-size: 14px; color: #5c5550; line-height: 1.5;">
                        Your enquiry reference is <strong style="color: #c86d51;">#${order.id}</strong>. Our artisans have received your order details and will contact you directly on <strong style="color: #2b2623;">${order.customerPhone}</strong>.
                      </p>
                    </td>
                  </tr>

                  <!-- Items Table -->
                  <tr>
                    <td style="padding: 20px 28px;">
                      <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #2b2623;">Order Summary</h3>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                        <thead>
                          <tr style="background-color: #fbf7f4; color: #5c5550; font-size: 12px; text-transform: uppercase;">
                            <th style="padding: 10px 8px; text-align: left;">Item</th>
                            <th style="padding: 10px 8px; text-align: center;">Qty</th>
                            <th style="padding: 10px 8px; text-align: right;">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${itemsRowsHtml}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colspan="2" style="padding: 14px 8px; font-weight: 700; color: #2b2623; text-align: right; font-size: 14px;">Estimated Total:</td>
                            <td style="padding: 14px 8px; font-weight: 700; color: #c86d51; text-align: right; font-size: 17px;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                          </tr>
                        </tfoot>
                      </table>

                      <!-- Delivery Card -->
                      <div style="background-color: #faf7f2; border: 1px solid #ebdcd5; border-radius: 12px; padding: 16px;">
                        <p style="margin: 0 0 6px; font-size: 12px; text-transform: uppercase; color: #c86d51; font-weight: 700; letter-spacing: 0.5px;">Delivery Destination</p>
                        <p style="margin: 0; font-size: 13px; color: #2b2623; line-height: 1.4;">${order.shippingAddress || 'To be confirmed on call'}</p>
                        ${order.notes ? `<p style="margin: 8px 0 0; font-size: 12px; color: #5c5550; font-style: italic;">Gift Note: "${order.notes}"</p>` : ''}
                      </div>
                    </td>
                  </tr>

                  <!-- Footer / Studio Details (CAN-SPAM Compliance) -->
                  <tr>
                    <td style="background-color: #f7f2ed; padding: 24px 28px; text-align: center; border-top: 1px solid #e8dfd8; font-size: 12px; color: #8c827a; line-height: 1.6;">
                      <p style="margin: 0 0 6px; font-weight: 600; color: #5c5550;">${brandName} Atelier & Workshop</p>
                      <p style="margin: 0 0 6px;">${studioAddress}</p>
                      <p style="margin: 0 0 10px;">
                        Phone / WhatsApp: <a href="tel:${studioPhone}" style="color: #c86d51; text-decoration: none;">${studioPhone}</a> &bull; 
                        Concierge: <a href="mailto:${ownerEmail}" style="color: #c86d51; text-decoration: none;">${ownerEmail}</a>
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #a19790;">
                        You received this email because you submitted an order enquiry on our website. You can reply directly to this email at any time.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `
    });

    console.log(`✉️ Order notification emails successfully sent for #${order.id} via ${ownerEmail}`);
  } catch (error) {
    console.error('❌ Failed to dispatch order emails:', error.message);
  }
};

/**
 * Send Inquiry Notification to Owner & Customer
 */
const sendInquiryEmails = async (inquiry) => {
  const { transporter, ownerEmail, contact } = await createTransporter();

  if (!transporter) {
    return;
  }

  const brandName = contact?.brandName || 'Candy Crafts';
  const studioPhone = contact?.phone || '+91 98765 43210';
  const studioAddress = contact?.address || 'New Delhi, India';

  try {
    // 1. To Owner
    await transporter.sendMail({
      from: `"${brandName} Inquiries" <${ownerEmail}>`,
      to: ownerEmail,
      replyTo: inquiry.email,
      subject: `[${brandName}] New Customer Inquiry from ${inquiry.name}`,
      text: `New customer inquiry received:
• Name: ${inquiry.name}
• Email: ${inquiry.email}
• Phone: ${inquiry.phone || 'N/A'}
• Subject: ${inquiry.subject}

Message:
${inquiry.message}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e8dfd8; padding: 24px;">
          <h2 style="color: #c86d51; margin-top: 0;">New Studio Message</h2>
          <p><strong>From:</strong> ${inquiry.name} (${inquiry.email})</p>
          <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
          <p><strong>Subject:</strong> ${inquiry.subject}</p>
          <div style="background: #faf7f2; padding: 16px; border-radius: 10px; border-left: 4px solid #c86d51; margin: 16px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${inquiry.message}</p>
          </div>
          <a href="mailto:${inquiry.email}" style="display: inline-block; background: #c86d51; color: #ffffff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">Reply to ${inquiry.name}</a>
        </div>
      `
    });

    // 2. Confirmation to Customer
    await transporter.sendMail({
      from: `"${brandName} Atelier" <${ownerEmail}>`,
      to: inquiry.email,
      replyTo: ownerEmail,
      subject: `We have received your message! | ${brandName}`,
      text: `Dear ${inquiry.name},

Thank you for contacting ${brandName}! Our artisan team has received your message regarding "${inquiry.subject}" and will respond shortly.

Warm regards,
${brandName} Atelier Team
Phone: ${studioPhone}
Address: ${studioAddress}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e8dfd8;">
          <div style="background: #c86d51; padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px;">${brandName}</h1>
            <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Artisan Workshop & Atelier</p>
          </div>
          <div style="padding: 24px;">
            <h2 style="margin: 0 0 12px; font-size: 18px; color: #2b2623;">Thank You, ${inquiry.name}!</h2>
            <p style="color: #5c5550; line-height: 1.5; font-size: 14px;">
              Our artisan team has received your note regarding <strong>"${inquiry.subject}"</strong>. We will review it and get back to you shortly.
            </p>
            <div style="background: #faf7f2; border: 1px solid #ebdcd5; border-radius: 10px; padding: 14px; margin: 18px 0; font-size: 13px; color: #5c5550;">
              <strong>Your Message:</strong><br>
              <em>"${inquiry.message}"</em>
            </div>
            <p style="color: #8c827a; font-size: 12px; margin: 0; border-top: 1px solid #f0e9e4; padding-top: 14px;">
              ${brandName} Atelier &bull; ${studioAddress} &bull; ${studioPhone}
            </p>
          </div>
        </div>
      `
    });
  } catch (error) {
    console.error('❌ Failed to dispatch inquiry emails:', error.message);
  }
};

module.exports = {
  sendOrderEmails,
  sendInquiryEmails,
  verifyAndTestEmail,
  getEmailCredentials
};
