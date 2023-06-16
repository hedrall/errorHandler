// Type Utility
declare const __EFFECT_TYPE__: unique symbol;

const enum Operation {
    DOM,
    Console,
    Console2,
    Fetch,
    PostMessage,
    Throwable
}

type Eff<E extends Operation> = {
    readonly [__EFFECT_TYPE__]?: E;
};

type AnyGenerator<T> = AsyncGenerator<T> | Generator<T>;

// main 関数から Operation の一覧を取り出す
type GetEffect<F extends AnyGenerator<any>> =
    F extends AnyGenerator<infer T> ? T extends Awaited<Eff<infer U>> ? Awaited<U> : never : never;

function mount(): void & Eff<Operation.DOM> {
    const div = document.createElement('div');
    div.textContent = "hello";
    document.body.append(div);
}

function print(): void & Eff<Operation.Console> {
    console.log("hello");
}
function print2(): void & Eff<Operation.Console2> {
    console.log("hello2");
}

function maybeError(): void & Eff<Operation.Throwable> {
    if (Math.random() > 0.999) {
        throw new Error("error");
    }
}

async function doSend(): Promise<void & Eff<Operation.Fetch | Operation.Console>> {
    try {
        const res = await fetch("/post", {});
        const _data = await res.json();
        console.log(_data);
    } catch (err) {
        console.error(err);
    }
}

function * sub() {
    yield maybeError();
    yield maybeError();
}

async function * main() {
    yield mount();
    yield print();
    yield await doSend();

    yield * sub();
}

type FN = (...args: any) => any;
// const doFunctions = <FN1 extends FN, FN2 extends FN>(fn1:FN1, fn2: FN2): void & ReturnType<FN1> & ReturnType<FN2> => {
const doFunctions = <F extends FN[]>(...fns: F): void & (F[number] extends FN ? ReturnType<F[number]> : never) => {
    for (const fn of fns) {
        fn();
    }
}

const main2 = doFunctions(
    mount,
    print,
    print2,
)

export type MainOps2 = typeof main2;


// run
for await (const _eff of main()) {}

// この型が最終的に発生した副作用の合計を表現する
export type MainOps = GetEffect<ReturnType<typeof main>>;
