const express = require('express');
const prisma = require("../db");
const { getAllUsers, getUserById, createUser, deleteUserById, editUserById, patchUserById } = require('./user.service');

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
    const newUserData = req.body;

    if (!newUserData.username) {
    return res.status(400).send("username is required");
    }
    if (!newUserData.email) {
    return res.status(400).send("email is required");
    }
    if (!newUserData.password) {
    return res.status(400).send("password is required");
    }
    if (!newUserData.role) {
    return res.status(400).send("role is required");
    }

    const user = await editUserById(userId, newUserData);

    res.send({
        data: user,
        message: "edit user success",
    })
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

module.exports = router;