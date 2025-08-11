const admin = require("../utils/firebaseAdmin.js");
const { findUsers, findUserById, insertUser, editUser, deleteUser, updatePasswordInDB, countAllUsers, countUsersByDateRange } = require("./user.repository");

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
    const user = await getUserById(user_id);
    if (!user) throw new Error("User not found");
    
    if (user.user_id) {
        try {
            await admin.auth().deleteUser(user.user_id);
            console.log("Firebase Auth user deleted:", user.user_id);
        } catch (error) {
            console.error("Gagal hapus Firebase user:", error.message); // ← DEBUG LOG
            throw new Error("Gagal menghapus user dari Firebase Auth");
        }
    }

    await deleteUser(user_id);
};

const editUserById = async (user_id, newUserData) => {
    await getUserById(user_id);

    const user = await editUser(user_id, newUserData);

    return user;
}

const updateHashedPassword = async (firebase_uid, password_hash) => {
  if (!password_hash) throw new Error("Hash tidak dikirim");
  await updatePasswordInDB(firebase_uid, password_hash);
};

const toStartOfDay = (d) => {
  const x = new Date(d);
  if (isNaN(x)) return null;
  x.setHours(0, 0, 0, 0);
  return x;
};
const toEndOfDay = (d) => {
  const x = new Date(d);
  if (isNaN(x)) return null;
  x.setHours(23, 59, 59, 999);
  return x;
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    deleteUserById,
    editUserById,
    updateHashedPassword,
}