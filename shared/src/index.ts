export type Test = {
    message: string
}

export const firstTest: Test = {
    message: "This is a test"
}

export function funcTest(name: string): Test{
    return {message: `${name}, this is a test`
};
}