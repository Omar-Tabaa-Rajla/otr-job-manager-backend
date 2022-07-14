import express from "express";
import dotenv from "dotenv";
import { JobSource } from "./models/JobSource.js";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";

const user = {
    id: 1,
    username: "hans",
    firstName: "Hans",
    lastName: "Richter",
};

dotenv.config();

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost/otr-job-manager";

mongoose.connect(MONGODB_URI, (err) => {
    if (err) {
        console.log({
            error: "Cannot connect to MongoDB database.",
            err: `"${err}"`,
        });
    }
});

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3044;

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
};

const decodeJwt = (token) => {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace("-", "+").replace("_", "/");
    let decodedData = JSON.parse(
        Buffer.from(base64, "base64").toString("binary")
    );
    return decodedData;
};

app.get("/", (req, res) => {
    res.send("<h1>Book Site API</h1>");
});

app.post("/maintain-login", verifyToken, (req, res) => {
    jwt.verify(req.token, "secretkey", (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            const data = decodeJwt(req.token);
            res.json({
                user: data.user,
            });
        }
    });
});

app.post("/login", (req, res) => {
    // res.status(200).json({"username": "hans"});
    const username = req.body.username;
    const password = req.body.password;

    if (username === "hans" && password === "123") {
        jwt.sign({ user }, "secretkey", { expiresIn: "20s" }, (err, token) => {
            res.json({
                user,
                token,
            });
        });
    } else {
        res.sendStatus(403);
    }
});
app.get("/job-sources", async (req, res) => {
    const jobSources = await JobSource.find();
    res.status(200).json(jobSources);
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
