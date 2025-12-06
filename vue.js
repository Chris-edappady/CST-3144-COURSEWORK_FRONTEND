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
        // Fetch lessons from backend
        fetch('http://localhost:3000/api/lessons')
        .then(response => response.json())
        .then(data => {
        this.lessons = data;
        })
        .catch(err => console.error('Error fetching lessons:', err));  
      },
      computed: {
        //Sorts the lessons 
        sortedLessons() {
          // filter by searchQuery
          const q = (this.searchQuery || '').trim().toLowerCase();
          let arr = this.lessons.slice();
          if (q)  {
            arr = arr.filter(l => {
              const s = (l.subject || '').toString().toLowerCase();
              return s.includes(q)
            });
          }

          const key = this.sortKey;
          const dir = this.sortDir === 'asc' ? 1 : -1;

          const getValue = (lesson) => {
            if (!lesson) return null;
            if (key === 'spaces') return this.remainingSpaces(lesson);
            return typeof lesson[key] !== 'undefined' ? lesson[key] : null;
          };

          arr.sort((a,b) =>  {
            const va = getValue(a);  
            const vb = getValue(b);
            
            //handle nulls
            if (va === null && vb === null) return 0;
            if (va === null) return 1 * dir;
            if (vb === null) return -1 * dir;

            //compare if both are numeric
            const aNum = Number(va);
            const bNum = Number(vb);
            const bothNumeric = !Number.isNaN(aNum) && !Number.isNaN(bNum);

            if (bothNumeric) {
              if (aNum > bNum) return 1 * dir;
              if (aNum < bNum) return -1 * dir;
              return 0;
            }

            //compare if string
            const sa = String(va).toLowerCase();
            const sb = String(vb).toLowerCase();
            return sa.localeCompare(sb) * dir;
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
            return sum + (lesson ? lesson.price : 0);  
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
          return Math.max(0, lesson.spaces - used);  
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
        //Get lesson by ID with fallback
        lessonById(id) { return this.lessons.find(l => l.id === +id) || { subject:'Unknown', location:'', price:0 }; },
        // Remove one instance of item from cart
        removeOneFromCart(id) {
          const idx = this.cart.indexOf(+id);
          if (idx !== -1) this.cart.splice(idx, 1);
        },
        //Submits order and resets
        checkoutSubmit() {  
          if (!this.canCheckout) return;  
          alert('Order submitted — Thank you!');  
          this.cart = [];  
          this.order = { name: '', phone: '' };  
          this.showProductPage = true;  
        },
      }
    });