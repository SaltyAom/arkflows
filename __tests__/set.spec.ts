import Store from "../index"

describe("Set", () => {
    it("set successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: true,
            counter: 0
        })

        store.set("store", {
            counter: 1
        })

        expect(store.get("store")).toEqual({
            counter: 1
        })
    })

    it("return store value on set", () => {
        let store = new Store()

        store.create("store", {
            initial: false,
            counter: 0
        })

        expect(
            store.set("store", {
                initial: true
            })
        ).toEqual({
            initial: true,
        })
    })
})