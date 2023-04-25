// const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");
const ObjectId = require("mongodb").ObjectId;

module.exports.saveATool = async (req, res, next) => {
  try {
    const db = getDb();
    const tool = req.body;

    const result = await db.collection("tools").insertOne(tool);

    if (!result.insertedId) {
      return res
        .status(400)
        .send({ status: false, error: "Something went wrong!" });
    }

    res.send({
      success: true,
      message: `Tool added with id: ${result.insertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateService = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const data = req.body;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid tool id." });
    }

    let result;

    // Check if the hobbies field exists and its data type
    const tool = await db
      .collection("tools")
      .findOne({ _id: new ObjectId(id) });
    if (tool && tool.likesUser && !Array.isArray(tool.likesUser)) {
      // If hobbies field exists but is not an array, set it to an empty array
      await db
        .collection("tools")
        .updateOne({ _id: new ObjectId(id) }, { $set: { likesUser: [] } });
    }

    const isHobbyExist = tool?.likesUser?.includes(data.likesUser);
    if (isHobbyExist) {
      result = await db.collection("tools").updateOne(
        { _id: new ObjectId(id) },
        {
          $pull: { likesUser: data.likesUser },
        }
      );
    } else {
      result = await db.collection("tools").updateOne(
        { _id: new ObjectId(id) },
        {
          $push: { likesUser: data.likesUser },
        }
      );
    }

    if (!result) {
      return res
        .status(400)
        .send({ success: false, error: "Couldn't update the tool" });
    }

    res.send({
      success: true,
      message: `Successfully updated the tool`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.watchServices = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid tool id." });
    }

    const result = await db
      .collection("tools")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { watch: 1 } },
        { upsert: true, returnOriginal: false }
      );

    if (!result.ok) {
      return res
        .status(400)
        .send({ success: false, error: "Something went wrong!" });
    }

    res.send({
      success: true,
      message: `Successfully updated the tool`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllTools = async (req, res, next) => {
  try {
    const db = getDb();

    // cursor => toArray(), forEach()
    const tool = await db.collection("tools").find({}).toArray();
    // .project({ _id: 0 })
    // .skip(+page * limit)
    // .limit(+limit)

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};

module.exports.getLikeServices = async (req, res, next) => {
  try {
    const db = getDb();
    const { name } = req.query;
    // const tool = await db.collection("tools").find({}).toArray();

    let service = null;

    if (name) {
      service = await db
        .collection("tools")
        .find({ projectType: name })
        .toArray();
    } else {
      service = await db.collection("tools").find({}).toArray();
    }

    const dataLength = service?.length;
    res.status(200).json({ success: true, dataLength, service });
  } catch (error) {
    next(error);
  }
};

module.exports.getGroupProjects = async (req, res, next) => {
  try {
    const db = getDb();
    const { name } = req.query;
    // const tool = await db.collection("tools").find({}).toArray();

    let service = null;

    if (name) {
      service = await db
        .collection("tools")
        .find({ projectType: name })
        .toArray();
    } else {
      service = await db.collection("tools").find({}).toArray();
    }

    const dataLength = service?.length;
    res.status(200).json({ success: true, dataLength, service });
  } catch (error) {
    next(error);
  }
};

module.exports.getRelatedTools = async (req, res, next) => {
  try {
    const db = getDb();
    const { email } = req.params;

    const data = await db.collection("tools").find({ email: email }).toArray();

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports.getSingleTool = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid tool id." });
    }

    const tool = await db
      .collection("tools")
      .findOne({ _id: new ObjectId(id) });

    if (!tool) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't find a tool with this id" });
    }

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};

module.exports.saveUser = async (req, res, next) => {
  try {
    const db = getDb();
    const tool = req.body;

    const result = await db.collection("users").insertOne(tool);

    if (!result.insertedId) {
      return res
        .status(400)
        .send({ status: false, error: "Something went wrong!" });
    }

    res.send({
      success: true,
      message: `Tool added with id: ${result.insertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const db = getDb();
    const user = req.body;

    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };

    const result = await db
      .collection("users")
      .updateOne(filter, updateDoc, options);

    if (!result.upsertedId) {
      return res
        .status(400)
        .send({ status: false, error: "Something went wrong!" });
    }

    res.send({
      success: true,
      message: `Tool added with id: ${result.upsertedId}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUserMore = async (req, res, next) => {
  try {
    const db = getDb();
    const email = req.params.id;
    const user = { email: email };

    const tool = await db
      .collection("users")
      .updateOne(user, { $set: req.body });

    if (!tool.modifiedCount) {
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

module.exports.getUserDetail = async (req, res, next) => {
  try {
    const db = getDb();
    const email = req.params.id;

    const tool = await db.collection("users").findOne({ email: email });

    if (!tool) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't find a tool with this id" });
    }

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};

module.exports.likeSave = async (req, res, next) => {
  try {
    const db = getDb();
    const tool = req.body;

    const existingTool = await db.collection("like").findOne(tool);

    if (existingTool) {
      const result = await db.collection("like").deleteOne(tool);

      if (!result.deletedCount) {
        return res
          .status(400)
          .send({ status: false, error: "Something went wrong!" });
      }

      res.send({
        success: true,
        message: `Tool with the same data has been deleted`,
      });
    } else {
      const result = await db.collection("like").insertOne(tool);

      if (!result.insertedId) {
        return res
          .status(400)
          .send({ status: false, error: "Something went wrong!" });
      }

      res.send({
        success: true,
        message: `Tool added with id: ${result.insertedId}`,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.getAllLikeServices = async (req, res, next) => {
  try {
    const db = getDb();
    const { email } = req.params;

    const data = await db
      .collection("like")
      .find({ likerEmail: email })
      .toArray();

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports.createCollection = async (req, res, next) => {
  try {
    const db = getDb();
    const collection = req.body;

    const result = await db.collection("collection").insertOne(collection);

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

module.exports.updateCollection = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const objects = req.body;

    console.log(objects);

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid collection id." });
    }

    const result = await db
      .collection("collection")
      .updateOne(
        { _id: new ObjectId(id) },
        { $push: { collections: objects } }
      );

    if (result.modifiedCount === 0) {
      return res.status(400).send({
        success: false,
        error: `Failed to update collection with id: ${id}`,
      });
    }

    res.send({
      success: true,
      message: `Collection updated with id: ${id}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getCollection = async (req, res, next) => {
  try {
    const db = getDb();
    const { email } = req.query;

    const data = await db
      .collection("collection")
      .find({ loginUserEmail: email })
      .toArray();

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/* 
module.exports.getUserDetail = async (req, res, next) => {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, error: "Not a valid tool id." });
    }

    const tool = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });

    if (!tool) {
      return res
        .status(400)
        .json({ success: false, error: "Couldn't find a tool with this id" });
    }

    res.status(200).json({ success: true, data: tool });
  } catch (error) {
    next(error);
  }
};
 */
