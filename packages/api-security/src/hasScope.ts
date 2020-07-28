import { GraphQLFieldResolver } from "@webiny/graphql/types";
import { ErrorResponse } from "@webiny/commodo-graphql";

export default (scope: string) => {
    return (resolver: GraphQLFieldResolver) => {
        return async (parent, args, context, info) => {
            if (await context.security.getIdentity().hasScope(scope)) {
                return resolver(parent, args, context, info);
            }

            return new ErrorResponse({
                message: `Not authorized (scope "${scope}" not found).`
            });
        };
    };
};
