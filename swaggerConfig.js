const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "API de recettes",
            description: "API pour gérer des recettes de cuisine",
            contact: {
                name: "Rémi Lopez"
            },
            servers: ["http://localhost:5000"]
        },
        components: {
            schemas: {
                Recipe: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        image: { type: "string" },
                        ingredient: { type: "array", items: { type: "string" } },
                        description: { type: "array", items: { type: "string" } },
                    }
                }
            }
        }
    },
    apis: ["./routes/*.js"]
}

module.exports = swaggerOptions;