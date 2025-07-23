import express, { Application, Request, Response } from "express";
import { initDB, PORT } from "./config/constants.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoutes from "./routes/transactions.route.js"


const app: Application = express();

app.use(express.json());
app.use(rateLimiter);


app.get("/api/health", (req: Request, res: Response) => {
    res.send("Activeeee like chivita!")
})

app.use("/api/transactions", transactionsRoutes)

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
});
