//Send order details to backend
async function postOrder(orderData) {
    try {
      const response = await fetch('https://cst-3144-coursework-backend.onrender.com/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      return await response.json();
    } catch (error) {
        console.error("postOrder error:", error);
        throw error;
    }
}