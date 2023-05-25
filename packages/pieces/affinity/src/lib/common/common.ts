import { Property } from "@activepieces/pieces-framework";

const markdown = `
Please follow the instructions below:
1. Go to Settings > API -> Generate API Key
2. Copy the API key and paste it here
`
export const authentication = Property.SecretText({
    displayName: 'API Key',
    description: markdown,
    required: true,
})