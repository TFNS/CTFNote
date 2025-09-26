import { mattermostClient } from "./src/mattermost/client";
import { mattermostChannelManager } from "./src/mattermost/channels";
import dotenv from "dotenv";

dotenv.config();

async function testCTFNoteChannelCreation() {
  console.log("=== Testing CTFNote Channel Creation ===\n");
  
  try {
    // Connect to Mattermost
    console.log("1. Connecting to Mattermost...");
    await mattermostClient.connect();
    
    if (!mattermostClient.isConnected()) {
      throw new Error("Failed to connect to Mattermost");
    }
    
    console.log("✓ Connected successfully");
    console.log(`  Team ID: ${mattermostClient.getTeamId()}`);
    console.log(`  User ID: ${mattermostClient.getUserId()}`);
    
    // Create a test CTF
    const testCtf = {
      id: BigInt(999),
      title: `Test CTF ${Date.now()}`,
      description: "This is a test CTF for channel creation"
    };
    
    console.log(`\n2. Creating channels for CTF: ${testCtf.title}`);
    await mattermostChannelManager.createChannelsForCtf(testCtf);
    
    console.log("\n3. Verifying channels were created...");
    
    // Add a small delay to ensure channels are fully created
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get the client and team ID to check channels
    const client = mattermostClient.getClient();
    const teamId = mattermostClient.getTeamId();
    
    if (!teamId) {
      throw new Error("No team ID found");
    }
    
    // List all channels and find our test channels
    const channels = await client.getChannels(teamId);
    const normalizedTitle = testCtf.title
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/-+/g, "-")
      .substring(0, 64);
    
    console.log(`Looking for channels with normalized title: ${normalizedTitle}`);
    
    // The timestamp is part of the title, so let's extract it
    const timestamp = testCtf.title.match(/\d+$/)?.[0] || "";
    
    const testChannels = channels.filter(ch => 
      ch.name.includes("test-ctf-") && ch.name.includes(timestamp)
    );
    
    console.log(`\nFound ${testChannels.length} channels for our test CTF:`);
    testChannels.forEach(ch => {
      console.log(`  ✓ ${ch.name} (${ch.display_name})`);
      console.log(`    ID: ${ch.id}`);
      console.log(`    Purpose: ${ch.purpose || "No purpose"}`);
    });
    
    if (testChannels.length === 0) {
      console.log("  ❌ No channels found! Channels were not created.");
    }
    
    // Clean up - delete test channels
    console.log("\n4. Cleaning up test channels...");
    for (const channel of testChannels) {
      try {
        await client.deleteChannel(channel.id);
        console.log(`  ✓ Deleted ${channel.name}`);
      } catch (error) {
        console.log(`  ⚠️  Could not delete ${channel.name}: ${error}`);
      }
    }
    
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error);
    
    const err = error as { server_error_id?: string; status_code?: number };
    if (err.server_error_id) {
      console.error(`Mattermost Error ID: ${err.server_error_id}`);
    }
    if (err.status_code) {
      console.error(`HTTP Status: ${err.status_code}`);
    }
  }
}

// Run the test
testCTFNoteChannelCreation()
  .then(() => {
    console.log("\n=== Test completed ===");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });