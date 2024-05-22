// import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";
import Joi from "joi";

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (contact === null) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
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
  });

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const result = await Contact.create(contact);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;

    const result = await Book.findByIdAndDelete(id);

    if (result === null) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}


async function updateContact(req, res, next) {
  try {
    const { id } = req.params;

    // Add Joi here
    const updateContactSchema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string(),
    });

    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
    };

    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

    if (result === null) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});


export {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactSchema,
  createContactSchema,
  favoriteSchema,
};
