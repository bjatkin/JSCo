let nextYieldable = 0;
function yieldable(promise){
    let id = nextYieldable++;
    promise.yieldableID = id;
    promise.yield = () => {
        promise.
        then(res => promise.res = res).
        catch(err => promise.err = err).
        finally(() => CO.run(id))
    }
    return promise;
}

function co(gen){
    let next = gen.next();

    let ret = new Promise(() => {});
    ret.gen = gen;

    if (!next.done){
        next.value.yield();
        let yid = next.value.yieldableID;
        let cid = nextCo++;
        CO.routines[cid] = ret;
        CO.yields[yid] = cid;
    }
    return yieldable(ret);
}

let nextCo = 0;
let CO = {
    routines: {},
    yields: {},
    run: (id) => {
        let cid = CO.yields[id];
        let next = CO.routines[cid].gen.next();
        if (next.done) {
            Promise.resolve(CO.routines[cid]);
            delete CO.routines[cid];
            delete CO.yields[id];
            return;
        }
        next.value.yield();
        CO.yields[next.value.yieldableID] = cid;
        delete CO.yields[id];
    }
}