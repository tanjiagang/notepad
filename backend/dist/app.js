"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const users_1 = __importDefault(require("./routes/users"));
const notes_1 = __importDefault(require("./routes/notes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, database_1.default)();
// 中间件配置
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 路由配置
app.use('/api/users', users_1.default);
app.use('/api/notes', notes_1.default);
// 健康检查路由
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: '服务运行正常' });
});
// 404 处理
app.use((req, res) => {
    res.status(404).json({ status: 'error', message: '接口不存在' });
});
// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || '服务器内部错误'
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map