import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  CategoryChannel,
  ChannelType,
  Client,
  CommandInteraction,
  TextChannel,
} from "discord.js";
import { Command } from "../command";
import {
  getCTFNamesFromDatabase,
  getCtfIdFromDatabase,
} from "../database/ctfs";
import {
  getTaskByCtfIdAndNameFromDatabase,
  userStartsWorkingOnTask,
  userStopsWorkingOnTask,
} from "../database/tasks";
import {
  sendStartWorkingOnMessage,
  sendStopWorkingOnMessage,
} from "../../plugins/discordHooks";
import { getUserByDiscordId } from "../database/users";

async function accessDenied(interaction: CommandInteraction) {
  await interaction.editReply({
    content:
      "You are not using a valid channel to start/stop working on the task",
  });
}

async function workingOnLogic(
  _client: Client,
  interaction: CommandInteraction,
  operation: "start" | "stop"
) {
  const ctfNames = await getCTFNamesFromDatabase();

  const categoryChannel = (await interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory &&
      ctfNames.includes(channel.name)
  )) as CategoryChannel;
  if (categoryChannel == null) return accessDenied(interaction);

  const currentTaskChannel = (await interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildText &&
      channel.id === interaction.channelId &&
      channel.guildId === categoryChannel.guildId
  )) as TextChannel;

  const ctfId = await getCtfIdFromDatabase(categoryChannel.name);
  if (ctfId == null) return accessDenied(interaction);

  const name = currentTaskChannel?.topic;
  if (name == null) return accessDenied(interaction);

  const task = await getTaskByCtfIdAndNameFromDatabase(ctfId, name);
  if (task.id == null) return accessDenied(interaction);

  const userId = await getUserByDiscordId(interaction.user.id);
  if (userId == null) {
    await interaction.editReply({
      content:
        "You have not linked your CTFNote account to your Discord account yet. Please use the /link command to do so.",
    });
    return;
  }

  if (operation === "start") {
    const result = await userStartsWorkingOnTask(userId, task.id);
    if (result) {
      await interaction.editReply({
        content:
          startWorkingSentences[
            Math.floor(Math.random() * startWorkingSentences.length)
          ],
      });
      await sendStartWorkingOnMessage(userId, task.id);
      return;
    } else {
      await interaction.editReply({
        content: `You are already working on the task ${name}`,
      });
      return;
    }
  } else if (operation === "stop") {
    const result = await userStopsWorkingOnTask(userId, task.id);
    if (result) {
      await interaction.editReply({
        content:
          stopWorkingSentences[
            Math.floor(Math.random() * stopWorkingSentences.length)
          ],
      });
      await sendStopWorkingOnMessage(userId, task.id);
      return;
    } else {
      await interaction.editReply({
        content: `You are not working on the task ${name}`,
      });
      return;
    }
  }
}

export const StartWorking: Command = {
  name: "start",
  description: "Start working on the task linked to this text channel",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    return workingOnLogic(client, interaction, "start").catch((e) => {
      console.error("Error during start working logic: ", e);
    });
  },
};

export const StopWorking: Command = {
  name: "stop",
  description: "Stop working on the task linked to this text channel",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    return workingOnLogic(client, interaction, "stop").catch((e) => {
      console.error("Error during stop working logic: ", e);
    });
  },
};

