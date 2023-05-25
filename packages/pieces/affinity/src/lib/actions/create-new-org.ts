import { createAction, Property } from "@activepieces/pieces-framework";
import { AuthenticationType, httpClient, HttpMethod } from "@activepieces/pieces-common";
import { authentication } from "../common/common";

export const createNewOrganization = createAction({
	name: 'create_new_organization', // Must be a unique across the piece, this shouldn't be changed.
    displayName:'Create New Organization',
    description: 'Create a new organization in the system',
	props: {
        authentication: authentication,
        name: Property.ShortText({
            displayName: 'Name',
            description: 'Name of the organization',
            required: true,
        }),
        domain: Property.ShortText({
            displayName: 'Domain',
            description: 'Domain of the organization',
            required: false,
        }),
	},
	async run(context) {
        return (await httpClient.sendRequest({
            method: HttpMethod.POST,
            url: `https://api.affinity.co/organizations`,
            body: {
                name: context.propsValue.name,
                domain: context.propsValue.domain,
            },
            authentication: {
                type: AuthenticationType.BASIC,
                username: '',
                password: context.propsValue.authentication,
            }
          })).body;
	},
});