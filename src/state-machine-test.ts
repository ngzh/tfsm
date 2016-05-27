import { StateMachine } from './state-machine';

(() => {
    let fsm = new StateMachine({
        initial: "off",
        events: [
            { name: "toggle", from: "on", to: "off" },
            { name: "toggle", from: "off", to: "on" },
            { name: "kick", from: ["on", "off"], to: "broke" }
        ]
    });

    let kicked = false;
    fsm.onAfter("kick", () => { kicked = true; });

    fsm.input("toggle");
    console.assert(fsm.is("on"));
    fsm.input("toggle");
    console.assert(fsm.is("off"));
    fsm.input("toggle");
    console.assert(fsm.is("on"));
    fsm.input("kick");
    console.assert(kicked === true);
    kicked = false;

    fsm.reset()
    fsm.input("toggle");
    console.assert(fsm.is("on"));
    fsm.input("toggle");
    console.assert(fsm.is("off"));
    fsm.input("kick");
    console.assert(kicked === true);
})();
