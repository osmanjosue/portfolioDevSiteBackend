import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';

const app = express();

// 1. Dominios permitidos
const whiteList = [
    'https://www.osmanherrera.dev', 
    'https://osmanherrera.dev',
    'http://localhost:5173', // Añadimos local para que tu React pueda hablar con tu Node en desarrollo
    'http://localhost:4200', // Añadimos local para que tu Angular pueda hablar con tu Node en desarrollo
];

// 2. Configuración de CORS con Tipado
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        // Permitimos si está en la lista o si no hay origin (navegación directa)
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 3. Middleware de Protección para la API de Email
// Bloquea herramientas como Postman en la ruta crítica
app.use('/api/email', (req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('origin');
    
    // Si no hay origin o no está en la lista (Postman entra aquí)
    if (!origin || !whiteList.includes(origin)) {
        return res.status(403).json({
            ok: false,
            msg: 'Acceso denegado: Petición no autorizada.'
        });
    }
    next();
});

// 4. Middlewares de Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 5. Importación de Rutas (Asumiendo que tus rutas están en JS o compiladas)
app.use('/api/email', require('./routes/email-routes'));

// 6. Manejo de SPA
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor TypeScript corriendo en el puerto ${PORT}`);
    console.log(`🔒 Protección de API activa para: ${whiteList.filter(d => !d.includes('localhost')).join(', ')}`);
});

export default app;
