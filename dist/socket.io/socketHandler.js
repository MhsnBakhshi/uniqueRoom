"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const namespaces_1 = require("./namespaces");
const pv_1 = require("./pv");
exports.default = (io) => {
    (0, namespaces_1.initConnection)(io);
    (0, pv_1.sendPvsDetails)(io);
    (0, namespaces_1.getNamespaceRooms)(io);
};
