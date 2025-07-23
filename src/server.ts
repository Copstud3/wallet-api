import express, { Application, Request, Response } from "express";
import { initDB, PORT } from "./config/constants.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoutes from "./routes/transactions.route.js"
import job from "../src/config/cron.js"

const app: Application = express();

if(process.env.NODE_ENV === "production") job.start();

app.use(express.json());
app.use(rateLimiter);


app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({status: "ok"})
})

app.use("/api/transactions", transactionsRoutes)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
