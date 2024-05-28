
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path'

const app = express();
app.use(cors());

app.use(express.static('public'));

app.use(express.json());

app.use('/api/email', require('./routes/email-routes'));

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT)
})
