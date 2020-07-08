import { NodeProperties, Red } from "node-red";
import { Node } from "node-red-contrib-typescript-node";

module.exports = function (RED: Red) {
  class OverkizRead extends Node {
    constructor(config: NodeProperties) {
      super(RED);

      this.createNode(config);
    }
  }

  OverkizRead.registerType(RED, "overkiz-read");
};