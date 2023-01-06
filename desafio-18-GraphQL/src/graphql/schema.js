import { buildSchema } from "graphql"

const schemaGraph = buildSchema(`
type Login {
    titulo: String

}
type Query {
    login: [Login]
}

`)

export default schemaGraph