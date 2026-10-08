const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.EMAIL_USER || 'candycraftssstudio@gmail.com';
  const pass = process.env.EMAIL_PASS;

  if (!pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
};

/**
 * Send Order Query Notification to Owner & Customer Confirmation
 */
const sendOrderEmails = async (order) => {
  const transporter = createTransporter();
  const ownerEmail = process.env.OWNER_EMAIL || 'candycraftssstudio@gmail.com';

  if (!transporter) {
    console.log('ℹ️ Nodemailer: EMAIL_PASS not configured. Skipping automated SMTP delivery.');
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

    console.log(`✉️ Order notification emails successfully sent for #${order.id}`);
  } catch (error) {
    console.error('❌ Failed to dispatch order emails:', error.message);
  }
};

/**
 * Send Inquiry Notification to Owner & Customer
 */
const sendInquiryEmails = async (inquiry) => {
  const transporter = createTransporter();
  const ownerEmail = process.env.OWNER_EMAIL || 'candycraftssstudio@gmail.com';

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
  sendInquiryEmails
};
