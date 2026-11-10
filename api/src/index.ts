import express from 'express';
import { DEFAULT_PATCH } from '@synthu/shared';
const app = express();

const port = Number(process.env.PORT || '3000');
app.get('/health', (_req, res): void =>{
    res.json({
        "ok": true,
        "patch": DEFAULT_PATCH,
    })
}
)


app.listen(port, () =>{
    console.log(`Server is running on ${port}`)
}); 