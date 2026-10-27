import express from 'express';
const app = express();

const port = Number(process.env.PORT || '3000');
app.get('/health', (_req, res): void =>{
    res.json({
        "ok": true
    })
}
)


app.listen(port, () =>{
    console.log(`Server is running on ${port}`)
});