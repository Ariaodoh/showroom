
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import  userRouter  from './api/routes/users.js'
import feedRouter from './api/routes/feed.js'
import pinRouter from "./api/routes/pin.js";
import collectionRouter from './api/routes/collections.js'

config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use('/api/user', userRouter);
app.use('/api/feed', feedRouter);
app.use('/api/pin', pinRouter);
app.use('/api/collection', collectionRouter);

app.get('/', (req, res) => {
    res.status(200).send('API OK');
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

module.exports = app;

