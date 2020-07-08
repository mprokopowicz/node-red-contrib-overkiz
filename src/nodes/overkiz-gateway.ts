import { NodeProperties, Red } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

module.exports = function (RED: Red) {
  class OverkizGateway extends Node {
    constructor(config: NodeProperties) {
      super(RED);

      this.createNode(config);
    }
  }

  OverkizGateway.registerType(RED, "overkiz-gateway", {
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    }
  });
};