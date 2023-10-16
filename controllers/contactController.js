const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModels");
//@desc Get all contacts
//@routes GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts)
});

module.exports = { getContacts };

//@desc Create New contacts
//@routes POST /api/contacts 
//@access private

const createContact = asyncHandler(async (req, res) => {
    console.log("The req body--- ", req.body);
    const { name, email, phone } = req.body;
    if (!name || !phone || !email) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json(contact)
});

//@desc Get contact
//@routes GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to fetch other user contacts")
    }

    res.status(200).json({ contact/* message:`Get contact for ${req.params.id}` */ })
});

//@desc Update contact
//@routes PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user contacts")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact/* {message:`Update contact for ${req.params.id}`} */)
})

//@desc Delete Contact
//@routes DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found")
    }

    if(contact.user_id.toString()!== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to delete other user contacts")
    }

        /* await Contact.remove(); */
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact/* {message:`Delete contact for ${req.params.id}`} */)
});

module.exports = {
    getContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact
};