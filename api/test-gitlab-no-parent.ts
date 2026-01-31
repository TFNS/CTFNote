import { gitlabClient } from "./src/gitlab/client";
import { gitlabRepositoryManager } from "./src/gitlab/repositories";
import dotenv from "dotenv";

dotenv.config();

// Temporarily disable the parent group
process.env.GITLAB_GROUP_PATH = "";

async function testGitLabNoParent() {
  console.log("=== Testing GitLab CTF Group Creation (No Parent) ===\n");
  
  try {
    // Connect to GitLab
    console.log("1. Connecting to GitLab...");
    await gitlabClient.connect();
    
    if (!gitlabClient.isConnected()) {
      throw new Error("Failed to connect to GitLab");
    }
    
    console.log("✓ Connected successfully");
    const parentGroupId = gitlabClient.getGroupId();
    console.log(`  Parent Group ID: ${parentGroupId || "None (will create at root level)"}`);
    
    // Create a test CTF
    const testCtf = {
      id: BigInt(888),
      title: `Root CTF ${Date.now()}`,
      description: "This is a test CTF at root level",
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    
    console.log(`\n2. Creating group for CTF: ${testCtf.title}`);
    const ctfGroupId = await gitlabRepositoryManager.createOrGetCtfGroup(testCtf);
    
    if (ctfGroupId) {
      console.log(`✓ CTF group created at root level with ID: ${ctfGroupId}`);
      
      // Create a task
      const testTask = {
        id: BigInt(888),
        ctf_id: testCtf.id,
        title: `Root Task ${Date.now()}`,
        description: "Test task in root CTF group",
        flag: "",
      };
      
      console.log(`\n3. Creating repository for task: ${testTask.title}`);
      const repository = await gitlabRepositoryManager.createRepositoryForTask(testTask, testCtf);
      
      if (repository) {
        console.log("\n✓ Repository created in root CTF group!");
        console.log(`  Web URL: ${repository.web_url}`);
        
        // Clean up
        const readline = await import("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        
        rl.question(
          "Delete test resources? (y/n): ",
          async (answer: string) => {
            if (answer.toLowerCase() === "y") {
              try {
                const client = gitlabClient.getClient();
                await client.delete(`/projects/${repository.id}`);
                await client.delete(`/groups/${ctfGroupId}`);
                console.log("✓ Cleaned up");
              } catch (error) {
                console.error("Failed to delete:", error);
              }
            }
            rl.close();
            process.exit(0);
          }
        );
      }
    }
    
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  }
}

testGitLabNoParent();