const express = require("express");

const toolsControllers = require("../../controllers/tools.controller");
const ChatControllers = require("../../controllers/chat.controller");
const limiter = require("../../middleware/limiter");
const viewCount = require("../../middleware/veiwCount");

const router = express.Router();

/* collection */

router
  .route("/collection")
  .post(toolsControllers.createCollection)
  .get(toolsControllers.getCollection);

router.route("/collection/:id").put(toolsControllers.updateCollection);

/* chat controller */
router
  .route("/createConverSion")
  .post(ChatControllers.saveConverSion)
  .get(ChatControllers.getConversion);

router.route("/createConverSion/:id").patch(ChatControllers.editConverSion);

router.route("/message").post(ChatControllers.saveMessage);
router.route("/message/:id").get(ChatControllers.getMessage);

router
  .route("/createConverSions/allConversion")
  .get(ChatControllers.getConversions);
///*  */

router
  .route("/postProject")
  .post(toolsControllers.saveATool)
  .get(toolsControllers.getAllTools);

router.route("/postProject/userLikes").get(toolsControllers.getAllLikeServices);

router.route("/getProjectType").get(toolsControllers.getGroupProjects);

router
  .route("/postProject/:id")
  .get(toolsControllers.getSingleTool)
  .patch(toolsControllers.updateService)
  .put(toolsControllers.watchServices);

router
  .route("/postProject/related/:email")
  .get(toolsControllers.getRelatedTools);

router
  .route("/users")
  .post(toolsControllers.saveUser)
  .put(toolsControllers.updateUser);

router
  .route("/:id")
  .get(toolsControllers.getUserDetail)
  .patch(toolsControllers.updateUserMore);

router.route("/like").post(toolsControllers.likeSave);

router.route("/like/:email").get(toolsControllers.getAllLikeServices);
// .delete(toolsControllers.deleteTool);
// .get(viewCount, limiter, toolsControllers.getToolDetail)
// .patch(toolsControllers.updateTool)
// .delete(toolsControllers.deleteTool);

module.exports = router;
