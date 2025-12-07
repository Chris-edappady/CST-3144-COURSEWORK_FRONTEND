//Fetches all lessons from backend
async function getLessons() {
  try {
    //Fetches lessons from server
    const response = await fetch('https://cst-3144-coursework-backend.onrender.com/lessons');
    const lessons = await response.json();
    ////Maps each lesson to ensure they are numbers and contain the image URL
    return lessons.map(item => ({
        ...item,
        image: item.image ? `https://cst-3144-coursework-backend.onrender.com/images/${item.image}` : null,
        price: Number(item.price) || 0, //Ensures price is a number, otherwise 0 
        spaces: Number(item.spaces) || 0 //Ensures spaces is a number, otherwise 0
      }));
    } catch (error) {
        console.error("getLessons error:", error);
        return [];
    }
}