const startWorkingSentences = [
  "You've got this!",
  "Believe in yourself and your abilities.",
  "Stay focused and determined.",
  "Embrace the challenge and enjoy the journey.",
  "Think creatively and outside the box.",
  "Each challenge is an opportunity to learn and grow.",
  "Success is within your reach.",
  "Persistence is key. Keep pushing forward.",
  "Stay calm and keep your mind clear.",
  "Challenge yourself to new heights.",
  "You have the skills and knowledge to tackle this.",
  "Trust in your training and preparation.",
  "Remember why you love CTF challenges.",
  "Embrace the thrill of the hunt.",
  "Failure is just a stepping stone to success.",
  "Take it one step at a time, and you'll get there.",
  "You're a problem-solving genius.",
  "Adopt a positive mindset and overcome any obstacle.",
  "Success comes to those who never give up.",
  "Strive for excellence in every challenge.",
  "Keep your eyes on the prize.",
  "Learn from each challenge, whether you win or lose.",
  "Your determination will set you apart.",
  "Celebrate small victories along the way.",
  "The harder the challenge, the sweeter the victory.",
  "Face the challenge head-on with confidence.",
  "You're capable of amazing things.",
  "Stay hungry for knowledge and improvement.",
  "Break it down into manageable pieces and conquer them.",
  "Believe in your ability to find the solution.",
  "Stay persistent, even when things get tough.",
  "Unlock your full potential.",
  "Challenge accepted! Let's do this!",
  "Focus on the process and trust the results will come.",
  "Don't be afraid to ask for help when needed.",
  "Visualize your success and make it a reality.",
  "Push beyond your limits and see what you're truly capable of.",
  "You're a CTF superstar in the making.",
  "Turn challenges into opportunities for growth.",
  "Face the fear and embrace the challenge.",
  "Stay curious and explore different approaches.",
  "Failure is not an option; it's just a detour on your path to success.",
  "Each challenge you overcome makes you stronger.",
  "Never underestimate the power of determination.",
  "Stay focused on your goals and let nothing distract you.",
  "Embrace the unknown and step outside your comfort zone.",
  "Think strategically and plan your moves carefully.",
  "Your skills are honed and ready for action.",
  "You're not just a player; you're a problem-solving wizard.",
  "Remember, the only way to fail is to never try.",
  "Be patient with yourself and enjoy the learning process.",
  "Rise above the challenge and conquer it.",
  "You're a force to be reckoned with in the CTF world.",
  "Stay positive and believe in your abilities.",
  "Challenge yourself and aim for greatness.",
  "Hard work and dedication will lead you to victory.",
  "Embrace the challenge as an opportunity to shine.",
  "Your potential is limitless. Don't hold back.",
  "The journey is just as important as the destination.",
  "Stay focused, stay determined, stay unstoppable.",
  "You're not alone; the CTF community supports you.",
  "Let your passion for CTF challenges fuel your success.",
  "Keep calm and hack on!",
  "Your skills are like a fine-tuned instrument. Play them well.",
  "Conquer the challenge and leave your mark.",
  "Never stop learning, never stop growing.",
  "Every challenge is a chance to learn something new.",
  "Success is the sum of small efforts repeated consistently.",
  "You're capable of breaking any code and solving any puzzle.",
  "Embrace the adrenaline rush that comes with each challenge.",
  "Keep your eyes on the prize and don't let go.",
  "You're a master of logic and problem-solving.",
  "Believe in your instincts and trust your gut.",
  "Strive for progress, not perfection.",
  "Your potential knows no bounds.",
  "Challenge the challenge and come out victorious.",
  "Stay committed to your goals, and success will follow.",
  "Face the challenge with confidence and determination.",
  "You're an unstoppable force in the world of CTF.",
  "Rise above the rest and leave them in awe.",
  "Stay hungry, stay motivated, stay ahead.",
  "Every challenge is an opportunity for growth.",
  "Success is not just about winning; it's about learning and improving.",
  "Remember, the expert in anything was once a beginner.",
  "You have the skills to crack any code and unlock any mystery.",
  "Challenge yourself, and watch yourself soar.",
  "Stay focused on the solution, not the problem.",
  "In the face of challenges, your true potential shines.",
  "You're a problem-solving ninja. Show them what you're made of.",
  "Don't be afraid to take risks and think outside the box.",
  "Every challenge you conquer brings you closer to your goals.",
  "Let your passion for CTF challenges drive your success.",
  "You were born to tackle CTF challenges.",
  "Stay cool, calm, and collected under pressure.",
  "The thrill of the challenge is what keeps you going.",
  "Success is not the absence of failure but the persistence through it.",
  "There's no challenge too great for your skills.",
  "You're on the path to CTF greatness. Keep going!",
  "The harder the challenge, the sweeter the victory.",
  "Stay focused on the puzzle, and everything else will fade away.",
  "You're an unstoppable force in the world of cybersecurity.",
  "Be bold, be fearless, be unstoppable.",
  "Your CTF skills are legendary. Unleash them!",
  "Embrace the challenge, and it will become your greatest ally.",
  "Success is not a destination; it's a journey.",
  "Stay determined, stay persistent, stay motivated.",
  "You're a CTF prodigy in the making.",
  "Keep pushing your limits, and you'll achieve greatness.",
  "Every challenge you overcome adds to your arsenal of knowledge.",
  "No challenge is insurmountable for someone of your caliber.",
  "Stay calm, stay focused, stay unbreakable.",
  "Embrace the unknown and let your skills shine through.",
  "Remember, challenges are meant to be conquered.",
  "You're a CTF superhero. Save the day with your skills!",
];

