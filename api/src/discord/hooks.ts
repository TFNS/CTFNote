import { SchemaBuilder } from "postgraphile";
import { getChannelHandleStyleHooks } from "./utils/channelStyle";

export default async function (builder: SchemaBuilder): Promise<void> {
  const hooks = await getChannelHandleStyleHooks();
  builder.hook("init", (_, build) => {
    build.addOperationHook(hooks.operationHook(build));
    return _;
  });
}
