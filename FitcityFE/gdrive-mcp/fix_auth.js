import { authenticate } from "@google-cloud/local-auth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentialsPath = path.join(__dirname, ".gdrive-server-credentials.json");
const oauthPath = path.join(__dirname, "credentials.json");

async function authenticateAndSaveCredentials() {
    console.log("Launching auth flow…");
    console.log("Using OAuth path:", oauthPath);

    const auth = await authenticate({
        keyfilePath: oauthPath,
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    fs.writeFileSync(credentialsPath, JSON.stringify(auth.credentials));
    console.log("Credentials saved to:", credentialsPath);
    console.log("You can now run the server.");
}

authenticateAndSaveCredentials().catch(err => {
    console.error("Auth failed:", err);
    process.exit(1);
});
