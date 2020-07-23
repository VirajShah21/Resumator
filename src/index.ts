import express from "express";

const PORT = process.env.PORT || 3000; // NOSONAR
const app = express();

app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});
