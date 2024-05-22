import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  createContactSchema,
  updateContactSchema
} from "../controllers/contactsControllers.js";

import { validateBody } from "../helpers/validateBody.js"

router.use("/contacts", contactRoutes);

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.get("/:id", contactsController.getOneContact);

contactsRouter.delete("/:id", contactsController.deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", validateId, validateBody(favoriteSchema),
  contactsController.updateStatus
);


export default contactsRouter;
