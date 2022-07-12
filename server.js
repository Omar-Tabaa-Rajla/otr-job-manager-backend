import express from "express";

const app = express();
const port = process.env.PORT || 3044;

app.get("/", (req, res) => {
    res.send("<h1>Book Site API</h1>");
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
