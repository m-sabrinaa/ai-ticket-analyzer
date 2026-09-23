import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { analyzeTicket } from "@/services/api";

const campaigns = [
    "boishakh_bonanza_day_1",
    "boishakh_bonanza_day_2",
    "eid_campaign",
    "cashback_campaign",
    "none"
];

const TicketForm = () => {
    const [complaint, setComplaint] = useState("");
    const [campaignContext, setCampaignContext] = useState("");
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [fileName, setFileName] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [ticketNumber, setTicketNumber] = useState(() => {
        const savedNumber = localStorage.getItem("ticketNumber");
        return savedNumber ? Number(savedNumber) : 1;
    });

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        setFileName(file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (results) => {
                setTransactionHistory(results.data);
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setResult(null);

        if (!complaint.trim()) {
            setError("Please enter a customer complaint.");
            return;
        }

        const ticket = {
            ticket_id: `TKT-${String(ticketNumber).padStart(3, "0")}`,
            complaint: complaint.trim(),
            language: "en",
            channel: "in_app_chat",
            user_type: "customer",
            campaign_context: campaignContext || undefined,
            transaction_history: transactionHistory
        };

        console.log("Request JSON:", ticket);

        try {
            setLoading(true);

            const data = await analyzeTicket(ticket);

            setResult(data);

            const nextNumber = ticketNumber + 1;

            setTicketNumber(nextNumber);
            localStorage.setItem("ticketNumber", nextNumber);
        } catch (error) {
            setError(error.message || "Failed to analyze ticket.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setResult(null);
        setError("");
    };

    if (result) {
        return (
            <div className="w-full max-w-3xl space-y-8">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight !text-black">
                        Customer Message
                    </h1>
                </div>

                <Card>
                    <CardContent className="p-8">
                        <p className="text-base leading-7">
                            {result.customer_reply}
                        </p>
                    </CardContent>
                </Card>

                <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleBack}
                >
                    Back
                </Button>

            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl space-y-8">

            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight !text-black">
                    AI Ticket Analyzer
                </h1>

                <p className="text-muted-foreground">
                    Analyze customer support tickets using transaction evidence
                </p>
            </div>

            <Card>
                <CardContent className="p-8">

                    <form onSubmit={handleSubmit} className="space-y-7">

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Customer Complaint
                            </label>

                            <Textarea
                                placeholder="Describe the customer's issue..."
                                className="min-h-32 resize-none"
                                value={complaint}
                                onChange={(e) => {
                                    setComplaint(e.target.value);
                                    setError("");
                                }}
                            />

                            {error && (
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Campaign Context
                            </label>

                            <Select
                                value={campaignContext}
                                onValueChange={setCampaignContext}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select campaign (optional)" />
                                </SelectTrigger>

                                <SelectContent>
                                    {campaigns.map((campaign) => (
                                        <SelectItem
                                            key={campaign}
                                            value={campaign}
                                        >
                                            {campaign}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Transaction History
                            </label>

                            <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition hover:bg-muted/50">
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />

                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {fileName || "Upload transaction history"}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        CSV file only · Optional
                                    </p>
                                </div>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={loading}
                        >
                            {loading ? "Analyzing..." : "Analyze Ticket"}
                        </Button>

                    </form>

                </CardContent>
            </Card>

        </div>
    );


};

export default TicketForm;
