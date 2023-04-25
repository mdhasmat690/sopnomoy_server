const { getDb } = require("../utils/dbConnect");
const ObjectId = require("mongodb").ObjectId;

module.exports.saveConverSion = async (req, res, next) => {
  try {
    const db = getDb();
    const conversion = req.body;

    const result = await db.collection("conversion").insertOne(conversion);

    if (!result.insertedId) {
      return res
        .status(400)
        .send({ status: false, error: "Something went wrong!" });
    }

    res.send({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.editConverSion = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const message = req.body;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid tool id." });
    }

    const result = await db
      .collection("conversion")
      .updateOne({ _id: new ObjectId(id) }, { $set: message });

    if (!result.modifiedCount) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't update the tool" });
    }

    res
      .status(200)
      .json({ success: true, message: "Successfully updated the tool" });
  } catch (error) {
    next(error);
  }
};

module.exports.saveMessage = async (req, res, next) => {
  try {
    const db = getDb();
    const conversion = req.body;

    const result = await db.collection("message").insertOne(conversion);

    if (!result.insertedId) {
      return res
        .status(400)
        .send({ status: false, error: "Something went wrong!" });
    }

    res.send({
      success: true,
      id: result.insertedId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getConversion = async (req, res, next) => {
  try {
    const db = getDb();
    const { email } = req.query;

    const result = await db
      .collection("conversion")
      .find({ participants: email })
      .toArray();

    if (!result) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't find a tool with this id" });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

module.exports.getConversions = async (req, res, next) => {
  try {
    const db = getDb();
    const { email } = req.query;
    const result = await db
      .collection("conversion")
      .find({
        users: { $elemMatch: { email } },
      })
      .toArray();

    if (!result) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't find a tool with this id" });
    }

    res.status(200).json({ success: true, result: Object.values(result) });
  } catch (error) {
    next(error);
  }
};

module.exports.getMessage = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid tool id." });
    }

    const result = await db
      .collection("message")
      .find({ conversationId: id })
      .toArray();

    if (!result) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't find a tool with this id" });
    }

    res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};
