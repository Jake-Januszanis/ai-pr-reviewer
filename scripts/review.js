import fs from "fs";
import { execSync } from "child_process";
import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const baseBranch = process.env.BASE_BRANCH || "origin/main";

async function main() {
    const prompt = fs.readFileSync("prompts/review.md", "utf-8");
    const diff = getDIff();

    if (!diff.trim()) {
        console.log("No changes found to review.");
        return;
    }

    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
            { role: "system", content: prompt },
            { role: "user", content: diff}
        ]
    })
    console.log(response.output_text)
}

main().catch(console.error);



function getDiff() {
    const baseBranch = process.env.BASE_BRANCH || "origin/main";

    const diffCommand = 
        process.env.BASE_SHA && process.env.HEAD_SHA 
            ? `git diff ${process.env.BASE_SHA} ${process.env.HEAD_SHA}`
            : `git diff ${baseBranch}...HEAD`

    console.log(`Using diff command: ${diffCommand}`);

    try {
        return execSync(diffCommand, {
            encoding: "utf-8"
        });
    } catch (error) {
        throw new Error(`Failed to generate git diff using "${diffCommand}": ${error.message}`);
    }

}