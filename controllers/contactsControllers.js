// import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";
import Joi from "joi";
import mongoose from "mongoose";

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;

    // Перевірка чи є `id` валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const contact = await Contact.findById(id);
    if (contact === null) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  // Add Joi here
  const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
  });

  const { error } = createContactSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }

 
  try {
    const result = await Contact.create(req.body);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;

    // Перевірка чи є `id` валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const result = await Contact.findByIdAndDelete(id);

    if (result === null) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}


async function updateContact(req, res, next) {
  // Add Joi here
  const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
    favorite: Joi.boolean(),
  });

  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }


  try {
    const { id } = req.params;

    // Перевірка чи є `id` валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    
    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });

    if (result === null) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  const favoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
  });

  const { error } = favoriteSchema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }

  try {
    const { id } = req.params;

     // Перевірка чи є `id` валідним ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contact ID" });
    }

    const result = await Contact.findByIdAndUpdate(
      id,
      { favorite: req.body.favorite },
      { new: true }
    );
    if (result === null) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}


export {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
