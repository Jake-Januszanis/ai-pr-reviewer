
export async function postCommentOnPR(review) {

    const githubToken = process.env.GITHUB_TOKEN;
    const prNumber = process.env.PR_NUMBER;
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Accept": "application/vnd.github+json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body: review
        })
    })

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to post comment on PR: ${error.message}`);
    }
}