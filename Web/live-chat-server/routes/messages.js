const router = require("express").Router();
const Message = require("../models/messages");

//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.post("/conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationid: req.body.conversationid,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
