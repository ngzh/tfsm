# TFSM
[![Build Status](https://travis-ci.org/zhfuzzy/tfsm.svg?branch=master)](https://travis-ci.org/zhfuzzy/tfsm)
[![NPM](https://nodei.co/npm/tfsm.png?mini=true)](https://npmjs.org/package/tfsm)

typed finite state machine for typescript

## install

```bash
$ npm install tfsm --save
```

## usage

setup a state machine

```typescript
import { StateMachine } from 'tfsm';

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
```

trigger events and check current state

```typescript
// trigger an event
fsm.input(Events.TOGGLE); // return true on success, false otherwise

// check state
fsm.is(States.ON); // => true or false

// reset state machine to initial
fsm.reset()
```

## Examples

see files in `tests/`

## Build & Run tests

```bash
# build
$ tsc
# run tests
$ ./run-tests.sh
```

## Roadmap

* Event-less style state machine(use `statemachine.go(state)` to direct transfer from state to state)
* Queries like `canGo` and `canInput`
* Async transaction
* Automatically export state transfer map
