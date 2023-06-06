import {Build, Context} from "postgraphile";
import {SchemaBuilder} from "graphile-build";
import {Client, ChannelType, Guild} from "discord.js";
import client from "../discord/index";
import {getCTFNamefromId} from "../discord/database/Ctfs";
const logCreateMutationsHookFromBuild = (build: Build) => (fieldContext : Context<any>) => {

    const {
        scope: { isRootMutation, isPgCreateMutationField, pgFieldIntrospection },
    } = fieldContext;

    if (!isRootMutation) return null;

    console.log(fieldContext.scope.fieldName)

    //createTask
    //deleteTask


    if(fieldContext.scope.fieldName !== 'updateTask' && fieldContext.scope.fieldName !== 'createTask' && fieldContext.scope.fieldName !== 'deleteTask') {
        return null;
    }

    const logAttempt = async (input : any, args : any, context : any, resolveInfo : any) => {

        //add challenges to the ctf channel discord
        if(fieldContext.scope.fieldName === 'createTask') {
            console.log("createTask: ")
            console.log(args.input)
        }

        if(fieldContext.scope.fieldName === 'deleteTask') {
            console.log("deleteTask: ")
            console.log(`input: ${input} args: ${args} context: ${context} resolveInfo: ${resolveInfo}`)
        }

        console.log(input)
        return input;
    };

    return {
        before: [],
        after: [
            {
                priority: 500,
                callback: logAttempt,
            },
        ],
        error: [],
    };
};

export default function (builder: SchemaBuilder): void {
    builder.hook("init", (_, build) => {
        build.addOperationHook(logCreateMutationsHookFromBuild(build));
        return _;
    });
}
