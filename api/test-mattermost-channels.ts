import { Client4 } from "@mattermost/client";
import dotenv from "dotenv";

dotenv.config();

async function testMattermostChannels() {
  const client = new Client4();
  
  // Update this to use localhost:8065 for your Docker container
  const MATTERMOST_URL = process.env.MATTERMOST_URL || "http://localhost:8065";
  const MATTERMOST_USERNAME = process.env.MATTERMOST_USERNAME!;
  const MATTERMOST_PASSWORD = process.env.MATTERMOST_PASSWORD!;
  const MATTERMOST_TEAM_NAME = process.env.MATTERMOST_TEAM_NAME!;
  
  console.log("=== Mattermost Channel Test ===");
  console.log(`URL: ${MATTERMOST_URL}`);
  console.log(`Username: ${MATTERMOST_USERNAME}`);
  console.log(`Team: ${MATTERMOST_TEAM_NAME}`);
  console.log("");

  try {
    // Set the URL
    client.setUrl(MATTERMOST_URL);
    
    // Login
    console.log("1. Logging in...");
    const user = await client.login(MATTERMOST_USERNAME, MATTERMOST_PASSWORD);
    console.log(`✓ Logged in as: ${user.username} (ID: ${user.id})`);
    
    // Get teams
    console.log("\n2. Getting teams...");
    const teamsResponse = await client.getTeams();
    const teams = Array.isArray(teamsResponse) ? teamsResponse : teamsResponse.teams;
    console.log(`✓ Found ${teams.length} teams:`);
    teams.forEach((team: { name: string; display_name: string; id: string }) => {
      console.log(`  - ${team.name} (${team.display_name}) - ID: ${team.id}`);
    });
    
    // Find our team
    const team = teams.find((t: { name: string }) => t.name === MATTERMOST_TEAM_NAME);
    if (!team) {
      throw new Error(`Team '${MATTERMOST_TEAM_NAME}' not found!`);
    }
    console.log(`✓ Using team: ${team.display_name}`);
    
    // Get all channels for the team
    console.log("\n3. Getting all channels in team...");
    const channels = await client.getChannels(team.id);
    console.log(`✓ Found ${channels.length} channels:`);
    
    // Filter and display CTF-related channels
    const ctfChannels = channels.filter(ch => 
      ch.name.includes("talk") || 
      ch.name.includes("voice") ||
      ch.name.includes("asssss") ||
      ch.name.includes("wieso")
    );
    
    console.log("\nCTF-related channels:");
    if (ctfChannels.length === 0) {
      console.log("  ❌ No CTF channels found!");
    } else {
      ctfChannels.forEach(ch => {
        console.log(`  - ${ch.name} (${ch.display_name}) - ID: ${ch.id}`);
        console.log(`    Purpose: ${ch.purpose || "No purpose set"}`);
        console.log(`    Created: ${new Date(ch.create_at).toLocaleString()}`);
      });
    }
    
    // Test creating a channel
    console.log("\n4. Testing channel creation...");
    const testChannelName = `test-ctf-${Date.now()}`;
    
    try {
      const newChannel = await client.createChannel({
        team_id: team.id,
        name: testChannelName,
        display_name: "Test CTF Channel",
        type: "O",
        purpose: "Test channel created by API"
      });
      
      console.log(`✓ Successfully created test channel:`);
      console.log(`  - Name: ${newChannel.name}`);
      console.log(`  - Display: ${newChannel.display_name}`);
      console.log(`  - ID: ${newChannel.id}`);
      
      // Delete the test channel
      console.log("\n5. Cleaning up test channel...");
      await client.deleteChannel(newChannel.id);
      console.log("✓ Test channel deleted");
      
    } catch (error) {
      console.error("❌ Failed to create test channel:");
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
    
    // List all channels again to show current state
    console.log("\n6. Final channel list (first 10):");
    const allChannels = await client.getChannels(team.id);
    allChannels.slice(0, 10).forEach(ch => {
      console.log(`  - ${ch.name} (${ch.display_name})`);
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
testMattermostChannels()
  .then(() => {
    console.log("\n=== Test completed ===");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });