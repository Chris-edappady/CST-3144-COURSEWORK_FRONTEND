//Updates remaining spaces for a lesson
async function updateSpaces(lessonId, spaces) {
    try {
        await fetch(`http://localhost:3000/lessons/${lessonId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ spaces })
        });
    } catch (error) {
        console.error("updateSpaces error:", error);
    }
}