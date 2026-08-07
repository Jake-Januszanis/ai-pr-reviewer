import fs from "fs";
import { execSync } from "child_process";
import dotenv from 'dotenv';
import OpenAI from "openai";
import { publishPRReview } from "./github.js";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function main() {
    const prompt = fs.readFileSync("prompts/review.md", "utf-8");
    const diff = getDiff();

    if (!diff.trim()) {
        console.log("No changes found to review.");
        return;
    }

    const review = await reviewDiff(prompt, diff);
    await publishPRReview(review);
}

main().catch(console.error);



function getDiff() {
    const baseBranch = process.env.BASE_BRANCH || "origin/main";

    const diffCommand = 
        process.env.BASE_SHA && process.env.HEAD_SHA 
            ? `git diff ${process.env.BASE_SHA} ${process.env.HEAD_SHA}`
            : `git diff ${baseBranch}...HEAD`

    try {
        return execSync(diffCommand, {
            encoding: "utf-8"
        });
    } catch (error) {
        throw new Error(`Failed to generate git diff using "${diffCommand}": ${error.message}`);
    }

}

async function reviewDiff(prompt, diff) {

    const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: [
            { role: "system", content: prompt },
            { role: "user", content: diff}
        ]
    })

    return response.output_text;
}