const prisma = require("../db");

const findLoginLogs = async () => {
    const loginLogs = await prisma.loginLog.findMany();

    return loginLogs;
}

const findLoginLogById = async (log_id) => {
    const loginLog = await prisma.loginLog.findUnique({
        where: {
            log_id,
        },
    });

    return loginLog;
};

const insertLoginLog = async (newLoginLogData) => {
    const loginLog = await prisma.loginLog.create({
        data: {
            user_id: newLoginLogData.user_id,
            ip_address: newLoginLogData.ip_address,
            user_agent: newLoginLogData.user_agent,
            status: newLoginLogData.status,
            failure_reason: newLoginLogData.failure_reason
        },
    });

    return loginLog;
};

const deleteLoginLog = async (log_id) => {
    await prisma.loginLog.delete({
        where: {
            log_id,
        },
    });
}

const editLoginLog = async (log_id, newLoginLogData) => {
    const loginLog = await prisma.loginLog.update({
        where: {
            log_id,
        },
        data: {
            user_id: newLoginLogData.user_id,
            ip_address: newLoginLogData.ip_address,
            user_agent: newLoginLogData.user_agent,
            status: newLoginLogData.status,
            failure_reason: newLoginLogData.failure_reason,
            updated_at: new Date()
        },
    });

    return loginLog;
}

module.exports = {
    findLoginLogs,
    findLoginLogById,
    insertLoginLog,
    deleteLoginLog,
    editLoginLog
};