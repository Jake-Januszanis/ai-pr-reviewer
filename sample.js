function filterAndSort(data) {
    let filtered = [];
    let index = 0;
    
    for (let i = 0; i < data.length; i++) {
        if (data[i].active) {
            filtered[index] = data[i];
            index = index + 1;
        }
    }
    
    filtered.sort((a, b) => b.score - a.score);
    
    if (filtered) return filtered;
}

function sumActiveScores(items) {
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        if (!items[i].active) continue;
        if (typeof items[i].score !== "number") continue;
        total += items[i].score;
    }

    if (total) return total;
    return 0;
}