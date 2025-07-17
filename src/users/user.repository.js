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
    const user = await prisma.user.create({
        data: {
            username: newUserData.username,
            email: newUserData.email,
            password: newUserData.password,
            role: newUserData.role,
        },
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
        },
    });

    return user;
}

module.exports = {
    findUsers,
    findUserById,
    insertUser,
    deleteUser,
    editUser
};