import Store from "../index"

describe("Create", () => {
    it("created successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        expect(store.get("store")).toEqual({
            initial: true
        })
    })

    it("return store value on created", () => {
        let store = new Store()

        expect(
            store.create("store", {
                initial: false
            })
        ).toEqual({
            initial: false
        })
    })

    it("support string", () => {
        let store = new Store()

        store.create("store", "H")
        expect(store.get("store")).toEqual("H")
    })

    it("support falsy value", () => {
        let store = new Store()

        store.create("store", 0)
        expect(store.get("store")).toEqual(0)
    })

    it("support false", () => {
        let store = new Store()

        store.create("store", false)
        expect(store.get("store")).toEqual(false)
    })
})
