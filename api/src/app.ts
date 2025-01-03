import express from "express";
import { desregister, register, run, login, signup } from "./routes";

const app = express();
app.use(express.json());

app.use("/desregister", desregister);
app.use("/register", register);
app.use("/run", run);
app.use("/login", login);
app.use("/signup", signup);

export default app;
