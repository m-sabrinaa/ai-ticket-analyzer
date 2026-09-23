const validLanguages = ["en", "bn", "mixed"];

const validChannels = [
    "in_app_chat",
    "call_center",
    "email",
    "merchant_portal",
    "field_agent"
];

const validUserTypes = [
    "customer",
    "merchant",
    "agent",
    "unknown"
];

const validTransactionTypes = [
    "transfer",
    "payment",
    "cash_in",
    "cash_out",
    "settlement",
    "refund"
];

const validStatuses = [
    "completed",
    "failed",
    "pending",
    "reversed"
];

const validateRequest = (req) => {
    const {
        ticket_id,
        complaint,
        language,
        channel,
        user_type,
        transaction_history
    } = req.body;

    if (!ticket_id || typeof ticket_id !== "string") {
        return false;
    }

    if (!complaint || typeof complaint !== "string" || !complaint.trim()) {
        return false;
    }

    if (language !== undefined && !validLanguages.includes(language)) {
        return false;
    }

    if (channel !== undefined && !validChannels.includes(channel)) {
        return false;
    }

    if (user_type !== undefined && !validUserTypes.includes(user_type)) {
        return false;
    }

    if (transaction_history !== undefined) {
        if (!Array.isArray(transaction_history)) {
            return false;
        }

        for (const transaction of transaction_history) {
            if (!transaction.transaction_id ||
                typeof transaction.transaction_id !== "string") {
                return false;
            }

            if (!transaction.timestamp ||
                typeof transaction.timestamp !== "string") {
                return false;
            }

            if (!validTransactionTypes.includes(transaction.type)) {
                return false;
            }

            if (typeof transaction.amount !== "number") {
                return false;
            }

            if (!transaction.counterparty ||
                typeof transaction.counterparty !== "string") {
                return false;
            }

            if (!validStatuses.includes(transaction.status)) {
                return false;
            }
        }
    }

    return true;
};

export default validateRequest;