import Store from "../index"

describe("middleware", () => {
    it("applied middleware successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: false
        })

        store.applyMiddleware(store => {
            expect(store).toEqual({
                initial: true
            })

            return store
        })

        store.set("store", {
            initial: true
        })
    })

    it("applied blank middleware successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.applyMiddleware(store => store)

        expect(store.get("store")).toEqual({
            initial: true
        })
    })

    it("pass get process as second argument", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.applyMiddleware((store, process) => {
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

        store.applyMiddleware((store, process) => {
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

        store.applyMiddleware((store, process) => {
            expect(process).toEqual("set")

            return store
        })

        store.set("store", {
            initial: true
        })
    })

    it("pass name as third argument", () => {
        let store = new Store()

        store.applyMiddleware((store, process, name) => {
            expect(name).toEqual("store")
        })

        store.create("store", {
            initial: true
        })
    })

    it("mutate store successfully", () => {
        let store = new Store()

        store.create("store", {
            initial: true
        })

        store.applyMiddleware(() => "")

        expect(store.get("store")).toEqual("")
    })
})
