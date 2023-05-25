import { createAction, Property } from "@activepieces/pieces-framework";
import { AuthenticationType, httpClient, HttpMethod } from "@activepieces/pieces-common";
import { authentication } from "../common/common";

export const createNewPerson = createAction({
	name: 'create_new_person',
    displayName:'Create New Person',
    description: 'Create a new person in the system',
	props: {
        authentication: authentication,
        first_name: Property.ShortText({
            displayName: 'First Name',
            description: 'First name of the person',
            required: true,
        }),
        last_name: Property.ShortText({
            displayName: 'Last Name',
            description: 'Last name of the person',
            required: true,
        }),
        emails: Property.Array({
            displayName: 'Emails',
            description: 'Emails of the person',
            required: false,
        }),
	},
	async run(context) {
        return (await httpClient.sendRequest({
            method: HttpMethod.POST,
            url: `https://api.affinity.co/persons`,
            body: {
                first_name: context.propsValue.first_name,
                last_name: context.propsValue.last_name,
                emails: context.propsValue.emails ?? []
            },
            authentication: {
                type: AuthenticationType.BASIC,
                username: '',
                password: context.propsValue.authentication,
            }
          })).body;
	},
});