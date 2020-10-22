import { SaveRevisionActionArgsType } from "@webiny/app-page-builder/editor/recoil/actions/saveRevision/types";
import { EventActionCallableType } from "@webiny/app-page-builder/editor/recoil/eventActions";
import { PageAtomType } from "@webiny/app-page-builder/editor/recoil/modules";
import { setIsNotSavingMutation } from "@webiny/app-page-builder/editor/recoil/modules/ui/mutations/setIsNotSavingMutation";
import gql from "graphql-tag";
import lodashIsEqual from "lodash/isEqual";

type PageRevisionType = Pick<PageAtomType, "title" | "snippet" | "url" | "settings" | "content"> & {
    category: string;
};

let lastSavedRevisionData: any = {};

const didDataChange = (data: PageRevisionType) => {
    const { content, ...restOfData } = data;
    const { content: lastContent, ...restOfLastRevisionData } = lastSavedRevisionData;

    return lodashIsEqual(restOfData, restOfLastRevisionData);
};

export const saveRevisionAction: EventActionCallableType<SaveRevisionActionArgsType> = async (
    state,
    args
) => {
    if (state.page.locked) {
        return {};
    }

    const data: PageRevisionType = {
        title: state.page.title,
        snippet: state.page.snippet,
        url: state.page.url,
        settings: state.page.settings,
        content: state.page.content,
        category: state.page.category.id
    };

    if (!didDataChange(data)) {
        return {};
    }

    lastSavedRevisionData = data;

    const updateRevision = gql`
        mutation UpdateRevision($id: ID!, $data: PbUpdatePageInput!) {
            pageBuilder {
                updateRevision(id: $id, data: $data) {
                    data {
                        id
                        content
                        title
                        published
                        savedOn
                    }
                    error {
                        code
                        message
                        data
                    }
                }
            }
        }
    `;

    const result = await args.client.mutate({
        mutation: updateRevision,
        variables: {
            id: state.page.id,
            data
        }
    });
    if (args.onFinish && typeof args.onFinish === "function") {
        args.onFinish();
    }

    return {
        state: {
            ui: setIsNotSavingMutation(state.ui)
        }
    };
};
