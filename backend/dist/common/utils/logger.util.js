"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = logError;
function logError(...args) {
    try {
        console.error(JSON.stringify({
            time: new Date().toISOString(),
            message: "Expected error",
            metadata: args,
        }));
    }
    catch (e) { }
}
//# sourceMappingURL=logger.util.js.map