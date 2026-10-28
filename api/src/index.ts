import express from 'express';
import { firstTest, funcTest } from '@synthu/shared';
const app = express();

const port = Number(process.env.PORT || '3000');
app.get('/health', (_req, res): void =>{
    res.json({
        "ok": true,
        "second": funcTest("Moe"),
        "third": firstTest
    })
}
)


app.listen(port, () =>{
    console.log(`Server is running on ${port}`)
}); 