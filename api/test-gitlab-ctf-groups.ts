import { gitlabClient } from "./src/gitlab/client";
import { gitlabRepositoryManager } from "./src/gitlab/repositories";
import dotenv from "dotenv";

dotenv.config();

async function testGitLabCTFGroups() {
  console.log("=== Testing GitLab CTF Group Creation ===\n");
  
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
      id: BigInt(999),
      title: `Test CTF ${Date.now()}`,
      description: "This is a test CTF for GitLab group integration",
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };
    
    console.log(`\n2. Creating group for CTF: ${testCtf.title}`);
    const ctfGroupId = await gitlabRepositoryManager.createOrGetCtfGroup(testCtf);
    
    if (ctfGroupId) {
      console.log(`✓ CTF group created/found with ID: ${ctfGroupId}`);
      
      // Now create a task in this CTF
      const testTask = {
        id: BigInt(999),
        ctf_id: testCtf.id,
        title: `Test Task ${Date.now()}`,
        description: "This is a test task for repository creation in CTF group",
        flag: "",
      };
      
      console.log(`\n3. Creating repository for task: ${testTask.title}`);
      const repository = await gitlabRepositoryManager.createRepositoryForTask(testTask, testCtf);
      
      if (repository) {
        console.log("\n✓ Repository created successfully in CTF group!");
        console.log(`  Name: ${repository.name}`);
        console.log(`  Path: ${repository.path}`);
        console.log(`  Web URL: ${repository.web_url}`);
        console.log(`  SSH URL: ${repository.ssh_url_to_repo}`);
        console.log(`  HTTP URL: ${repository.http_url_to_repo}`);
        
        // Optionally delete the test repository and group
        console.log("\n4. Cleaning up...");
        const readline = await import("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        
        rl.question(
          "Do you want to delete the test repository and group? (y/n): ",
          async (answer: string) => {
            if (answer.toLowerCase() === "y") {
              try {
                const client = gitlabClient.getClient();
                // Delete the repository
                await client.delete(`/projects/${repository.id}`);
                console.log("✓ Test repository deleted");
                
                // Delete the CTF group
                await client.delete(`/groups/${ctfGroupId}`);
                console.log("✓ Test CTF group deleted");
              } catch (error) {
                console.error("Failed to delete test resources:", error);
              }
            } else {
              console.log("Test resources kept. You can delete them manually later.");
            }
            rl.close();
            process.exit(0);
          }
        );
      } else {
        console.log("❌ Failed to create repository");
        process.exit(1);
      }
    } else {
      console.log("❌ Failed to create CTF group");
      process.exit(1);
    }
    
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error);
    
    const err = error as { response?: { data?: unknown } };
    if (err.response?.data) {
      console.error("GitLab API response:", err.response.data);
    }
    process.exit(1);
  }
}

// Run the test
testGitLabCTFGroups();