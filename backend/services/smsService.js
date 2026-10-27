const twilio = require('twilio');

// Initialize Twilio client if credentials exist
let client = null;
const isTwilioConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER;

if (isTwilioConfigured) {
  try {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    console.log("✅ Twilio SMS Service initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize Twilio client:", error.message);
  }
} else {
  console.log("⚠️ Twilio credentials missing in .env (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER). Running SMS Service in MOCK mode.");
}

/**
 * Sends an SMS alert to a specific phone number.
 * @param {string} toPhone - The recipient's phone number (preferably with country code, e.g., +94771234567)
 * @param {string} message - The message content
 * @returns {Promise<boolean>} - True if successful (or mocked), false on error
 */
const sendDonationAlertSms = async (toPhone, message) => {
  if (!toPhone) return false;

  // Ensure the phone number has a country code prefix if missing
  // Defaulting to Sri Lanka (+94) as this is common in the project context based on locations like Colombo
  let formattedPhone = toPhone.trim();
  if (!formattedPhone.startsWith('+')) {
    // If it starts with 0 (e.g. 077...), remove the 0 and add +94
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+94' + formattedPhone.substring(1);
    } else {
      formattedPhone = '+94' + formattedPhone;
    }
  }

  if (!isTwilioConfigured || !client) {
    // MOCK MODE
    console.log(`\n========================================`);
    console.log(`[MOCK SMS] To: ${formattedPhone}`);
    console.log(`[MOCK SMS] Message: \n${message}`);
    console.log(`========================================\n`);
    return true; // Pretend it succeeded
  }

  // REAL TWILIO MODE
  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });
    console.log(`✅ SMS sent successfully to ${formattedPhone}. SID: ${response.sid}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send SMS to ${formattedPhone}:`, error.message);
    return false;
  }
};

module.exports = {
  sendDonationAlertSms,
  isTwilioConfigured
};
