import Store from "../index"

describe("PurpleTea", () => {
    it("should create store", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        expect(store.get("store")).toEqual({
            initial: true
        })
    })

    it("should update store", () => {
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

    it("should set store", () => {
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

    it("should subscribe to store", () => {
        let store = new Store(),
            subscribed = false
        
        store.create("store", {
            initial: false
        })

        store.subscribe("store", () => {
            subscribed = true
            expect(subscribed).toEqual(true)
        })

        store.set("store", {
            initial: true
        })
    })

    it("should apply middleware", () => {
        let store = new Store()

        store.create("store", {
            initial: false
        })

        store.applyMiddleware((store, process, name) => {
            if(process === "set")
                return {}

            return store
        })

        store.set("store", {
            initial: true
        })

        expect(store.get("store")).toEqual({})
    })

    it("should return store's list", () => {
        let store = new Store()

        store.create("store", {})
        store.create("flow", {})

        expect(store.list()).toEqual(["store", "flow"])
    })

    it("should return store's model", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.create("flow", {
            initial: true
        })

        expect(store.model()).toEqual([
            {
                name: "store",
                store: {
                    initial: true
                }
            },
            {
                name: "flow",
                store: {
                    initial: true
                }
            }
        ])
    })
})