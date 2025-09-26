import { Client4 } from "@mattermost/client";
import type { Team } from "@mattermost/types/teams";
import dotenv from "dotenv";

dotenv.config();

async function testMattermostTeams() {
  const client = new Client4();
  
  const MATTERMOST_URL = process.env.MATTERMOST_URL || "http://localhost:8065";
  const MATTERMOST_USERNAME = process.env.MATTERMOST_USERNAME!;
  const MATTERMOST_PASSWORD = process.env.MATTERMOST_PASSWORD!;
  
  console.log("=== Mattermost Team Creation Test ===");
  console.log(`URL: ${MATTERMOST_URL}`);
  console.log(`Username: ${MATTERMOST_USERNAME}`);
  console.log("");

  try {
    // Set the URL
    client.setUrl(MATTERMOST_URL);
    
    // Login
    console.log("1. Logging in...");
    const user = await client.login(MATTERMOST_USERNAME, MATTERMOST_PASSWORD);
    console.log(`✓ Logged in as: ${user.username} (ID: ${user.id})`);
    
    // Test creating a team
    console.log("\n2. Testing team creation...");
    const testTeamName = `test-ctf-${Date.now()}`;
    const testCtfName = "Test CTF Competition";
    
    try {
      const newTeam = await client.createTeam({
        name: testTeamName,
        display_name: testCtfName,
        type: "O" as const,
        description: `Team for CTF: ${testCtfName}`,
      } as Team);
      
      console.log(`✓ Successfully created test team:`);
      console.log(`  - Name: ${newTeam.name}`);
      console.log(`  - Display: ${newTeam.display_name}`);
      console.log(`  - ID: ${newTeam.id}`);
      console.log(`  - Description: ${newTeam.description}`);
      
      // Create channels in the new team
      console.log("\n3. Creating channels in the new team...");
      
      // Create talk channel
      const talkChannel = await client.createChannel({
        team_id: newTeam.id,
        name: `${testTeamName}-talk`,
        display_name: `${testCtfName} - Talk`,
        type: "O",
        purpose: `General discussion for ${testCtfName}`
      });
      console.log(`✓ Created talk channel: ${talkChannel.name}`);
      
      // Create voice channels
      const voiceChannels = [];
      for (let i = 0; i < 2; i++) {
        const voiceChannel = await client.createChannel({
          team_id: newTeam.id,
          name: `${testTeamName}-voice-${i}`,
          display_name: `${testCtfName} - Voice ${i}`,
          type: "O",
          purpose: `Voice channel ${i} for ${testCtfName}`
        });
        voiceChannels.push(voiceChannel);
        console.log(`✓ Created voice channel ${i}: ${voiceChannel.name}`);
      }
      
      // List channels in the new team
      console.log("\n4. Channels in the new team:");
      const channels = await client.getChannels(newTeam.id);
      channels.forEach(ch => {
        console.log(`  - ${ch.name} (${ch.display_name})`);
      });
      
      // Clean up - delete channels and team
      console.log("\n5. Cleaning up test data...");
      
      // Delete channels
      await client.deleteChannel(talkChannel.id);
      console.log("✓ Deleted talk channel");
      
      for (const vc of voiceChannels) {
        await client.deleteChannel(vc.id);
      }
      console.log("✓ Deleted voice channels");
      
      // Note: Deleting teams requires admin permissions
      // For testing, we'll leave the team and let admin clean it up later
      console.log("ℹ️  Note: Team deletion requires admin permissions. Team will remain for manual cleanup.");
      
    } catch (error) {
      console.error("❌ Failed to create test team:");
      const err = error as { message?: string; server_error_id?: string; status_code?: number };
      if (err.message) {
        console.error(`  Error: ${err.message}`);
      }
      if (err.server_error_id) {
        console.error(`  Server Error ID: ${err.server_error_id}`);
      }
      if (err.status_code) {
        console.error(`  Status Code: ${err.status_code}`);
      }
    }
    
    // List all teams to show current state
    console.log("\n6. Current teams:");
    const teamsResponse = await client.getTeams();
    const teams = Array.isArray(teamsResponse) ? teamsResponse : teamsResponse.teams;
    teams.forEach((team: { name: string; display_name: string }) => {
      console.log(`  - ${team.name} (${team.display_name})`);
    });
    
  } catch (error) {
    console.error("\n❌ Test failed:");
    const err = error as { message?: string; server_error_id?: string; status_code?: number };
    if (err.message) {
      console.error(err.message);
    }
    if (err.server_error_id) {
      console.error(`Server Error ID: ${err.server_error_id}`);
    }
    if (err.status_code) {
      console.error(`Status Code: ${err.status_code}`);
    }
  }
}

// Run the test
testMattermostTeams()
  .then(() => {
    console.log("\n=== Test completed ===");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });