
import { createPiece } from "@activepieces/pieces-framework";
import packageJson from "../package.json";
import { createNewPerson } from "./lib/actions/create-new-person";
import { createNewOrganization } from "./lib/actions/create-new-org";

export const affinity = createPiece({
  name: "affinity",
  displayName: "Affinity",
  logoUrl: "https://cdn.activepieces.com/pieces/affinity.png",
  version: packageJson.version,
  authors: [],
  actions: [createNewOrganization, createNewPerson],
  triggers: [],
});
