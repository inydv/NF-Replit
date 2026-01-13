const { catchAsyncError } = require("../helpers");
const prisma = require("../configs/database.config");
const { sendMail } = require("../utils");

class ContactsController {
  createContacts = catchAsyncError(async (req, res, next) => {
    const { email, name, message } = req.body;

    await prisma.contacts.create({
      data: { email: email.toLowerCase(), name, message },
    });

    await sendMail({
      email: "fnduati@nursingfront.com",
      subject: `${name} is contacting from NursingFront ContactUs Page.`,
      template: "contactUs",
      data: {
        Email: email,
        Name: name,
        Message: message,
      },
    });

    res
      .status(201)
      .json({ SUCCESS: true, MESSAGE: "contact created successfully" });
  });
}

module.exports = new ContactsController();
