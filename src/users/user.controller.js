const express = require('express');
const prisma = require("../db");
const { getAllUsers, getUserById, createUser, deleteUserById, editUserById, patchUserById, getTotalUserCount, getTotalUserCountByRange } = require('./user.service');

const router = express.Router();

router.get("/", async (req, res) => {
    const users = await getAllUsers();

    res.send(users);
});

router.get("/:user_id", async (req, res) => {
    try {
        const user = await getUserById(req.params.user_id);

        res.send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const newUserData = req.body;

        const user = await createUser(newUserData);

        res.send({
            data: user,
            message: "create user success",
        });
    } catch(error) {
        res.status(400).send(error.message);
    }
});

router.delete("/:user_id", async (req, res) => {
    try {
        const userId = req.params.user_id;
        await deleteUserById(userId);
        res.send("user deleted");
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.put("/:user_id", async (req, res) => {
  const userId = req.params.user_id;
  const updateData = req.body;

  if (!userId) {
    return res.status(400).send("user_id is required");
  }

  try {
    const updatedUser = await editUserById(userId, updateData);
    res.send({
      data: updatedUser,
      message: "User updated successfully"
    });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).send("Failed to update user");
  }
});

router.patch("/:user_id", async (req, res) => {
    try {
        const userId = req.params.user_id;
        const newUserData = req.body;

        const user = await patchUserById(userId, newUserData);

        res.send({
            data: user,
            message: "edit user success",
        });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.put("/:firebase_uid/password", async (req, res) => {
  const { firebase_uid } = req.params;
  const { password_hash } = req.body;

  try {
    await updateHashedPassword(firebase_uid, password_hash);
    res.send("Password updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = router;