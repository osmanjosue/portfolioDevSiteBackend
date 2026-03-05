"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const email_routes_1 = __importDefault(require("./routes/email-routes"));
const app = (0, express_1.default)();
// 1. Dominios permitidos
const whiteList = [
    'https://www.osmanherrera.dev',
    'https://osmanherrera.dev',
];
// --- 2. LIMITADOR DE PETICIONES (Protección contra Spam) ---
const emailLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // Máximo 5 correos por hora por IP
    message: { ok: false, msg: 'Límite de envíos excedido. Intenta de nuevo mas tarde.' },
    standardHeaders: true,
    legacyHeaders: false,
});
// 3. Configuración de CORS con Tipado
const corsOptions = {
    origin: (origin, callback) => {
        // Permitimos si está en la lista o si no hay origin (navegación directa)
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
// 4. Middleware de Protección para la API de Email
// Bloquea herramientas como Postman en la ruta crítica
app.use('/api/email', emailLimiter, (req, res, next) => {
    const origin = req.get('origin');
    // Si no hay origin o no está en la lista (Postman entra aquí)
    if (!origin || !whiteList.includes(origin)) {
        return res.status(403).json({
            ok: false,
            msg: 'Acceso denegado: Petición no autorizada.'
        });
    }
    next();
}, email_routes_1.default); // Rutas que importamos arriba
// 5. Middlewares de Express
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
// 6. Manejo de SPA
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// --- 6. MANEJADOR DE ERRORES GLOBAL (Blindaje de información) ---
app.use((err, req, res, next) => {
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
exports.default = app;
