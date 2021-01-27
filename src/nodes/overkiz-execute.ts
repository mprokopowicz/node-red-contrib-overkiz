import { NodeProperties, Red, NodeId } from "node-red";
import { Node } from "node-red-contrib-typescript-node";
import { IOverkizGateway } from "./overkiz-gateway";
import { APIObject, CommandDefinition } from "overkiz-api";

interface IExecuteNodeProperties extends NodeProperties {
  gateway: NodeId;
  device: string;
  command: string;
};

module.exports = function (RED: Red) {
  class OverkizExecute extends Node {

    private config: IExecuteNodeProperties;
    private device: APIObject;
    private commandDef: CommandDefinition;
    private numExecutingCmds: number;

    constructor(config: IExecuteNodeProperties) {
      super(RED);

      this.createNode(config);

      this.config = config;
      this.device = null;
      this.numExecutingCmds = 0;
      this.status({ fill: "grey", shape: "ring", text: "Uninitialized" });

      const node = this;

      this.on('input', async function (msg, send, done) {

        await node.initialize();
        if (!node.device || !node.commandDef) {
          if (done) {
            done("Failed to initialize device and/or command.");
            node.status({ fill: "red", shape: "dot", text: "Error" });
          }
          return;
        }

        send = send || function () { node.send.apply(node, arguments) }

        let error: string = undefined;

        let cmdParams: any[] = [];
        if (msg.payload != null) {
          if (Array.isArray(msg.payload)) {
            cmdParams = msg.payload;
          } else {
            cmdParams = [msg.payload];
          }
        }

        if (cmdParams.length < node.commandDef.nbParams) {
          error = `Received too less parameters for command "${node.commandDef.name}". Expected: ${node.commandDef.nbParams}, received: ${cmdParams.length}.`;
        }
        else {
          try {
            node.numExecutingCmds++;
            node.status({ fill: "green", shape: "dot", text: "Executing" });

            let command: any = { name: node.commandDef.name };
            if (node.commandDef.nbParams > 0) {
              command.parameters = cmdParams.slice(0, node.commandDef.nbParams);
            }
            const result = await node.device.exec(command);
            msg = { payload: result };
            if (node.numExecutingCmds === 1) {
              send(msg);
            }
          }
          catch {
            error = `Execution of command "${node.commandDef.name}" failed.`;
          }
          finally {
            node.numExecutingCmds--;
          }
        }

        if (node.numExecutingCmds === 0) {
          if (error) {
            node.status({ fill: "red", shape: "dot", text: "Error" });
          }
          else {
            node.status({ fill: "yellow", shape: "ring", text: "Idle" });
          }
        }

        if (done) {
          done(error);
        }
      });
    }

    private async initialize(): Promise<void> {
      if (this.device && this.commandDef) {
        return;
      }

      const gateway = this.getGateway();
      if (!gateway) {
        this.device = null;
        return;
      }

      this.device = await gateway.getObjectByUrl(this.config.device);
      if (this.device == null) {
        return;
      }

      this.commandDef = this.device.definition.getCommandDefinition(this.config.command);
    }

    private getGateway(): IOverkizGateway | null {
      return this.red.nodes.getNode(this.config.gateway) as IOverkizGateway;
    }
  }

  OverkizExecute.registerType(RED, "overkiz-execute");
};