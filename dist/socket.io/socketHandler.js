"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const namespaces_1 = require("./namespaces");
exports.default = (io) => {
    (0, namespaces_1.initConnection)(io);
    (0, namespaces_1.getNamespaceRooms)(io);
};
