const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const {
    getContacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact
} = require ("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.use(bodyParser.json());
router.route('/').get(getContacts).post(createContact);
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;