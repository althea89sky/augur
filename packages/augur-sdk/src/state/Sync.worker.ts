import * as Sync from "./Sync";
import { Subscriptions } from "../subscriptions";
import { augurEmitter } from "../events";

// this to be as typesafe as possible with self and addEventListener + postMessage
const ctx: Worker = self as any;
const subscriptions = new Subscriptions(augurEmitter);

ctx.addEventListener("message", (message: any) => {
  if (message.data.subscribe) {
    const subscription: string = subscriptions.subscribe(message.data.subscribe, (data: {}): void => {
      ctx.postMessage(data);
    });

    ctx.postMessage({ subscribed: message.data.subscribe, subscription });

  } else {
    subscriptions.unsubscribe(message.data.unsubscribe);
  }
});

// send everything to the browser so it can deal with it
// console.log = (msg: string) => {
//   ctx.postMessage(msg);
// };

// the main reason for the worker, to sync in another thread
Sync.start({});

// to stop typescript from complaining
export default null as any;
