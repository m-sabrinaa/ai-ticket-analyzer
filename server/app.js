import express from "express";
import dotenv from "dotenv";
dotenv.config();
import analyze from './analyze.controller.js';
import cors from "cors";

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.send({"status": "ok"});
})

app.post('/analyze-ticket', analyze);


app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})