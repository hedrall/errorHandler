declare const __EFFECT_TYPE__: unique symbol;

class Error1 extends Error { name: 'error1' = 'error1'; e1 = '@@@ Error 1 @@@' }
class Error2 extends Error { name: 'error2' = 'error2'; e2 = '@@@ Error 2 @@@' }
class Error3 extends Error { name: 'error3' = 'error3'; e3 = '@@@ Error 3 @@@' }
class Error4 extends Error { name: 'error4' = 'error4'; e4 = '@@@ Error 4 @@@' }
class Error5 extends Error { name: 'error5' = 'error5'; e5 = '@@@ Error 5 @@@' }
class Error6 extends Error { name: 'error6' = 'error6'; e6 = '@@@ Error 6 @@@' }
type ErrorType = Error1 | Error2 | Error3 | Error4 | Error5 | Error6;

// 型変数Eに対して一意な何か
type E<E extends ErrorType> = { [__EFFECT_TYPE__]?: E };
type WithThrow<V, _T extends ErrorType> = E<_T> & V;

const toThrow1 = (): WithThrow<void, Error1> => {
    console.log('>>> exec to throw 1')
}
const toThrow2 = (): WithThrow<{ hoge: 'fuga' }, Error2> => {
    // throw new Error2();
    console.log('>>> exec to throw 2');
    return { hoge: 'fuga' };
}
const toThrow3 = async (): Promise<WithThrow<number, Error3>> => {
    // throw new Error3();
    console.log('>>> exec to throw 3')
    return 100;
}
const toThrow45 = (): WithThrow<string, Error4 | Error5> => {
    switch (true) {
        case 1 + 1 === 3:
            throw new Error4('謎の世界 4');
        case 1 + 1 === 2:
            return '正しい世界線';
        default:
            throw new Error5('謎の世界 5');
    }
}

type AnyGenerator<T> = AsyncGenerator<T> | Generator<T>;

async function * main() {
    yield toThrow1();
    yield toThrow2();
    yield await toThrow3();

    yield toThrow45();
}

type ExcludeErrorType<T> =
    T extends Awaited<E<infer U>> ?
        T extends Awaited<E<U> & infer V> ? V : never
        : never;
type IteratorResults<F extends AnyGenerator<any>> = F extends AnyGenerator<infer T> ? T : never;
type MainReturn = ReturnType<typeof main>;
type ExtractErrorType<T> = T extends Awaited<E<infer U>> ? Awaited<U> : never;

type GetResults<F extends AnyGenerator<any>> = ExcludeErrorType<IteratorResults<F>>;
export type MainValues = GetResults<MainReturn>;
type GetErrors<F extends AnyGenerator<any>> = ExtractErrorType<IteratorResults<F>>;
export type MainErrors = GetErrors<MainReturn>;

const sequence = async <F extends AsyncGenerator<any>>(main: () => F): Promise<GetResults<F>> => {
    const results: GetResults<F> = [];
    const asyncGenerator = main();
    for await (const _ of asyncGenerator) results.push(_);
    return results;
}

const exec = async <F extends AsyncGenerator<any>>(main: () => F, errorHandler: (e: GetErrors<F>) => never): Promise<GetResults<F>> => {
    try {
        return await sequence(main);
    } catch (e: unknown) {
        errorHandler(e as GetErrors<F>);
        throw new Error('実行されないはず')
    }
}

type NeverCheck<E extends never> = never;
(async () => {
    const res = await exec(main, e => {
        if (e instanceof Error1) throw new Error(e.e1);
        if (e instanceof Error2) throw new Error(e.e2);
        if (e instanceof Error3) throw new Error(e.e3);
        if (e instanceof Error4) throw new Error(e.e4);
        if (e instanceof Error5) throw  new Error(e.e5);
        type _ = NeverCheck<typeof e>;
        throw new Error(''); // <- neverにより必須
    });
    // handle res
    console.log('res: ', res);
})().catch(console.error);

// 番外編
async function main2() {
    const res1 = toThrow1();
    const res2 = toThrow2();
    const res3 = await toThrow3();
    const res45 = toThrow45();

    return [res1, res2, res3, res45];
}

type ArrayToUnion<T extends any[]> = T[number];
type Main2ReturnUnion = ArrayToUnion<Awaited<ReturnType<typeof main2>>>;
type GetErrors2<R extends WithThrow<any, any>> = R extends E<infer _E> ? _E : never;
type Main2Error = GetErrors2<Main2ReturnUnion>;
