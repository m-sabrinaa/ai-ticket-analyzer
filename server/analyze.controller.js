import llm_analyze from "./llm.js";
import validateRequest from "./reqValidator.js";
import validateResponse from "./resValidator.js";

const analyze = async (req, res) => {
    try {
        const isValidReq = validateRequest(req);

        if (!isValidReq) {
            return res.status(400).json({
                error: "Invalid Request Schema"
            });
        }

        const response = await llm_analyze(req.body);

        const isValidRes = validateResponse(req, response);

        if (!isValidRes) {
            return res.status(500).json({
                error: "Invalid Response Schema"
            });
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            error: "Unable to analyze ticket"
        });
    }
};

export default analyze;