const prisma = require("../db");
const { findUsers, findUserById, insertUser, editUser, deleteUser } = require("./user.repository");

const getAllUsers = async () => {
    const users = await findUsers();

    return users;
};

const getUserById = async (user_id) => {
    const user = await findUserById(user_id);

    if (!user) {
        throw Error("User not found")
    }

    return user
}

const createUser = async (newUserData) => {
    const user = await insertUser(newUserData);

    return user;
};

const deleteUserById = async (user_id) => {
    await getUserById(user_id);

    await deleteUser(user_id);
};

const editUserById = async (user_id, newUserData) => {
    await getUserById(user_id);

    const user = await editUser(user_id, newUserData);

    return user;
}

const patchUserById = async (user_id, newUserData) => {
    await getUserById(user_id);

    const user = await editUser(user_id, newUserData); // pakai editUser dari repository
    return user;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    editUserById,
    patchUserById
}