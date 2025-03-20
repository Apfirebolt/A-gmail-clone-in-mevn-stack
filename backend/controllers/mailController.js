import asyncHandler from "express-async-handler";
import Email from "../models/mailModel.js";

// @desc    List of user emails
// @route   GET /api/emails
// @access  Private
const getUserEmails = asyncHandler(async (req, res) => {
  const itemsPerPage = 5;
  const startPage = req.query.page || 1;

  const result = await Email.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, totalEmails: { $sum: 1 } } },
  ]).exec();

  const totalEmails = result.length > 0 ? result[0].totalEmails : 0;
  const emails = await Email.find({ user: req.user._id })
    .skip(itemsPerPage * startPage - itemsPerPage)
    .limit(itemsPerPage)
    .exec();
  const count = await Email.countDocuments({ user: req.user._id });

  const response = {
    data: emails,
    totalEmails,
    total: count,
    success: true,
    itemsPerPage,
    startPage,
    lastPage: Math.ceil(count / itemsPerPage),
  };

  res.status(200).json(response);
});

// @desc    Create an email
// @route   POST /api/emails
// @access  Private - User
const createEmail = asyncHandler(async (req, res) => {
  const { subject, content, isImportant, from, user } = req.body;
  // convert from to json, since it was not directly accessible from the form data object
  const fromData = JSON.parse(from);
  console.log("From data", req.body);

  if (!subject || !content || !from || !fromData.name || !fromData.email) {
    res.status(400);
    throw new Error("All required fields must be filled");
  }

  // Handle attachments
  let attachments = [];
  if (req.file) {
    attachments = [req.file.path]; // Store the file path
  }

  const email = await Email.create({
    user,
    subject,
    content,
    isImportant,
    attachments,
    from: fromData,
  });

  if (email) {
    res.status(201).json(email);
  } else {
    res.status(400);
    throw new Error("Invalid email data");
  }
});

// @desc    Delete existing email
// @route   DELETE /api/emails/:id
// @access  Private - Admin or User
const deleteEmail = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.id);

  if (
    email.user.toString() !== req.user._id.toString() &&
    req.user.isAdmin === false
  ) {
    res.status(403);
    throw new Error("Only email owner or admin can delete email");
  }

  if (email) {
    await Email.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "Email removed" });
  } else {
    res.status(404);
    throw new Error("Email not found");
  }
});

// @desc    Update existing email
// @route   PATCH /api/emails/:id
// @access  Private - User or Admin
const updateEmail = asyncHandler(async (req, res) => {
  const { isImportant, isRead, isDeleted } = req.body;
  const email = await Email.findById(req.params.id);

  if (email.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only email owner can update email");
  }

  if (email) {
    email.isImportant =
      isImportant !== undefined ? isImportant : email.isImportant;
    email.isRead = isRead !== undefined ? isRead : email.isRead;
    email.isDeleted = isDeleted !== undefined ? isDeleted : email.isDeleted;

    const updatedEmail = await email.save();
    res.json(updatedEmail);
  } else {
    res.status(404);
    throw new Error("Email not found");
  }
});

// @desc    Get email by ID
// @route   GET /api/emails/:id
// @access  Private - User or Admin
const getEmail = asyncHandler(async (req, res) => {
  const email = await Email.findById(req.params.id);

  if (email.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only email owner can view email");
  }

  if (email) {
    res.json(email);
  } else {
    res.status(404);
    throw new Error("Email not found");
  }
});

export { getUserEmails, createEmail, deleteEmail, getEmail, updateEmail };
