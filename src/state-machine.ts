interface StateMachineConfig<StateEnum, EventEnum> {
    initial?: StateEnum,
    events: [{
        name: EventEnum,
        from: StateEnum | StateEnum[],
        to: StateEnum
    }],
    debug?: boolean;
}

class StateMachine<StateEnum, EventEnum> {
    private inital: StateEnum;

    private state: StateEnum;

    private asyncing: boolean;

    private stateMap: { [from: string]: { [event: string]: StateEnum } } = {};

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

    constructor(cfg: StateMachineConfig<StateEnum, EventEnum>) {
        this.debug = cfg.debug || false;
        this.inital = cfg.initial;
        this.state = cfg.initial;

        for (let i = 0; i < cfg.events.length; i += 1) {
            // to statisfy type infer, actualy this should be StateEnum[]
            let froms: any = (cfg.events[i].from instanceof Array) ?
                cfg.events[i].from : [cfg.events[i].from];

            for (let j = 0; j < froms.length; j += 1) {
                this.stateMap['' + froms[j]] = this.stateMap['' + froms[j]] || {};
                this.stateMap['' + froms[j]]['' + cfg.events[i].name] = cfg.events[i].to;
            }
        }
    }

    input(event: EventEnum): string {
        let func: Function;
        if (this.debug) { console.log('Event: ', event, 'Before: ', this.state); }

        if (func = this.eventCb.before['' + event]) { func(); }
        if (this.stateMap['' + this.state]['' + event] === undefined) {
            this.error(this.state, event);
            return "failed";
        }

        let prevState = this.state;

        this.state = this.stateMap['' + prevState]['' + event];

        if (func = this.stateCb.enter['' + this.state]) { func(); }
        if (func = this.stateCb.leave['' + prevState]) { func(); }
        if (func = this.eventCb.after['' + event]) { func(); }

        if (this.debug) { console.log('Event: ', event, 'After: ', this.state); }
        return "success";
    }

    is(state: StateEnum) { return state == this.state; }

    current() { return this.state; }

    reset() { this.state = this.inital; }

    onBefore(event: EventEnum, cb: Function) { this.eventCb.before['' + event] = cb; }

    onAfter(event: EventEnum, cb: Function) { this.eventCb.after['' + event] = cb; }

    onEnter(state: EventEnum, cb: Function) { this.stateCb.enter['' + state] = cb; }

    onLeave(state: EventEnum, cb: Function) { this.stateCb.leave['' + state] = cb; }

    onError(cb: Function) { this.errorCb = cb; }

    error(from: StateEnum, event: EventEnum, to?: StateEnum) {
        let func: Function;
        if (func = this.errorCb) { func(from, event); }
        console.log("error when transition from ", from, " ", event);
    }
}

export { StateMachine };
