
import { Action } from "../abstracts/Action.js";
import { Peer } from "../structures/Peer.js";
import { BaseServer } from "../structures/BaseServer.js";
import type { ActionType } from "../types";
import { DialogBuilder } from "../utils/builders/DialogBuilder.js";
import { Variant } from "growtopia.js";

export default class extends Action {
  constructor(base: BaseServer) {
    super(base);
    this.config = {
      eventName: "drop"
    };
  }

  public handle(peer: Peer, action: ActionType<{ action: string; itemID: string }>): void {
    const itemID = parseInt(action.itemID);
    
    // Protect fist and wrench added by renomansss 
    if (itemID === 18 || itemID === 32) {
      peer.send(Variant.from("OnConsoleMessage", "This item cannot be dropped."));
      return;
    }
    
    const item = this.base.items.metadata.items.find((v) => v.id === itemID);

    const peerItem = peer.data?.inventory?.items.find((v) => v.id === itemID);
    const dialog = new DialogBuilder()
      .defaultColor()
      .addLabelWithIcon(`Drop ${item?.name?.value}`, item?.id || 0, "big")
      .addTextBox("How many to drop?")
      .addInputBox("drop_count", "", peerItem?.amount, 5)
      .embed("itemID", itemID)
      .endDialog("drop_end", "Cancel", "OK")
      .str();
    peer.send(Variant.from("OnDialogRequest", dialog));
  }
}
