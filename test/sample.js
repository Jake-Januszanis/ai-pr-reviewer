


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