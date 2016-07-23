import { StateMachine } from './state-machine';


enum States {
    ON,
    OFF,
    BROKE
}

enum Events {
    TOGGLE,
    KICK
}

let fsm = new StateMachine<States, Events>({
    initial: States.OFF,
    events: [
        { name: Events.TOGGLE, from: States.ON, to: States.OFF },
        { name: Events.TOGGLE, from: States.OFF, to: States.ON },
        { name: Events.KICK, from: [States.OFF, States.ON], to: States.BROKE }
    ]
});

let kicked = false;
fsm.onAfter(Events.KICK, () => { kicked = true; });

fsm.input(Events.TOGGLE);
console.assert(fsm.is(States.ON));
fsm.input(Events.TOGGLE);
console.assert(fsm.is(States.OFF));
fsm.input(Events.TOGGLE);
console.assert(fsm.is(States.ON));
fsm.input(Events.KICK);
console.assert(kicked === true);
kicked = false;

fsm.reset()
fsm.input(Events.TOGGLE);
console.assert(fsm.is(States.ON));
fsm.input(Events.TOGGLE);
console.assert(fsm.is(States.OFF));
fsm.input(Events.KICK);
console.assert(kicked === true);

console.log("all tests passed")
