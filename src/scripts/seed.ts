// Run with: npx tsx src/scripts/seed.ts
// Or: npm run seed

import { spawn } from "child_process";

async function checkServerRunning(): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:8080/api/seed", {
      method: "HEAD",
    });
    return res.ok || res.status === 405;
  } catch {
    return false;
  }
}

function startServer(): Promise<NodeJS.Timeout> {
  return new Promise((resolve, reject) => {
    console.log("Starting server...");
    const server = spawn("npm", ["run", "dev"], {
      stdio: "inherit",
      shell: true,
    });

    let resolved = false;

    const timeout = setTimeout(async () => {
      if (!resolved) {
        resolved = true;
        const isRunning = await checkServerRunning();
        if (isRunning) {
          resolve(timeout);
        } else {
          reject(new Error("Server failed to start"));
        }
      }
    }, 15000);

    server.on("error", () => {
      clearTimeout(timeout);
      if (!resolved) {
        resolved = true;
        reject(new Error("Failed to start server"));
      }
    });
  });
}

async function seed() {
  const baseUrl = "http://localhost:8080";

  const serverRunning = await checkServerRunning();
  if (!serverRunning) {
    await startServer();
  }

  console.log(`Seeding database via ${baseUrl}/api/seed`);

  try {
    const res = await fetch(`${baseUrl}/api/seed`, { method: "POST" });
    const data = await res.json();
    console.log("Seed result:", JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
