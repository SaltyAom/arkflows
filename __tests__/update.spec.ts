import Store from "../index"

describe("Update", () => {
    it("updated successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: true,
            counter: 0
        })

        store.update("store", {
            counter: 1
        })

        expect(store.get("store")).toEqual({
            initial: true,
            counter: 1
        })
    })

    it("return store value on updated", () => {
        let store = new Store()

        store.create("store", {
            initial: false,
            counter: 0
        })

        expect(
            store.update("store", {
                initial: true
            })
        ).toEqual({
            initial: true,
            counter: 0
        })
    })

    it("update multiple properties", () => {
        let store = new Store()

        store.create("store", {
            initial: false,
            counter: 0
        })

        store.update("store", {
            initial: true,
            counter: 1
        })

        expect(store.get("store")).toEqual({
            initial: true,
            counter: 1
        })
    })
})
