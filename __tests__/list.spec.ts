import Store from "../index"

describe("List", () => {
    it("return list", () => {
        let store = new Store()

        store.create("store", 0)

        expect(store.list()).toEqual(["store"])
    })

    it("return multiple lists", () => {
        let store = new Store()

        store.create("store", {})
        store.create("flow", {})

        expect(store.list()).toEqual(["store", "flow"])
    })

    it("return empty lists", () => {
        let store = new Store()

        expect(store.list()).toEqual([])
    })
})