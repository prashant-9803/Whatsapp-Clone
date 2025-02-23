const Message = require("../models/Message");
const renameSync = require("fs").renameSync;
const User = require("../models/User");

exports.addMessage = async (req, res) => {
  try {
    const { message, from, to } = req.body;
    // onlineusers todo
    const getUser = onlineUsers ? onlineUsers.get(to) : null;

    //from to parseInt
    if (message && from && to) {
      const newMessage = await Message.create({
        sender: from,
        receiver: to,
        message,
        status: getUser ? "delivered" : "sent",
      }).then((message) => message.populate(["sender", "receiver"]));

      // Update sender's sentMessages
      await User.findByIdAndUpdate(from, {
        $push: { sentMessages: newMessage._id },
      });

      // Update receiver's receivedMessages
      await User.findByIdAndUpdate(to, {
        $push: { receivedMessages: newMessage._id },
      });

      return res.status(200).json({
        success: true,
        result: "Message added successfully",
        message: newMessage,
      });
    }

    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { from, to } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: from, receiver: to },
        { sender: to, receiver: from },
      ],
    })
      .populate(["sender", "receiver"])
      .sort({ _id: 1 });

    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (message.status !== "read" && message.sender._id.toString() === to) {
        messages[index].status = "read";
        unreadMessages.push(message._id);
      }
    });

    await Message.updateMany(
      { _id: { $in: unreadMessages } },
      { $set: { status: "read" } }
    );

    return res.status(200).json({
      success: true,
      result: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.addImageMessage = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (req.file) {
      console.log("files:, ", req.file);
      const date = Date.now();
      const getUser = onlineUsers ? onlineUsers.get(to) : null;

      const originalName = req.file.originalname;
      let fileName = "uploads/images/" + date + "_" + originalName;
      console.log(fileName);
      console.log(req.file.path);

      renameSync(req.file.path, fileName);

      if (from && to) {
        // Determine the type based on the file extension
        const fileType = originalName.endsWith(".pdf") ? "file" : "image";

        const message = await Message.create({
          sender: from,
          receiver: to,
          message: fileName,
          type: fileType, // Use the determined file type
          status: getUser ? "delivered" : "sent",
        }).then((message) => message.populate(["sender", "receiver"]));

        // Update sender's sentMessages
        await User.findByIdAndUpdate(from, {
          $push: { sentMessages: message._id },
        });

        // Update receiver's receivedMessages
        await User.findByIdAndUpdate(to, {
          $push: { receivedMessages: message._id },
        });

        return res.status(200).json({
          success: true,
          result: "Image added successfully",
          message,
        });
      }

      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Image is Required",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.addAudioMessage = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (req.file) {
      console.log("files:, ", req.file);
      const date = Date.now();
      const getUser = onlineUsers ? onlineUsers.get(to) : null;

      const originalName = req.file.originalname;
      let fileName = "uploads/recordings/" + date + "_" + originalName;
      console.log(fileName);
      console.log(req.file.path);

      renameSync(req.file.path, fileName);

      if (from && to) {
        const message = await Message.create({
          sender: from,
          receiver: to,
          message: fileName,
          type: "audio", // Use the determined file type
          status: getUser ? "delivered" : "sent",
        }).then((message) => message.populate(["sender", "receiver"]));

        // Update sender's sentMessages
        await User.findByIdAndUpdate(from, {
          $push: { sentMessages: message._id },
        });

        // Update receiver's receivedMessages
        await User.findByIdAndUpdate(to, {
          $push: { receivedMessages: message._id },
        });

        return res.status(200).json({
          success: true,
          result: "Audio added successfully",
          message,
        });
      }

      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Audio is Required",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getInitialContactsWithMessages = async (req, res) => {
  try {
    const userId = req.params.from;

    const user = await User.findOne({ _id: userId })
      .populate({
        path: "sentMessages",
        populate: [{ path: "receiver" }, { path: "sender" }],
        options: { sort: { createdAt: -1 } },
      })
      .populate({
        path: "receivedMessages",
        populate: [{ path: "receiver" }, { path: "sender" }],
        options: { sort: { createdAt: -1 } },
      });

    const messages = [...user.sentMessages, ...user.receivedMessages];

    messages.sort((a, b) => {
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      // Ensure consistent ID comparison by stringifying
      const senderId = msg.sender._id.toString();
      const receiverId = msg.receiver._id.toString();
      const userIdStr = userId.toString();

      const isSender = senderId === userIdStr;
      // Consistent key format using string IDs
      const calculatedId = isSender ? receiverId : senderId;

      console.log("message:", msg);
      if (msg.status === "sent") {
        messageStatusChange.push(msg._id);
      }

      if (!users.get(calculatedId)) {
        const { id, type, message, status, createdAt, sender, receiver } = msg;

        let user = {
          messageId: id,
          type,
          message,
          status,
          createdAt,
          sender,
          receiver,
        };

        if (isSender) {
          user = {
            ...user,
            ...msg.receiver,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: status !== "read" ? 1 : 0,
          };
        }

        users.set(calculatedId, {
          ...user,
          _id: calculatedId,
        });
      } else if (msg.status !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          _id: calculatedId,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length > 0) {
      await Message.updateMany(
        { _id: { $in: messageStatusChange } },
        { $set: { status: "delivered" } }
      );
    }
    return res.status(200).json({
      success: true,
      result: "Messages fetched successfully",
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
