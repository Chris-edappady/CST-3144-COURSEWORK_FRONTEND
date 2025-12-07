//Searches lessons by query
async function searchLessons(query) {
    try {
        const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(query)}`);
        const lessons = await response.json();
        return lessons.map(item => ({
            ...item,
            image: item.image ? `http://localhost:3000/images/${item.image}` : null
        }));
    } catch (error) {
        console.error("searchLessons error:", error);
        return [];
    }
}