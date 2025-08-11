const prisma = require("../db");

const findUsers = async () => {
    const users = await prisma.user.findMany();

    return users;
}

const findUserById = async (user_id) => {
    const user = await prisma.user.findUnique({
        where: {
            user_id,
        },
    });

    return user;
};

const insertUser = async (newUserData) => {
  const data = {
    username: newUserData.username,
    email: newUserData.email,
    password: newUserData.password,
    role: newUserData.role,
  };

  if (newUserData.last_login == null) {
    data.last_login = newUserData.last_login;
  }
  else{
    data.last_login = new Date();
  }

  // Tambahkan user_id jika tersedia
  if (newUserData.user_id != null) {
    data.user_id = newUserData.user_id;
  }

  const user = await prisma.user.create({
    data: data,
  });

  return user;
};

const deleteUser = async (user_id) => {
    await prisma.user.delete({
        where: {
            user_id,
        },
    });
}

const editUser = async (user_id, newUserData) => {
    const user = await prisma.user.update({
        where: {
            user_id,
        },
        data: {
            username: newUserData.username,
            email: newUserData.email,
            password: newUserData.password,
            role: newUserData.role,
            updated_at: new Date(),
            last_login: newUserData.last_login,
        },
    });

    return user;
}

const updatePasswordInDB = async (firebase_uid, password_hash) => {
  await prisma.user.update({
    where: { firebase_uid },
    data: { password: password_hash },
  });
};

module.exports = {
    findUsers,
    findUserById,
    insertUser,
    deleteUser,
    editUser,
    updatePasswordInDB,
};