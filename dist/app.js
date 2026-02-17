"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.json());
app.use('/api/email', require('./routes/email-routes'));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, 'public/index.html'));
});
app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en puerto ' + process.env.PORT);
});
