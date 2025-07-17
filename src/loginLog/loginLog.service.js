const prisma = require("../db");
const { findLoginLogs, findLoginLogById, insertLoginLog, editLoginLog, deleteLoginLog } = require("./loginLog.repository");

const getAllLoginLog = async () => {
    const loginLogs = await findLoginLogs();

    return loginLogs;
};

const getLoginLogById = async (log_id) => {
    const loginLog = await findLoginLogById(log_id);

    if (!loginLog) {
        throw Error("User not found")
    }

    return loginLog;
}

const createLoginLog = async (newLoginLogData) => {
    const loginLog = await insertLoginLog(newLoginLogData);

    return loginLog;
};

const deleteLoginLogById = async (log_id) => {
    await getLoginLogById(log_id);

    await deleteLoginLog(log_id);
};

const editLoginLogById = async (log_id, newLoginLogData) => {
    await getLoginLogById(log_id);

    const loginLog = await editLoginLog(log_id, newLoginLogData);

    return loginLog;
}

const patchLoginLogById = async (log_id, newLoginLogData) => {
    await getLoginLogById(log_id);

    const loginLog = await editLoginLog(log_id, newLoginLogData); 
    return loginLog;
};

module.exports = {
    getAllLoginLog,
    getLoginLogById,
    createLoginLog,
    deleteLoginLogById,
    editLoginLogById,
    patchLoginLogById
}