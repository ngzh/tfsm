interface StateMachineConfig {
    initial?: string,
    events: [{
        name: string,
        from: string | string[],
        to: string
    }]
}

class StateMachine {
    inital: string;
    state: string;
    stateMap: { [from: string]: { [event: string]: string } };

    constructor(cfg: StateMachineConfig) {
        this.inital = cfg.initial || 'none';
        this.state = cfg.initial;

        this.stateMap = {};

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

    input(event: string) {
        this.state = this.stateMap[this.state][event];
    }

    current(): string {
        return this.state;
    }

    reset() {
        this.state = this.inital;
    }

    onBefore(event: string) {

    }

    onAfter(event: string) {

    }

    onEnter(state: string) {

    }

    onLeave(state: string) {

    }
}

export { StateMachine };
