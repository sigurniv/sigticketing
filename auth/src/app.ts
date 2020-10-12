import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from "./routes/current-user";
import { signInUserRouter } from "./routes/signin";
import { signUpUserRouter } from "./routes/signup";
import { signOutUserRouter } from "./routes/signout";
import { errorHandler, NotFoundError } from "@sigticketing/common";
import cookieSession from "cookie-session";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUserRouter);
app.use(signInUserRouter);
app.use(signUpUserRouter);
app.use(signOutUserRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError()
})

app.use(errorHandler);

export { app }