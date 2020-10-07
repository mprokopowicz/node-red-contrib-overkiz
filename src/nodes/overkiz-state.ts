import { NodeProperties, Red, NodeId } from "node-red";
import { Node } from "node-red-contrib-typescript-node";
import { IOverkizGateway } from "./overkiz-gateway";
import { APIObject } from "overkiz-api";

interface IStateNodeProperties extends NodeProperties {
  gateway: NodeId;
  device: string;
  allStates: boolean;
  state: string;
};

module.exports = function (RED: Red) {
  class OverkizState extends Node {
    private config: IStateNodeProperties;
    private device: APIObject;

    constructor(config: IStateNodeProperties) {
      super(RED);

      this.createNode(config);

      this.config = config;
      this.device = null;

      const node = this;

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
          const states = await node.device.refreshStates();
          if (states) {
            msg.payload = states;
            send(msg);
          } else {
            error = "Failed to fetch all states.";
          }
        }
        else {
          const state = await node.device.refreshState(node.config.state);
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

      const gateway = this.getGateway();
      if (!gateway) {
        this.device = null;
        return;
      }

      this.device = await gateway.getObjectByUrl(this.config.device);
    }

    private getGateway(): IOverkizGateway | null {
      return this.red.nodes.getNode(this.config.gateway) as IOverkizGateway;
    }
  }

  OverkizState.registerType(RED, "overkiz-state");
};