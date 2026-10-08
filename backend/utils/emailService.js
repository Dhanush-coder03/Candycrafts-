const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const ContactInfo = require('../models/ContactInfo');

/**
 * Retrieve dynamic email credentials from database (Admin Settings) or fallback to env
 */
const getEmailCredentials = async () => {
  let user = process.env.EMAIL_USER || 'candycraftssstudio@gmail.com';
  let pass = process.env.EMAIL_PASS || '';
  let ownerEmail = process.env.OWNER_EMAIL || user;

  try {
    if (mongoose.connection.readyState === 1) {
      const contact = await ContactInfo.findOne();
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

  return { user, pass, ownerEmail };
};

const createTransporter = async () => {
  const { user, pass, ownerEmail } = await getEmailCredentials();

  if (!pass) {
    return { transporter: null, user, ownerEmail };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });

  return { transporter, user, ownerEmail };
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

  // Send a test verification email to confirm delivery
  await transporter.sendMail({
    from: `"Candy Crafts Admin" <${user}>`,
    to: user,
    subject: '🌸 Candy Crafts Atelier - Email Setup Verified!',
    text: `Hello,\n\nYour Candy Crafts email dispatch settings have been successfully configured from the Admin Panel!\n\nConfigured Sender: ${user}\nTimestamp: ${new Date().toLocaleString()}\n\nAll customer order queries will now notify you here automatically.`
  });

  return { success: true, email: user };
};

/**
 * Send Order Query Notification to Owner & Customer Confirmation
 */
const sendOrderEmails = async (order) => {
  const { transporter, ownerEmail } = await createTransporter();

  if (!transporter) {
    console.log('ℹ️ Nodemailer: EMAIL_PASS not configured in Admin Settings or env. Skipping automated SMTP delivery.');
    return;
  }

  const itemsList = (order.items || [])
    .map(item => `• ${item.name} (Qty: ${item.quantity}) - ₹${item.price * item.quantity}`)
    .join('\n');

  try {
    // 1. Send to Owner
    await transporter.sendMail({
      from: `"Candy Crafts Store" <${ownerEmail}>`,
      to: ownerEmail,
      subject: `[Candy Crafts] New Order Query #${order.id} from ${order.customerName}`,
      text: `Dear Candy Crafts Team,

A new customer order query has been placed!

CUSTOMER DETAILS:
• Name: ${order.customerName}
• Phone: ${order.customerPhone}
• Gmail: ${order.customerEmail}
• Delivery Address: ${order.shippingAddress || 'Not specified'}
${order.notes ? `• Gift Note: "${order.notes}"\n` : ''}

ORDER DETAILS:
• Reference: #${order.id}
• Total Amount: ₹${order.totalAmount}
• Items:
${itemsList}

Action: Contact customer at ${order.customerPhone} or reply to ${order.customerEmail}.`
    });

    // 2. Send confirmation to Customer
    await transporter.sendMail({
      from: `"Candy Crafts Atelier" <${ownerEmail}>`,
      to: order.customerEmail,
      subject: `[Candy Crafts] Your order query has been received! #${order.id}`,
      text: `Dear ${order.customerName},

Thank you for choosing Candy Crafts!
Your order query #${order.id} has been received by our studio atelier team. We will contact you soon on ${order.customerPhone}.

ORDER SUMMARY:
• Order Reference: #${order.id}
• Estimated Total: ₹${order.totalAmount}
• Items:
${itemsList}

If you have questions, reply directly to this email: ${ownerEmail}.

Warm regards,
Candy Crafts Atelier Team`
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
  const { transporter, ownerEmail } = await createTransporter();

  if (!transporter) {
    return;
  }

  try {
    // To Owner
    await transporter.sendMail({
      from: `"Candy Crafts Inquiries" <${ownerEmail}>`,
      to: ownerEmail,
      subject: `[Candy Crafts] New Customer Inquiry from ${inquiry.name}`,
      text: `New customer inquiry received:
• Name: ${inquiry.name}
• Email: ${inquiry.email}
• Phone: ${inquiry.phone || 'N/A'}
• Subject: ${inquiry.subject}

Message:
${inquiry.message}`
    });

    // Confirmation to customer
    await transporter.sendMail({
      from: `"Candy Crafts Atelier" <${ownerEmail}>`,
      to: inquiry.email,
      subject: `[Candy Crafts] We have received your inquiry!`,
      text: `Dear ${inquiry.name},

Thank you for contacting Candy Crafts! Our artisan team has received your message regarding "${inquiry.subject}" and will respond shortly.

Warm regards,
Candy Crafts Atelier Team
Official Email: ${ownerEmail}`
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
