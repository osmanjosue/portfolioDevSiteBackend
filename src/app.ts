import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import emailRoutes from './routes/email-routes';

const app = express();

// --- 1. CONFIGURACIÓN DE PROXY (Necesario para Nginx) ---
// Permite que Express confíe en el encabezado X-Forwarded-For de Nginx
app.set('trust proxy', 1);

// --- 2. SEGURIDAD: CORS Y WHITELIST ---
const whiteList = [
    'https://www.osmanherrera.dev',
    'https://osmanherrera.dev',
    'http://www.osmanherrera.dev', // Temporal hasta activar SSL
    'http://osmanherrera.dev',     // Temporal hasta activar SSL
    'http://localhost:5173',       // React Dev
    'http://localhost:4200',       // Angular Dev
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
};

// --- 3. LIMITADOR DE PETICIONES (Protección contra Spam) ---
const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // Máximo 3 correos por hora por IP
    message: { ok: false, msg: 'Límite de envíos excedido. Intenta de nuevo más tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
    // Handler para ver los bloqueos en PM2 sin perder tu mensaje
    handler: (req, res, next, options) => {
        console.warn(`[RATE LIMIT] IP bloqueada: ${req.ip}`);
        res.status(options.statusCode).json(options.message);
    }
});

// --- 4. MIDDLEWARES GLOBALES ---
app.use(cors(corsOptions));
app.use(express.json()); // Vital que esté antes de las rutas
app.use(express.static(path.join(__dirname, 'public')));

// --- 5. RUTAS DE LA API ---
// Middleware de validación de origen manual para mayor seguridad
app.use('/api/email', emailLimiter, (req: Request, res: Response, next: NextFunction) => {
    const origin = req.get('origin');
    
    if (!origin || !whiteList.includes(origin)) {
        return res.status(403).json({
            ok: false,
            msg: 'Acceso denegado: Petición no autorizada.'
        });
    }
    next();
}, emailRoutes);

// --- 6. MANEJO DE SPA (Angular/React) ---
// Cualquier ruta que no sea de la API, sirve el index.html
app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- 7. MANEJADOR DE ERRORES GLOBAL ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // Log visible en PM2
    console.error(`[LOG ERROR] ${req.method} ${req.url}: ${err.message}`);

    const status = err.message === 'No permitido por CORS' ? 403 : 500;
    res.status(status).json({
        ok: false,
        msg: 'Solicitud no permitida o error interno del servidor.'
    });
});

// --- 8. INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor TypeScript en puerto ${PORT}`);
    console.log(`🔒 Confianza en Proxy: Activa`);
    console.log(`📧 Límite de correos: 3 por hora`);
});

export default app;