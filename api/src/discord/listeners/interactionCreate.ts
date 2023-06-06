import {Client, CommandInteraction, Interaction, ChannelType} from "discord.js";
import {Commands} from "../commands";
import { getCTFNamesFromDatabase, getCtfIdFromDatabase, getChallengesFromDatabase } from "../database/Ctfs";

export default(client: Client): void => {
    client.on("interactionCreate", async (interaction: Interaction) => {

        //check if it is a button interaction
        if (interaction.isButton()) {
            //create the ctf channels and roles
            if (interaction.customId.startsWith("create-ctf-button-")) {
                const ctfName = interaction.customId.replace("create-ctf-button-", "");
                await interaction.channel?.send(`Creating the CTF channels and roles for ${ctfName}`);
                interaction.deferUpdate();

                const channel = await interaction.guild?.channels.create({
                    name: `${ctfName}`,
                    type: ChannelType.GuildCategory,
                })

                interaction.guild?.channels.create({
                    name: `challenges-talk`,
                    type: ChannelType.GuildText,
                    parent: channel?.id,
                });

                // create for every challenge a channel
                const ctfId = await getCtfIdFromDatabase(ctfName);
                const challenges = await getChallengesFromDatabase(ctfId);

                challenges.forEach((challenge : any) => {
                    interaction.guild?.channels.create({
                        name: `${challenge.title} - ${challenge.category}`,
                        type: ChannelType.GuildText,
                        parent: channel?.id,
                        topic: `${challenge.title} - ${challenge.category}`,
                    }).then((channel) => {
                        if(challenge.description != "")
                            channel.send(challenge.description);
                    });
                });
            }
        }

        if (interaction.isCommand() || interaction.isContextMenuCommand()) {
            await handleSlashCommand(client, interaction);
        }
    });
};

const handleSlashCommand = async (client: Client, interaction:  CommandInteraction): Promise<void> => {
    const slashCommand = Commands.find(c => c.name === interaction.commandName);
    if (!slashCommand) {
        await interaction.followUp({content: "An error has occurred"});
        return;
    }

    await interaction.deferReply();

    slashCommand.run(client, interaction);
};