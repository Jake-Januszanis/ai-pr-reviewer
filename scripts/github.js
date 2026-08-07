
const COMMENT_MARKER = "<!-- AI_PR_REVIEW -->"; // Hidden marker to identify the AI-generated comment

export async function publishPRReview(review) {

    const comments = await getPRComments();
    const aiComment = findAIComment(comments);
    
    if (aiComment) {
        await updatePRComment(aiComment.id, review)
    } else {
        await createPRComment(review)
    }

}

export async function createPRComment(review) {
    const { githubToken, prNumber, owner, repo } = getGitHubConfig();
    
    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`
    const commentBody = `${COMMENT_MARKER}\n\n${review}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body: commentBody
        })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to post comment on PR: ${error.message}`);
    }

}

export async function updatePRComment(commentId, review){
    const { githubToken, prNumber, owner, repo } = getGitHubConfig();

    const url = `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}`;
    const commentBody = `${COMMENT_MARKER}\n\n${review}`;

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body: commentBody
        })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to update comment on PR: ${error.message}`);
    }

}



export async function getPRComments() {
    const { githubToken, prNumber, owner, repo } = getGitHubConfig();

    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;

    const response = await fetch(url, {
        headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to retrieve PR comments: ${error.message}`);
    }

    return await response.json();

}


function findAIComment(comments) {
    return comments.find((comment) => {
        return comment.user.login === "github-actions[bot]" &&
        typeof comment.body === "string" &&
        comment.body.includes(COMMENT_MARKER)
    })
}

function getGitHubConfig() {
    if (!process.env.GITHUB_REPOSITORY) {
        throw new Error("GITHUB_REPOSITORY environment variable is required.");
    }

    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    return {
        githubToken: process.env.GITHUB_TOKEN,
        prNumber: process.env.PR_NUMBER,
        owner,
        repo
    };
}