import { gitlabClient } from "./src/gitlab/client";
import { gitlabRepositoryManager } from "./src/gitlab/repositories";
import dotenv from "dotenv";

dotenv.config();

async function testGitLabRepository() {
  console.log("=== Testing GitLab Repository Creation ===\n");
  
  try {
    // Connect to GitLab
    console.log("1. Connecting to GitLab...");
    await gitlabClient.connect();
    
    if (!gitlabClient.isConnected()) {
      throw new Error("Failed to connect to GitLab");
    }
    
    console.log("✓ Connected successfully");
    console.log(`  Group ID: ${gitlabClient.getGroupId() || "Using user namespace"}`);
    
    // Create a test CTF and task
    const testCtf = {
      id: BigInt(999),
      title: `Test CTF ${Date.now()}`,
      description: "This is a test CTF for GitLab integration",
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };
    
    const testTask = {
      id: BigInt(999),
      ctf_id: testCtf.id,
      title: `Test Task ${Date.now()}`,
      description: "This is a test task for repository creation\n\nIt has multiple lines\nand some **markdown**",
      flag: "",
    };
    
    console.log(`\n2. Creating repository for task: ${testTask.title}`);
    const repository = await gitlabRepositoryManager.createRepositoryForTask(testTask, testCtf);
    
    if (repository) {
      console.log("\n✓ Repository created successfully!");
      console.log(`  Name: ${repository.name}`);
      console.log(`  Path: ${repository.path}`);
      console.log(`  Web URL: ${repository.web_url}`);
      console.log(`  SSH URL: ${repository.ssh_url_to_repo}`);
      console.log(`  HTTP URL: ${repository.http_url_to_repo}`);
      
      // List repository files
      console.log("\n3. Checking repository contents...");
      const client = gitlabClient.getClient();
      
      try {
        const treeResponse = await client.get(
          `/projects/${repository.id}/repository/tree`
        );
        
        console.log("\nRepository files:");
        const items = treeResponse.data as Array<{ path: string; type: string }>;
        items.forEach((item) => {
          console.log(`  - ${item.path} (${item.type})`);
        });
        
        // Read README content
        const readmeResponse = await client.get(
          `/projects/${repository.id}/repository/files/README.md/raw`,
          {
            params: { ref: "main" },
          }
        );
        
        console.log("\nREADME.md content preview:");
        console.log("---");
        console.log(readmeResponse.data.substring(0, 500) + "...");
        console.log("---");
        
      } catch (error) {
        console.error("Failed to list repository contents:", error);
      }
      
      // Optionally delete the test repository
      console.log("\n4. Cleaning up...");
      const readline = await import("readline");
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      
      rl.question(
        "Do you want to delete the test repository? (y/n): ",
        async (answer: string) => {
          if (answer.toLowerCase() === "y") {
            try {
              await client.delete(`/projects/${repository.id}`);
              console.log("✓ Test repository deleted");
            } catch (error) {
              console.error("Failed to delete repository:", error);
            }
          } else {
            console.log("Repository kept. You can delete it manually later.");
          }
          rl.close();
          process.exit(0);
        }
      );
    } else {
      console.log("❌ Failed to create repository");
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
testGitLabRepository();