import { PieceAuth, createPiece } from "@activepieces/pieces-framework";
import { imageClassifierModelPredictAction, imageToTextModelPredictAction } from "./lib/actions/call-image-model";
import { textToTextModelPredictAction, textClassifierModelPredictAction } from "./lib/actions/call-text-model";
import { audioToTextModelPredictAction } from "./lib/actions/call-audio-model";
import { postInputsAction } from "./lib/actions/call-post-inputs";


export const clarifaiAuth = PieceAuth.SecretText({
    displayName: "API Key",
    description: "Obtain an API or PAT key from your Clarifai account",
    required: true,
});

export const clarifai = createPiece({
    displayName: "Clarifai",
    minimumSupportedRelease: '0.5.0',
    logoUrl: 'https://cdn.activepieces.com/pieces/clarifai.png',
    authors: ['akatechis'],
    auth: clarifaiAuth,
    actions: [
        imageClassifierModelPredictAction,
        textClassifierModelPredictAction,
        imageToTextModelPredictAction,
        textToTextModelPredictAction,
        audioToTextModelPredictAction,
        postInputsAction,
    ],
    triggers: [],
});
