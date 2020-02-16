import Store from "../index"

describe("subscribe", () => {
    it("applied subscribe successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: false
        })

        store.subscribe("store", store => {
            expect(store).toEqual({
                initial: true
            })

            return store
        })

        store.set("store", {
            initial: true
        })
    })

    it("pass get process as second argument", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.subscribe("store", (store, process) => {
            expect(process).toEqual("get")

            return store
        })

        store.get("store")
    })

    it("pass update process as second argument", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.subscribe("store", (store, process) => {
            expect(process).toEqual("update")

            return store
        })

        store.update("store", {
            initial: true
        })
    })

    it("pass set process as second argument", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.subscribe("store", (store, process) => {
            expect(process).toEqual("set")

            return store
        })

        store.set("store", {
            initial: true
        })
    })

    it("pass model as third argument", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.subscribe("store", (store, process, model) => {
            expect(model).toEqual([
                {
                    name: "store",
                    store: {
                        initial: false
                    }
                }
            ])

            return store
        })

        store.update("store", {
            initial: false
        })
    })
})
