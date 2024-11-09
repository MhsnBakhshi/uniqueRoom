const { initConnection, getNameSpaceRoomsData } = require("./namespaces");
const { initPvConnection, sendPvs } = require("./pv");
module.exports = (io) => {
  initConnection(io);
  getNameSpaceRoomsData(io);
  initPvConnection(io);
  sendPvs(io);
};
