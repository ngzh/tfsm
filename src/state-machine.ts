interface StateMachineConfig {
    initial?: string,
    events: [{
        name: string,
        from: string | string[],
        to: string
    }],
    debug?: boolean;
}

class StateMachine {
    private inital: string;

    private state: string;

    private asyncing: boolean;

    private stateMap: { [from: string]: { [event: string]: string } } = {};

    private eventCb: {
        before: { [event: string]: Function },
        after: { [event: string]: Function }
    } = { before: {}, after: {} };

    private stateCb: {
        enter: { [event: string]: Function },
        leave: { [event: string]: Function }
    } = { enter: {}, leave: {} };

    private errorCb: Function;
    private debug: boolean;

    constructor(cfg: StateMachineConfig) {
        this.debug = cfg.debug || false;
        this.inital = cfg.initial || 'none';
        this.state = cfg.initial;

        for (let i = 0; i < cfg.events.length; i += 1) {
            // to statisfy type infer, actualy this should be string[]
            let froms: any = (cfg.events[i].from instanceof Array) ?
                cfg.events[i].from : [cfg.events[i].from];

            for (let j = 0; j < froms.length; j += 1) {
                this.stateMap[froms[j]] = this.stateMap[froms[j]] || {};

                this.stateMap[froms[j]][cfg.events[i].name] =
                    cfg.events[i].to;
            }
        }
    }

    input(event: string): string {
        let func: Function;
        if (this.debug) { console.log('Event: ', event, 'Before: ', this.state); }

        if (func = this.eventCb.before[event]) { func(); }

        if (this.stateMap[this.state][event] === undefined) {
            this.error(this.state, event);
            return "failed";
        }

        let prevState = this.state;

        this.state = this.stateMap[prevState][event];

        if (func = this.stateCb.enter[this.state]) { func(); }
        if (func = this.stateCb.leave[prevState]) { func(); }
        if (func = this.eventCb.after[event]) { func(); }

        if (this.debug) { console.log('Event: ', event, 'After: ', this.state); }
        return "success";
    }

    is(state: string): boolean {
        return state == this.state;
    }

    current(): string {
        return this.state;
    }

    reset() {
        this.state = this.inital;
    }

    onBefore(event: string, cb: Function) { this.eventCb.before[event] = cb; }

    onAfter(event: string, cb: Function) { this.eventCb.after[event] = cb; }

    onEnter(state: string, cb: Function) { this.stateCb.enter[state] = cb; }

    onLeave(state: string, cb: Function) { this.stateCb.leave[state] = cb; }

    onError(cb: Function) { this.errorCb = cb; }

    error(from: string, event: string, to?: string) {
        let func: Function;
        if (func = this.errorCb) { func(from, event); }
        console.log("error when transition from ", from, " ", event);
    }
}

export { StateMachine };
