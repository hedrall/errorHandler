import { Result, Err, Ok, ResultAsync, ok, err, fromPromise, fromThrowable } from 'neverthrow'

class Error1 extends Error { name: 'error1' = 'error1'; e1 = '@@@ Error 1 @@@' }
class Error2 extends Error { name: 'error2' = 'error2'; e2 = '@@@ Error 2 @@@' }
class Error3 extends Error { name: 'error3' = 'error3'; e3 = '@@@ Error 3 @@@' }
class Error4 extends Error { name: 'error4' = 'error4'; e4 = '@@@ Error 4 @@@' }
class Error5 extends Error { name: 'error5' = 'error5'; e5 = '@@@ Error 5 @@@' }
class Error6 extends Error { name: 'error6' = 'error6'; e6 = '@@@ Error 6 @@@' }
type ErrorType = Error1 | Error2 | Error3 | Error4 | Error5 | Error6;

const _1: Err<never, Error1> | Ok<string, never> = {} as any as Result<string, Error1>;
const _2: Result<string, Error1> = {} as any as Err<never, Error1> | Ok<string, never>;

const bool = false;
const toThrow1 = (): Result<number, Error1> => {
    return bool ? err(new Error1('throw 1')) : ok(1);
}
const toThrow2 = fromThrowable(() => ({ hoge: 'test' } as const), e => new Error2('2'));

declare const fetchUserName: () => Promise<string>;
const toThrow3 = async (): Promise<Result<string, Error3>> => {
    try {
        const res = await fetchUserName();
        return ok(res);
    } catch (e: unknown) {
        return err(new Error3(''));
    }
}
const toThrow45 = (): Result<string, Error4 | Error5> => {
    switch (true) {
        case 1 + 1 === 3:
            return err(new Error4('謎の世界 4'));
        case 1 + 1 === 2:
            return ok('正しい世界線');
        default:
            return err(new Error5('謎の世界5'));
    }
}

type Res = Result<[number, { hoge: 'test' }, string, string], Error1 | Error2 | Error3 | Error4 | Error5>;
const main = async (): Promise<Res> => {
    const res1 = toThrow1();
    if (res1.isErr()) throw new Error(res1.error.e1);
    const res2 = toThrow2();
    if (res2.isErr()) throw new Error(res2.error.e2);
    const res3 = await toThrow3();
    if (res3.isErr()) throw new Error(res3.error.e3);
    const res45 = toThrow45();
    if (res45.isErr()) {
        const error45 = res45.error;
        if (error45 instanceof Error4) throw new Error(error45.e4);
        if (error45 instanceof Error5) throw new Error(error45.e5);
        throw new Error('unknown case');
    }
    return ok([
        res1.value,
        res2.value,
        res3.value,
        res45.value,
    ]);
}


