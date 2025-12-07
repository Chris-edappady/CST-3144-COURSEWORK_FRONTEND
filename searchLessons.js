//Searches lessons by query
async function searchLessons(query) {
    try {
        const response = await fetch(`https://cst-3144-coursework-backend.onrender.com/search?query=${encodeURIComponent(query)}`);
        const lessons = await response.json();
        return lessons.map(item => ({
            ...item,
            image: item.image ? `https://cst-3144-coursework-backend.onrender.com/images/${item.image}` : null
        }));
    } catch (error) {
        console.error("searchLessons error:", error);
        return [];
    }
}