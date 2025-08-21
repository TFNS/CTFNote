import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function testGitLabConnection() {
  console.log("=== Testing GitLab Connection ===\n");
  
  const GITLAB_URL = process.env.GITLAB_URL || "https://gitlab.com";
  const GITLAB_TOKEN = process.env.GITLAB_PERSONAL_ACCESS_TOKEN;
  const GITLAB_GROUP = process.env.GITLAB_GROUP_PATH;
  
  console.log(`GitLab URL: ${GITLAB_URL}`);
  console.log(`GitLab Token: ${GITLAB_TOKEN ? "***" + GITLAB_TOKEN.slice(-4) : "NOT SET"}`);
  console.log(`GitLab Group: ${GITLAB_GROUP || "NOT SET"}`);
  console.log("");
  
  if (!GITLAB_TOKEN) {
    console.error("❌ GITLAB_PERSONAL_ACCESS_TOKEN is not set in environment");
    console.log("\nTo create a GitLab personal access token:");
    console.log("1. Go to GitLab -> Settings -> Access Tokens");
    console.log("2. Create a token with 'api' scope");
    console.log("3. Set it as GITLAB_PERSONAL_ACCESS_TOKEN in your .env file");
    process.exit(1);
  }
  
  try {
    // Test authentication
    console.log("1. Testing authentication...");
    const userResponse = await axios.get(`${GITLAB_URL}/api/v4/user`, {
      headers: {
        "PRIVATE-TOKEN": GITLAB_TOKEN,
      },
    });
    
    const user = userResponse.data;
    console.log(`✓ Authenticated as: ${user.username} (${user.name})`);
    console.log(`  Email: ${user.email}`);
    console.log(`  ID: ${user.id}`);
    
    // Test group access if specified
    if (GITLAB_GROUP) {
      console.log(`\n2. Testing group access: ${GITLAB_GROUP}...`);
      
      try {
        const groupResponse = await axios.get(
          `${GITLAB_URL}/api/v4/groups/${encodeURIComponent(GITLAB_GROUP)}`,
          {
            headers: {
              "PRIVATE-TOKEN": GITLAB_TOKEN,
            },
          }
        );
        
        const group = groupResponse.data;
        console.log(`✓ Group found: ${group.full_path}`);
        console.log(`  Name: ${group.name}`);
        console.log(`  ID: ${group.id}`);
        console.log(`  Visibility: ${group.visibility}`);
        
      } catch (error: unknown) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 404) {
          console.error(`❌ Group not found: ${GITLAB_GROUP}`);
          console.log("\nMake sure:");
          console.log("1. The group path is correct (use full path like 'myorg/mygroup')");
          console.log("2. You have access to the group");
        } else {
          throw error;
        }
      }
    } else {
      console.log("\n2. No group specified - repositories will be created in your personal namespace");
    }
    
    // Test repository creation permissions
    console.log("\n3. Testing repository creation permissions...");
    const testRepoName = `test-permissions-${Date.now()}`;
    
    try {
      const createResponse = await axios.post(
        `${GITLAB_URL}/api/v4/projects`,
        {
          name: testRepoName,
          visibility: "private",
        },
        {
          headers: {
            "PRIVATE-TOKEN": GITLAB_TOKEN,
            "Content-Type": "application/json",
          },
        }
      );
      
      const repo = createResponse.data;
      console.log(`✓ Can create repositories`);
      console.log(`  Created test repo: ${repo.path_with_namespace}`);
      
      // Delete the test repository
      await axios.delete(`${GITLAB_URL}/api/v4/projects/${repo.id}`, {
        headers: {
          "PRIVATE-TOKEN": GITLAB_TOKEN,
        },
      });
      console.log("  ✓ Deleted test repository");
      
    } catch (error: unknown) {
      console.error("❌ Cannot create repositories");
      const axiosError = error as { response?: { data?: unknown } };
      if (axiosError.response?.data) {
        console.error("Error:", axiosError.response.data);
      }
    }
    
    console.log("\n✅ GitLab connection test successful!");
    console.log("\nYou can now set these environment variables:");
    console.log(`USE_GITLAB=true`);
    console.log(`GITLAB_URL=${GITLAB_URL}`);
    console.log(`GITLAB_PERSONAL_ACCESS_TOKEN=your-token`);
    if (GITLAB_GROUP) {
      console.log(`GITLAB_GROUP_PATH=${GITLAB_GROUP}`);
    }
    
  } catch (error: unknown) {
    console.error("\n❌ Connection test failed:");
    
    const axiosError = error as { 
      response?: { 
        status?: number; 
        data?: unknown 
      };
      message?: string;
    };
    
    if (axiosError.response?.status === 401) {
      console.error("Authentication failed - check your personal access token");
    } else if (axiosError.response?.data) {
      console.error("GitLab API error:", axiosError.response.data);
    } else if (axiosError.message) {
      console.error(axiosError.message);
    } else {
      console.error("Unknown error:", error);
    }
    
    process.exit(1);
  }
}

// Run the test
testGitLabConnection()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });