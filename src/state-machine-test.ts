import { StateMachine } from './state-machine';

let sm = new StateMachine({
    initial: "off",
    events: [
        { name: "toggle", from: "on", to: "off" },
        { name: "toggle", from: "off", to: "on" },
        { name: "kick", from: ["on", "off"], to: "broke" }
    ]
});

sm.input("toggle");
console.log(sm.current());
sm.input("toggle");
console.log(sm.current());
sm.input("toggle");
console.log(sm.current());
sm.input("kick");
console.log(sm.current());

sm.reset();
console.log(sm.current());
sm.input("toggle");
console.log(sm.current());
sm.input("toggle");
console.log(sm.current());
sm.input("kick");
console.log(sm.current());
