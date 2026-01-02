import contactModel from "../models/contactModel.js";
import { sendContactReply } from "../utils/emailService.js";

// Submit contact form
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.json({
        success: false,
        message: "Please fill in all required fields!",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email address!",
      });
    }

    const newContact = new contactModel({
      name,
      email,
      phone: phone || "",
      subject,
      message,
    });

    await newContact.save();

    res.json({
      success: true,
      message: "Your message has been sent successfully! We'll get back to you soon.",
    });
  } catch (error) {
    console.log("Contact submission error:", error);
    res.json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};

// Get all contact messages (admin only)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find({}).sort({ date: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.log("Get contacts error:", error);
    res.json({ success: false, message: "Failed to fetch contacts." });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.body;
    await contactModel.findByIdAndUpdate(messageId, { read: true });
    res.json({ success: true, message: "Message marked as read" });
  } catch (error) {
    console.log("Mark as read error:", error);
    res.json({ success: false, message: "Failed to update message status." });
  }
};

// Mark message as unread
const markAsUnread = async (req, res) => {
  try {
    const { messageId } = req.body;
    await contactModel.findByIdAndUpdate(messageId, { read: false });
    res.json({ success: true, message: "Message marked as unread" });
  } catch (error) {
    console.log("Mark as unread error:", error);
    res.json({ success: false, message: "Failed to update message status." });
  }
};

// Reply to contact message
const replyToContact = async (req, res) => {
  try {
    const { messageId, replyMessage } = req.body;

    if (!messageId || !replyMessage) {
      return res.json({
        success: false,
        message: "Message ID and reply message are required!",
      });
    }

    // Get the contact message
    const contact = await contactModel.findById(messageId);
    if (!contact) {
      return res.json({
        success: false,
        message: "Contact message not found!",
      });
    }

    // Send email reply
    const emailResult = await sendContactReply(
      contact.email,
      contact.name,
      contact.subject,
      replyMessage
    );

    if (!emailResult.success) {
      return res.json({
        success: false,
        message: "Failed to send email reply. Please try again later.",
      });
    }

    // Update contact message with reply info
    await contactModel.findByIdAndUpdate(messageId, {
      replied: true,
      repliedAt: Date.now(),
      replyMessage: replyMessage,
      read: true, // Also mark as read when replied
    });

    res.json({
      success: true,
      message: "Reply sent successfully to " + contact.email,
    });
  } catch (error) {
    console.log("Reply to contact error:", error);
    res.json({
      success: false,
      message: "Failed to send reply. Please try again later.",
    });
  }
};

export { submitContact, getAllContacts, markAsRead, markAsUnread, replyToContact };

