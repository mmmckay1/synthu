import { expect, test } from "vitest";
import { DEFAULT_PATCH, PatchSchema } from "./patch.js";

test("the default_patch passes", () => {
    const result = PatchSchema.safeParse(DEFAULT_PATCH);
    expect(result.success).toBe(true);
});

test("reject attack below 1ms", () => {
    const badPatch = { ...DEFAULT_PATCH, ampAttack: 0};
    const result = PatchSchema.safeParse(badPatch);
    expect(result.success).toBe(false);
});

test("reject typo", () =>{
    const typoPatch = {...DEFAULT_PATCH, filtercutoff: 500};
    const result = PatchSchema.safeParse(typoPatch);
    expect(result.success).toBe(false);
});