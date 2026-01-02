import express from "express";
import { submitContact, getAllContacts, markAsRead, markAsUnread } from "../controllers/contactController.js";
import adminAuth from "../middleware/adminAuth.js";

const contactRouter = express.Router();

contactRouter.post("/submit", submitContact);
contactRouter.get("/list", adminAuth, getAllContacts);
contactRouter.post("/mark-read", adminAuth, markAsRead);
contactRouter.post("/mark-unread", adminAuth, markAsUnread);

export default contactRouter;

