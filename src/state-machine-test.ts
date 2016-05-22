import { StateMachine } from './state-machine';

let fsm = new StateMachine({
    initial: "off",
    events: [
        { name: "toggle", from: "on", to: "off" },
        { name: "toggle", from: "off", to: "on" },
        { name: "kick", from: ["on", "off"], to: "broke" }
    ]
});

fsm.onAfter("kick", () => { console.log("oh no"); });

fsm.input("toggle");
console.log(fsm.current());
fsm.input("toggle");
console.log(fsm.current());
fsm.input("toggle");
console.log(fsm.current());
fsm.input("kick");
console.log(fsm.current());

fsm.reset();
console.log(fsm.current());
fsm.input("toggle");
console.log(fsm.current());
fsm.input("toggle");
console.log(fsm.current());
fsm.input("kick");
console.log(fsm.current());
