import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import emailRoutes from './routes/email-routes';

const app = express();

// 1. Dominios permitidos
const whiteList = [
    'https://www.osmanherrera.dev', 
    'https://osmanherrera.dev',
    'http://localhost:5173', // Añadimos local para que tu React pueda hablar con tu Node en desarrollo
    'http://localhost:4200', // Añadimos local para que tu Angular pueda hablar con tu Node en desarrollo
];

// --- 2. LIMITADOR DE PETICIONES (Protección contra Spam) ---
const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // Máximo 5 correos por hora por IP
    message: { ok: false, msg: 'Límite de envíos excedido. Intenta de nuevo mas tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// 3. Configuración de CORS con Tipado
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

// 4. Middleware de Protección para la API de Email
// Bloquea herramientas como Postman en la ruta crítica
app.use('/api/email', emailLimiter, (req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('origin');
    
    // Si no hay origin o no está en la lista (Postman entra aquí)
    if (!origin || !whiteList.includes(origin)) {
        return res.status(403).json({
            ok: false,
            msg: 'Acceso denegado: Petición no autorizada.'
        });
    }
    next();
}, emailRoutes); // Rutas que importamos arriba

// 5. Middlewares de Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 6. Manejo de SPA
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- 6. MANEJADOR DE ERRORES GLOBAL (Blindaje de información) ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Para ti: Se ve el error real en la consola de PM2
    console.error(`[LOG] Error en ${req.method} ${req.url}: ${err.message}`);

    // Para el mundo: Mensaje aburrido y sin rutas de carpetas
    const status = err.message === 'No permitido por CORS' ? 403 : 500;
    res.status(status).json({
        ok: false,
        msg: 'Solicitud no permitida o error interno.'
    });
});

// 7. Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor TypeScript corriendo en el puerto ${PORT}`);
    console.log(`🔒 Protección de API activa para: ${whiteList.filter(d => !d.includes('localhost')).join(', ')}`);
});

export default app;
