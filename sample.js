async function publishComment(comment) {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(comment)
    });

    return response.json();
}

function getRepository(fullName) {
    return fullName.split("/")[1];
}