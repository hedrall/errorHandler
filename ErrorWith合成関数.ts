// Type Utility
import {number} from "fp-ts";

declare const __EFFECT_TYPE__: unique symbol;

class Error1 extends Error { name: 'error1' = 'error1'; e1 = '@@@ Error 1 @@@' }
class Error2 extends Error { name: 'error2' = 'error2'; e2 = '@@@ Error 2 @@@' }
class Error3 extends Error { name: 'error3' = 'error3'; e3 = '@@@ Error 3 @@@' }
class Error4 extends Error { name: 'error4' = 'error4'; e4 = '@@@ Error 4 @@@' }
class Error5 extends Error { name: 'error5' = 'error5'; e5 = '@@@ Error 5 @@@' }
type ErrorType = Error1 | Error2 | Error3 | Error4 | Error5;

// 幽霊型
// https://js.excelspeedup.com/phantomtype
type E<E extends ErrorType> = { [__EFFECT_TYPE__]?: E };
type WithThrow<T extends ErrorType, V> = E<T> & V;

const toThrow1 = (): WithThrow<Error1, void> => {
    console.log('>>> exec to throw 1')
}
const toThrow2 = (): WithThrow<Error2, string> => {
    console.log('>>> exec to throw 2');
    return 'test';
}
const toThrow3 = async (): Promise<WithThrow<Error3, number>> => {
    console.log('>>> exec to throw 3')
    return 100;
}
const toThrow4 = (): WithThrow<Error4, { hoge: 'fuga' }> => {
    console.log('>>> exec to throw 4');
    return { hoge: 'fuga' };
}

type FN = (...args: any) => any | Promise<any>;
type FunctionReturns<F extends FN[]> = F[number] extends FN ? Awaited<ReturnType<F[number]>> : never;
const sequence = async <F extends FN[]>(...fns: F): Promise<(FunctionReturns<F>[])> => {
    const results: FunctionReturns<F>[] = [];
    for (const fn of fns) {
        const res = fn();
        if (res instanceof Promise) {
            await res;
            results.push(await res);
            continue;
        }
        results.push(res);
    }
    return results;
}
const main = async () => await sequence(
    toThrow1,
    toThrow2,
    () => console.log('test'),
    toThrow3,
    toThrow4,
);

type _ = typeof main;
type MainFn = (...args: any) => Promise<any[]>;
type AsyncFnReturns<T extends MainFn> = Awaited<ReturnType<T>>[number];

type GetResults<F extends MainFn, RT = AsyncFnReturns<F>> = RT extends (E<infer ET>) ? RT extends (E<ET> & infer U)? U: never: never;
type MainResults = GetResults<typeof main>;
type GetThrowableErrors<F extends MainFn, RT = AsyncFnReturns<F>> = RT extends E<infer U> ? U : never;
type MainErrors = GetThrowableErrors<typeof main>;

const exec = <F extends FN>(main: F, errorHandler: (e: GetThrowableErrors<F>) => never): GetResults<F> => {
    try {
        return main();
    } catch (e: unknown) {
        errorHandler(e as GetThrowableErrors<typeof main>);

        console.log(e);
        throw new Error('ハンドリングされていないエラー');
    }
}
(async () => {
    const res = await exec(main, e => {
        if (e instanceof Error1) throw new Error(e.e1);
        if (e instanceof Error2) throw new Error(e.e2);
        if (e instanceof Error3) throw new Error(e.e3);
        if (e instanceof Error4) throw new Error(e.e4);
        throw new Error(''); // <- neverにより必須
    });
    // handle res
    console.log('res: ', res);
})().catch(console.error);

