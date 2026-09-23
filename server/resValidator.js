
const validEvidenceVerdicts = [
    "consistent",
    "inconsistent",
    "insufficient_data"
];

const validCaseTypes = [
    "wrong_transfer",
    "payment_failed",
    "refund_request",
    "duplicate_payment",
    "merchant_settlement_delay",
    "agent_cash_in_issue",
    "phishing_or_social_engineering",
    "other"
];

const validSeverities = [
    "low",
    "medium",
    "high",
    "critical"
];

const validDepartments = [
    "customer_support",
    "dispute_resolution",
    "payments_ops",
    "merchant_operations",
    "agent_operations",
    "fraud_risk"
];

const sensitivePatterns = [
    /\bpin\b/i,
    /\botp\b/i,
    /\bpassword\b/i,
    /\bverification\s+code\b/i,
    /\bfull\s+card\s+number\b/i
];

const validateResponse = (req, response) => {

    if (!response || typeof response !== "object") {
        return false;
    }

    const requiredFields = [
        "ticket_id",
        "relevant_transaction_id",
        "evidence_verdict",
        "case_type",
        "severity",
        "department",
        "agent_summary",
        "recommended_next_action",
        "customer_reply",
        "human_review_required"
    ];

    for (const field of requiredFields) {
        if (!(field in response)) {
            return false;
        }
    }

    if (
        typeof response.ticket_id !== "string" ||
        response.ticket_id !== req.body.ticket_id
    ) {
        return false;
    }

    if (
        response.relevant_transaction_id !== null &&
        typeof response.relevant_transaction_id !== "string"
    ) {
        return false;
    }

    if (!validEvidenceVerdicts.includes(response.evidence_verdict)) {
        return false;
    }

    if (!validCaseTypes.includes(response.case_type)) {
        return false;
    }

    if (!validSeverities.includes(response.severity)) {
        return false;
    }

    if (!validDepartments.includes(response.department)) {
        return false;
    }

    if (typeof response.agent_summary !== "string") {
        return false;
    }

    if (typeof response.recommended_next_action !== "string") {
        return false;
    }

    if (typeof response.customer_reply !== "string") {
        return false;
    }

    if (typeof response.human_review_required !== "boolean") {
        return false;
    }

    if (response.confidence !== undefined) {
        if (
            typeof response.confidence !== "number" ||
            response.confidence < 0 ||
            response.confidence > 1
        ) {
            return false;
        }
    }

    if (response.reason_codes !== undefined) {
        if (!Array.isArray(response.reason_codes)) {
            return false;
        }
    }

    if (
        sensitivePatterns.some(pattern =>
            pattern.test(response.customer_reply)
        )
    ) {
        return false;
    }

    if (response.relevant_transaction_id !== null) {
        const transactions = req.body.transaction_history || [];

        const transactionExists = transactions.some(
            transaction =>
                transaction.transaction_id === response.relevant_transaction_id
        );

        if (!transactionExists) {
            return false;
        }
    }

    return true;
};

export default validateResponse;