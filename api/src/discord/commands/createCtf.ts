import {
    CommandInteraction,
    Client,
    ApplicationCommandType,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle, Interaction
} from "discord.js";
import { Command } from "../command";
import { getCTFNamesFromDatabase } from "../database/Ctfs";



async function createCtfLogic(client: Client, interaction: CommandInteraction) {


    const ctfNames = await getCTFNamesFromDatabase();
    const ctfNamesMessage = `Create one of the following CTFs`;


    //make a loop to create buttons for each ctf
    const buttons: any[] = [];
    for (let i = 0; i < ctfNames.length; i++) {
        buttons.push(new ButtonBuilder()
            .setCustomId(`create-ctf-button-${ctfNames[i]}`)
            .setLabel(ctfNames[i])
            .setStyle(ButtonStyle.Success)
        );
    }

    // Create the action row with the button component
    const actionRow:any = new ActionRowBuilder()
        .addComponents(buttons);

    await interaction.followUp({
        content: ctfNamesMessage,
        components: [actionRow], // Convert the action row component to JSON format
    });



}

export const CreateCtf: Command = {
    name: "create-ctf",
    description: "Creates the channels and roles for a CTF",
    type: ApplicationCommandType.ChatInput,
    run: createCtfLogic
};