const stopWorkingSentences = [
  "Great effort! You gave it your all.",
  "Every challenge is a learning opportunity. Well done!",
  "No matter the outcome, you've grown through this experience.",
  "Take a moment to appreciate how far you've come.",
  "Remember, success is not solely measured by the end result.",
  "You've tackled the challenge with determination. That's commendable.",
  "Regardless of the outcome, you've expanded your skillset.",
  "Celebrate the progress you've made during this challenge.",
  "Your perseverance and dedication are admirable.",
  "Well done for taking on the challenge. Keep up the good work!",
  "Don't be discouraged. Challenges like these shape you as a player.",
  "Even if you didn't solve it, you've gained valuable insights.",
  "Take a break, recharge, and come back stronger for the next challenge.",
  "Remember, failure is an opportunity to learn and improve.",
  "Reflect on the strategies you've employed. There's always room for growth.",
  "You're on the path to becoming a CTF master. Keep going!",
  "Success is a journey, and you're making progress.",
  "Each challenge brings you closer to your goals. Well done!",
  "Acknowledge the skills and knowledge you've acquired.",
  "Even if the challenge seemed daunting, you gave it your best shot.",
  "Appreciate the learning experience this challenge has provided.",
  "Your commitment to improvement is evident. Keep it up!",
  "You're a dedicated player. Celebrate your efforts.",
  "Remember, the joy is in the journey, not just the destination.",
  "Don't be disheartened. Challenges like these make you stronger.",
  "Give yourself credit for the steps you've taken in the right direction.",
  "Take pride in your determination to face difficult challenges.",
  "Success is not measured by a single challenge. It's a cumulative process.",
  "Your growth mindset will continue to propel you forward.",
  "Every challenge attempted is a step towards mastery.",
  "The experience gained from this challenge is invaluable.",
  "Failure is not final. It's a stepping stone to success.",
  "Regardless of the outcome, you've expanded your problem-solving skills.",
  "You're building resilience with each challenge you face.",
  "Celebrate the knowledge you've gained throughout this journey.",
  "Take a moment to appreciate your dedication to continuous improvement.",
  "Remember, it's not about the destination; it's about the progress made.",
  "Success is not immediate, but your efforts are moving you forward.",
  "You're growing as a player, one challenge at a time.",
  "Give yourself credit for the courage it takes to face challenging tasks.",
  "Every challenge is an opportunity to refine your skills.",
  "Reflect on the strategies you employed. There's always room for refinement.",
  "The experience gained from this challenge will serve you well in the future.",
  "Appreciate the effort you put into this challenge. Well done!",
  "Even if the challenge wasn't conquered, you've expanded your knowledge.",
  "Success lies in the lessons learned and the growth achieved.",
  "Acknowledge the progress you've made since starting this challenge.",
  "You've shown dedication and determination. That's worthy of praise.",
  "Take a moment to recharge and come back stronger.",
  "Remember, you're on a journey of constant improvement.",
  "Don't let setbacks define your journey. Keep pushing forward.",
  "Your resilience in the face of challenges is inspiring.",
  "Celebrate the small victories along the way.",
  "Appreciate the efforts you've put into this challenge. Well done!",
  "Even in the face of difficulty, you've displayed perseverance.",
  "Remember, every challenge is an opportunity for growth.",
  "Don't be discouraged by temporary setbacks. Keep striving for success.",
  "Success is a reflection of the hard work you put into challenges like these.",
  "Acknowledge the progress you've made, no matter how small.",
  "You've demonstrated great problem-solving skills throughout this challenge.",
  "Take pride in your dedication to continuous learning.",
  "Even if the challenge proved challenging, you're one step closer to success.",
  "Remember, every attempt is a step closer to mastery.",
  "Celebrate the insights gained from this challenge.",
  "Appreciate the skills and knowledge you've gained from this experience.",
  "Reflect on the growth you've achieved since starting this challenge.",
  "Your resilience and determination are qualities to be proud of.",
  "Take a moment to recharge and regroup. You're doing great!",
  "Don't be disheartened. Challenges like these shape you into a better player.",
  "Remember, failure is not the end. It's an opportunity to improve.",
  "Acknowledge the strategies you employed and the lessons learned.",
  "You're on the right path to becoming a CTF champion. Keep going!",
  "Success is not defined by a single challenge but by the progress you make.",
  "Each challenge brings you closer to your goals. Be proud of your efforts!",
  "Take pride in the skills and knowledge you've acquired.",
  "Even if you didn't solve the challenge, you've grown as a player.",
  "Appreciate the learning opportunities this challenge has provided.",
  "Your commitment to improvement is evident. Keep up the fantastic work!",
  "You're dedicated to overcoming obstacles. That's commendable.",
  "Remember, the joy is in the journey, not just the destination.",
  "Don't be discouraged. Challenges like these make you a better player.",
  "Acknowledge the steps you've taken in the right direction.",
  "Take pride in your determination to face difficult challenges head-on.",
  "Success is not defined by a single challenge. It's a continuous journey.",
  "Your growth mindset will continue to propel you forward.",
  "Every challenge attempted is a step towards mastery.",
  "The experience gained from this challenge is invaluable.",
  "Failure is not a permanent state. It's a stepping stone to success.",
  "Regardless of the outcome, you've expanded your problem-solving skills.",
  "You're building resilience with each challenge you take on.",
  "Celebrate the knowledge you've gained throughout this journey.",
  "Take a moment to appreciate your dedication to continuous improvement.",
  "Remember, it's not about the destination; it's about the progress made.",
  "Success is not immediate, but your efforts are moving you forward.",
  "You're growing as a player, one challenge at a time.",
  "Give yourself credit for the courage it takes to face challenging tasks.",
  "Every challenge is an opportunity to refine your skills.",
  "Reflect on the strategies you employed. There's always room for refinement.",
  "The experience gained from this challenge will serve you well in the future.",
  "Appreciate the effort you put into this challenge. Well done!",
  "Even if the challenge wasn't conquered, you've expanded your knowledge.",
  "Success lies in the lessons learned and the growth achieved.",
  "Acknowledge the progress you've made since starting this challenge.",
  "You've shown dedication and determination. That's worthy of praise.",
  "Take a moment to recharge and come back stronger.",
  "Remember, you're on a journey of constant improvement.",
  "Don't let setbacks define your journey. Keep pushing forward.",
  "Your resilience in the face of challenges is inspiring.",
];
