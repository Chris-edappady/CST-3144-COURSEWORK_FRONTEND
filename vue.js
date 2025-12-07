  //Cart Display logic
    var webstore = new Vue ({
      el: '#app',
      data: {
        sitename: 'Campus Lessons',
        lessons: [],
        cart: [],
        sortKey: 'subject',
        sortDir: 'asc',
        searchQuery: '',
        showProductPage: true,
        order: { name: '', phone: '' } //adding order object
      },
      created() {  
        // Fetch lessons using getLessons
        getLessons()
        .then(data => {
        this.lessons = data;
        })
        .catch(err => console.error('Error fetching lessons:', err));  
      },
      computed: {
        //Sorts the lessons 
        sortedLessons() {
          // filter by searchQuery
          let arr = this.lessons.slice();
          const q = (this.searchQuery || '').trim().toLowerCase();
          if (q)  {
            arr = arr.filter(l => (l.subject || '').toLowerCase().includes(q));
              
          }

          const dir = this.sortDir === 'asc' ? 1 : -1;          
          arr.sort((a,b) =>  {
            let va = this.sortKey === 'spaces' ? this.remainingSpaces(a) : a[this.sortKey]; 
            let vb = this.sortKey === 'spaces' ? this.remainingSpaces(b) : b[this.sortKey];
            
            //handle nulls
            if (va === null) return 1 * dir;
            if (vb === null) return -1 * dir;

            if (!isNaN(va) && !isNaN(vb)) return (va - vb) * dir;
            return String(va).localeCompare(String(vb)) * dir;
          });
          return arr;
        },
        //summary of cart items by ID and quantity  
        cartSummary() {  
          const summary = {};  
          this.cart.forEach(id => { summary[id] = (summary[id] || 0) + 1; });  
          return summary;  
        },
        // Calculate total price of cart  
        cartTotal() {  
          return this.cart.reduce((sum, id) => {  
            const lesson = this.lessons.find(l => l.id === +id);  
            return sum + (lesson ? Number(lesson.price) : 0);  
          }, 0);  
        },
        //Checks for valid name input  
        validName() { return /^[A-Za-z ]+$/.test(this.order.name); },  
        //Checks for valid phone number input  
        validPhone() { return /^[0-9]+$/.test(this.order.phone); },  
        //Checks if checkout is allowed  
        canCheckout() { return this.validName && this.validPhone && this.cart.length > 0; }  
      },
      methods: {
        // Calculate remaining spaces for a lesson  
        remainingSpaces(lesson) {  
          const used = this.cartCount(lesson.id);  
          return Math.max(0, Number(lesson.spaces) - used);  
        },
        // Check if add to cart is possible  
        canAddToCart(lesson) {  
          return this.remainingSpaces(lesson) > 0;  
        },
        //Add lesson ID to cart if available
        addToCart(lesson) {
          if (this.canAddToCart(lesson)) this.cart.push(lesson.id);
        },
        //Counts how many times ID is in the cart
        cartCount(id) { return this.cart.filter(x => x  === id).length; },
        //Toggling between product and checkout pages
        toggleCheckoutPage(){
          this.showProductPage = !this.showProductPage;
        },
        // Returns the lesson object for a given ID.
        lessonById(id) {
          return this.lessons.find(l => l.id === +id) || { subject:'Unknown', location:'', price:0 };
        },
        // Remove one instance of item from cart
        removeOneFromCart(id) {
          const idx = this.cart.indexOf(+id);
          if (idx !== -1) this.cart.splice(idx, 1);
        },
        //Submits order to backend
        async checkoutSubmit() {  
          const orderData = {
            name: this.order.name,
            phone: this.order.phone,
            cart: this.cart
        };

        try{
          const result = await postOrder(orderData);
          if (result.success) {
            alert('Order submitted — Thank you!');
            this.cart = [];
            this.order = { name: '', phone: '' };
            this.showProductPage = true;

            //Refresh lessons to show updated spaces
            this.lessons = await getLessons();
        } else {
          alert('Failed to submit order.');
        }
      } catch (err) {
        console.error('Order error:', err);
        alert('Error submitting order.');
      }
    }
  }
});