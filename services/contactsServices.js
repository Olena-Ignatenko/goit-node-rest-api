import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";


const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContactById(id) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === id);
  if (typeof contact === "undefined") {
    return null;
  }
  return contact;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const removedIndex = contacts.findIndex((contact) => contact.id === id);
  if (removedIndex === -1) return null; // Контакт не знайдено

  const removedContact = contacts[removedIndex];
  contacts.splice(removedIndex, 1);
  await writeContacts(contacts);

  return removedContact;
}

async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    ...data
  };
  contacts.push(newContact);
  await writeContacts(contacts);

  return newContact;
}

async function updateContact(id, newData) {
  
  const contacts = await listContacts();

  const contactIndex = contacts.findIndex((contact) => contact.id === id);

  if (contactIndex === -1) return null;

  const updatedContact = { ...contacts[contactIndex], ...newData };

  contacts[contactIndex] = updatedContact;

  await writeContacts(contacts);

  return updatedContact;
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
