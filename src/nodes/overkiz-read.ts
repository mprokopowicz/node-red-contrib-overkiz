import { NodeProperties, Red, NodeId } from "node-red";
import { Node } from "node-red-contrib-typescript-node";
import { IOverkizGateway } from "./overkiz-gateway";
import { APIDevice } from "overkiz-api";
import { stat } from "fs";

interface IReadNodeProperties extends NodeProperties {
  gateway: NodeId;
  device: string;
  allStates: boolean;
  state: string;
};

module.exports = function (RED: Red) {
  class OverkizRead extends Node {
    private config: IReadNodeProperties;
    private device: APIDevice;

    constructor(config: IReadNodeProperties) {
      super(RED);

      this.createNode(config);

      this.config = config;
      this.device = null;

      let node = this;

      this.on('input', async function (msg, send, done) {

        await node.initialize();
        if (!node.device) {
          if (done) {
            done("Failed to initialize device.");
          }
          return;
        }

        send = send || function () { node.send.apply(node, arguments) }

        let error: string = undefined;

        if (node.config.allStates) {
          let states = await node.device.refreshStates();
          if (states) {
            msg.payload = states;
            send(msg);
          } else {
            error = "Failed to fetch all states.";
          }
        }
        else {
          let state = await node.device.refreshState(node.config.state);
          if (state) {
            msg.payload = state;
            send(msg);
          } else {
            error = `Failed to fetch state: "${node.config.state}".`;
          }
        }

        if (done) {
          done(error);
        }
      });
    }

    private async initialize(): Promise<void> {
      if (this.device) {
        return;
      }

      let gateway = this.getGateway();
      if (!gateway) {
        this.device = null;
        return;
      }

      this.device = await gateway.getDeviceByUrl(this.config.device);
    }

    private getGateway(): IOverkizGateway | null {
      return this.red.nodes.getNode(this.config.gateway) as IOverkizGateway;
    }
  }

  OverkizRead.registerType(RED, "overkiz-read");
};