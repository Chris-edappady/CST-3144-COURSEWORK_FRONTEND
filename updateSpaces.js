//Updates remaining spaces for a lesson
async function updateSpaces(lessonId, spaces) {
    try {
        await fetch(`https://cst-3144-coursework-backend.onrender.com/lessons/${lessonId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaces })
        });
    } catch (error) {
        console.error("updateSpaces error:", error);
    }
}