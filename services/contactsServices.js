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

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: crypto.randomUUID(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);

  return newContact;
}

export default { listContacts, getContactById, removeContact, addContact };
