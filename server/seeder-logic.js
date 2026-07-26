const User = require('./models/User');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');
const Notification = require('./models/Notification');

const importData = async () => {
  try {
    await Order.deleteMany();
    await Table.deleteMany();
    await MenuItem.deleteMany();
    await User.deleteMany();
    await Notification.deleteMany();

    // Users
    const createdUsers = await User.insertMany([
      { name: 'Admin Manager', email: 'manager@demo.com', password: 'password123', role: 'Manager' },
      { name: 'Kitchen Staff', email: 'kitchen@demo.com', password: 'password123', role: 'Kitchen Staff' },
      { name: 'John Customer', email: 'customer@demo.com', password: 'password123', role: 'Customer' },
    ]);

    const customerId = createdUsers[2]._id;

    // Menu Items - Huge Catalog
    const sampleItems = [
      // Breakfast
      { name: 'Idli Sambar', description: 'Steamed rice cakes served with lentil soup and chutney.', price: 120, category: 'Breakfast', mealTime: ['Breakfast'], imageUrl: 'https://images.unsplash.com/photo-1680359871322-aabe6b33eff5?q=80&w=1169&auto=format&fit=crop', isVegetarian: true, preparationTime: 10, isBestseller: true, rating: 4.8, reviewCount: 340 },
      { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato curry.', price: 150, category: 'Breakfast', mealTime: ['Breakfast', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/masala-dosa-1.jpg', isVegetarian: true, preparationTime: 15, isBestseller: true, rating: 4.9, reviewCount: 512 },
      { name: 'Vada Sambar', description: 'Deep-fried lentil donuts served with sambar.', price: 130, category: 'Breakfast', mealTime: ['Breakfast', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/medu-vada-2.jpg', isVegetarian: true, preparationTime: 12, rating: 4.6, reviewCount: 189 },
      { name: 'Poori Bhaji', description: 'Puffed deep-fried bread served with a flavorful potato curry.', price: 140, category: 'Breakfast', mealTime: ['Breakfast'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/05/poori-bhaji-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.7, reviewCount: 205 },
      { name: 'Aloo Paratha', description: 'Whole wheat flatbread stuffed with spiced potatoes, served with yogurt and pickle.', price: 160, category: 'Breakfast', mealTime: ['Breakfast', 'Lunch'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2012/11/aloo-paratha-recipe-3.jpg', isVegetarian: true, preparationTime: 20, rating: 4.8, reviewCount: 430 },
      { name: 'Upma', description: 'Thick porridge made from dry roasted semolina, tempered with spices.', price: 110, category: 'Breakfast', mealTime: ['Breakfast'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2017/09/upma-recipe-1.jpg', isVegetarian: true, preparationTime: 10, rating: 4.3, reviewCount: 95 },
      { name: 'Plain Dosa', description: 'Thin and crispy South Indian crepe made from fermented rice and lentil batter.', price: 100, category: 'Breakfast', mealTime: ['Breakfast', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2018/12/dosa-recipe-1.jpg', isVegetarian: true, preparationTime: 10, rating: 4.5, reviewCount: 310 },
      { name: 'Paneer Dosa', description: 'Crispy dosa filled with spiced paneer scramble.', price: 180, category: 'Breakfast', mealTime: ['Breakfast', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2016/09/paneer-dosa-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.7, reviewCount: 150 },
      { name: 'Uttapam', description: 'Thick pancake made from dosa batter, topped with mixed veggies.', price: 140, category: 'Breakfast', mealTime: ['Breakfast'], imageUrl: 'https://www.cookingcarnival.com/wp-content/uploads/2022/02/Uttapam-recipe.jpg', isVegetarian: true, preparationTime: 12, rating: 4.4, reviewCount: 180 },
      { name: 'Pongal', description: 'Comforting South Indian dish made with rice, yellow lentils, and black pepper.', price: 130, category: 'Breakfast', mealTime: ['Breakfast'], imageUrl: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/pongal-ven-pongal-500x500.jpg', isVegetarian: true, preparationTime: 15, rating: 4.6, reviewCount: 220 },

      // Starters (Veg & Non-Veg)
      { name: 'Paneer Tikka', description: 'Marinated cottage cheese cubes grilled to perfection.', price: 280, category: 'Starters', mealTime: ['Lunch', 'Dinner', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/05/paneer-tikka-recipe-1.jpg', isVegetarian: true, preparationTime: 20, isBestseller: true, rating: 4.7, reviewCount: 310 },
      { name: 'Chicken 65', description: 'Spicy, deep-fried chicken pieces with curry leaves and green chilies.', price: 320, category: 'Starters', mealTime: ['Lunch', 'Dinner', 'Evening Snacks'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-65.jpg', isVegetarian: false, preparationTime: 20, isBestseller: true, rating: 4.8, reviewCount: 420 },
      { name: 'Gobi Manchurian', description: 'Crispy cauliflower florets tossed in a spicy, sweet, and tangy sauce.', price: 240, category: 'Starters', mealTime: ['Lunch', 'Dinner', 'Evening Snacks'], imageUrl: 'https://palatesdesire.com/wp-content/uploads/2022/09/dry-gobi-manchurian-recipe@palates-desire.jpg', isVegetarian: true, preparationTime: 18, rating: 4.6, reviewCount: 215 },
      { name: 'Chicken Tikka', description: 'Boneless chicken marinated in yogurt and spices, grilled in a tandoor.', price: 340, category: 'Starters', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://sinfullyspicy.com/wp-content/uploads/2014/03/1200-by-1800-images-2.jpg', isVegetarian: false, preparationTime: 25, rating: 4.7, reviewCount: 290 },
      { name: 'Chilli Paneer', description: 'Cottage cheese cubes tossed with bell peppers and onions in a spicy sauce.', price: 270, category: 'Starters', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2012/05/chilli-paneer-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.5, reviewCount: 180 },
      { name: 'Crispy Corn', description: 'Deep-fried corn kernels seasoned with salt, pepper, and spices.', price: 220, category: 'Starters', mealTime: ['Evening Snacks'], imageUrl: 'https://smithakalluraya.com/wp-content/uploads/2018/01/crispy-corn-recipe.jpg', isVegetarian: true, preparationTime: 12, rating: 4.4, reviewCount: 140 },

      // Main Course - North Indian
      { name: 'Butter Chicken', description: 'Tender chicken cooked in a rich, creamy, and mildly spiced tomato gravy.', price: 450, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.kitchensanctuary.com/wp-content/uploads/2019/09/Butter-Chicken-square-FS-38.jpg', isVegetarian: false, preparationTime: 30, isBestseller: true, rating: 4.9, reviewCount: 850 },
      { name: 'Paneer Butter Masala', description: 'Cottage cheese in a creamy and slightly sweet tomato-based gravy.', price: 350, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2020/01/paneer-butter-masala-1.jpg', isVegetarian: true, preparationTime: 25, isBestseller: true, rating: 4.8, reviewCount: 620 },
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils and kidney beans with butter and cream.', price: 280, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/01/dal-makhani-recipe-1.jpg', isVegetarian: true, preparationTime: 25, rating: 4.7, reviewCount: 410 },
      { name: 'Kadai Paneer', description: 'Spicy cottage cheese curry cooked with bell peppers and freshly ground spices.', price: 330, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/08/kadai-paneer-recipe-1.jpg', isVegetarian: true, preparationTime: 20, rating: 4.6, reviewCount: 275 },
      { name: 'Chicken Curry', description: 'Traditional homestyle chicken curry cooked with aromatic spices.', price: 380, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Curry-recipe.jpg', isVegetarian: false, preparationTime: 30, rating: 4.5, reviewCount: 310 },
      { name: 'Palak Paneer', description: 'Cottage cheese cubes in a smooth spinach puree with mild spices.', price: 320, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/palak-paneer-3.jpg', isVegetarian: true, preparationTime: 25, rating: 4.4, reviewCount: 190 },
      { name: 'Rajma Masala', description: 'Red kidney beans cooked in a thick gravy of aromatic spices.', price: 260, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/rajma-recipe-1.jpg', isVegetarian: true, preparationTime: 25, rating: 4.6, reviewCount: 310 },
      { name: 'Chole Bhature', description: 'Spicy chickpea curry served with fried fluffy bread.', price: 220, category: 'North Indian', mealTime: ['Breakfast', 'Lunch'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/08/chole-bhature-1.jpg', isVegetarian: true, preparationTime: 20, isBestseller: true, rating: 4.8, reviewCount: 520 },
      { name: 'Mixed Vegetable Curry', description: 'Seasonal vegetables cooked in a rich, mildly spiced tomato gravy.', price: 270, category: 'North Indian', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2017/10/mixed-vegetable-curry-recipe-1.jpg', isVegetarian: true, preparationTime: 20, rating: 4.5, reviewCount: 240 },

      // Biryani
      { name: 'Hyderabadi Chicken Biryani', description: 'Aromatic basmati rice cooked with tender marinated chicken and rich spices.', price: 380, category: 'Biryani', mealTime: ['Lunch', 'Dinner', 'Late Night'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Hyderabadi-chicken-Biryani.jpg', isVegetarian: false, preparationTime: 40, isBestseller: true, rating: 4.9, reviewCount: 1200 },
      { name: 'Mutton Biryani', description: 'Slow-cooked fragrant rice layered with succulent pieces of mutton.', price: 480, category: 'Biryani', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/02/shutterstock_1027150114.jpg', isVegetarian: false, preparationTime: 45, rating: 4.8, reviewCount: 650 },
      { name: 'Veg Dum Biryani', description: 'Mixed vegetables and paneer cooked with fragrant rice and spices.', price: 290, category: 'Biryani', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/veg-biryani-1.jpg', isVegetarian: true, preparationTime: 35, rating: 4.5, reviewCount: 380 },
      { name: 'Paneer Biryani', description: 'Flavorful basmati rice layered with spiced paneer cubes.', price: 320, category: 'Biryani', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/paneer-biryani-1.jpg', isVegetarian: true, preparationTime: 35, rating: 4.6, reviewCount: 290 },
      { name: 'Egg Biryani', description: 'Spiced basmati rice with boiled, roasted eggs.', price: 260, category: 'Biryani', mealTime: ['Lunch', 'Dinner', 'Late Night'], imageUrl: 'https://www.yummytummyaarthi.com/wp-content/uploads/2014/11/1-43.jpg', isVegetarian: false, preparationTime: 30, rating: 4.4, reviewCount: 150 },

      // Fast Food / Snacks
      { name: 'Classic Chicken Burger', description: 'Juicy chicken patty with lettuce, tomato, and cheese in a toasted bun.', price: 250, category: 'Burgers', mealTime: ['Evening Snacks', 'Late Night'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2022/03/Chicken-Burger-min.jpg', isVegetarian: false, preparationTime: 15, isBestseller: true, rating: 4.7, reviewCount: 540 },
      { name: 'Veggie Supreme Burger', description: 'Crispy vegetable patty with fresh greens and creamy mayo.', price: 190, category: 'Burgers', mealTime: ['Evening Snacks', 'Late Night'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2016/11/veg-burger-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.5, reviewCount: 220 },
      { name: 'Margherita Pizza', description: 'Classic pizza with fresh tomato sauce, mozzarella cheese, and basil.', price: 350, category: 'Pizza', mealTime: ['Dinner', 'Evening Snacks', 'Late Night'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2020/11/pizza-recipe-2.jpg', isVegetarian: true, preparationTime: 20, rating: 4.6, reviewCount: 480 },
      { name: 'Pepperoni Pizza', description: 'Loaded with cheese and premium spicy pepperoni slices.', price: 450, category: 'Pizza', mealTime: ['Dinner', 'Late Night'], imageUrl: 'https://kitchenmatics.com/wp-content/uploads/2020/09/pepperoni-pizza.jpg', isVegetarian: false, preparationTime: 20, isBestseller: true, rating: 4.9, reviewCount: 710 },
      { name: 'Peri Peri Fries', description: 'Crispy french fries tossed in spicy peri peri seasoning.', price: 150, category: 'Fast Food', mealTime: ['Evening Snacks', 'Late Night'], imageUrl: 'https://www.yummytummyaarthi.com/wp-content/uploads/2021/11/1-6.jpg', isVegetarian: true, preparationTime: 10, rating: 4.7, reviewCount: 390 },
      { name: 'Chicken Wrap', description: 'Grilled chicken, veggies, and sauce wrapped in a soft tortilla.', price: 220, category: 'Rolls & Wraps', mealTime: ['Lunch', 'Evening Snacks'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Roll.jpg', isVegetarian: false, preparationTime: 12, rating: 4.6, reviewCount: 230 },
      { name: 'Paneer Kati Roll', description: 'Spiced paneer wrapped in a flaky paratha.', price: 200, category: 'Rolls & Wraps', mealTime: ['Lunch', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/05/paneer-kathi-roll-recipe-1.jpg', isVegetarian: true, preparationTime: 12, rating: 4.5, reviewCount: 190 },

      // Chinese / Asian
      { name: 'Hakka Noodles', description: 'Wok-tossed noodles with shredded vegetables and soy sauce.', price: 220, category: 'Chinese', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/hakka-noodles-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.4, reviewCount: 175 },
      { name: 'Schezwan Noodles', description: 'Spicy noodles tossed in fiery schezwan sauce.', price: 230, category: 'Chinese', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/09/schezwan-noodles-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.6, reviewCount: 190 },
      { name: 'Veg Fried Rice', description: 'Classic wok-fried rice with finely chopped vegetables.', price: 240, category: 'Chinese', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/veg-fried-rice-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.5, reviewCount: 220 },
      { name: 'Chicken Fried Rice', description: 'Classic wok-fried rice with chicken chunks, egg, and vegetables.', price: 260, category: 'Chinese', mealTime: ['Lunch', 'Dinner'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Fried-Rice.jpg', isVegetarian: false, preparationTime: 15, isBestseller: true, rating: 4.7, reviewCount: 350 },
      { name: 'Veg Manchurian', description: 'Fried vegetable balls in a spicy, sweet, and tangy Chinese sauce.', price: 240, category: 'Chinese', mealTime: ['Lunch', 'Dinner', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/veg-manchurian-1.jpg', isVegetarian: true, preparationTime: 20, rating: 4.5, reviewCount: 210 },
      { name: 'Spring Rolls', description: 'Crispy fried rolls stuffed with savory vegetables.', price: 180, category: 'Starters', mealTime: ['Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/05/spring-rolls-1.jpg', isVegetarian: true, preparationTime: 12, rating: 4.3, reviewCount: 145 },

      // Evening Snacks (Indian)
      { name: 'Punjabi Samosa (2 pcs)', description: 'Crispy pastry filled with spiced potatoes and peas.', price: 60, category: 'Evening Snacks', mealTime: ['Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/08/samosa-recipe-1.jpg', isVegetarian: true, preparationTime: 10, isBestseller: true, rating: 4.8, reviewCount: 650 },
      { name: 'Vada Pav', description: 'Spicy potato dumpling inside a soft bread bun with chutneys.', price: 50, category: 'Evening Snacks', mealTime: ['Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2018/12/vada-pav-recipe-1.jpg', isVegetarian: true, preparationTime: 5, rating: 4.7, reviewCount: 420 },
      { name: 'Onion Pakoda', description: 'Crispy deep-fried onion fritters made with gram flour.', price: 120, category: 'Evening Snacks', mealTime: ['Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/onion-pakoda-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.6, reviewCount: 180 },
      { name: 'Paneer Pakoda', description: 'Cottage cheese dipped in gram flour batter and deep-fried.', price: 150, category: 'Evening Snacks', mealTime: ['Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/07/paneer-pakoda-recipe-1.jpg', isVegetarian: true, preparationTime: 15, rating: 4.6, reviewCount: 120 },
      { name: 'Club Sandwich', description: 'Three-layer sandwich with vegetables, cheese, and mayo.', price: 180, category: 'Evening Snacks', mealTime: ['Evening Snacks', 'Breakfast'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/05/veg-club-sandwich-recipe-1.jpg', isVegetarian: true, preparationTime: 12, rating: 4.5, reviewCount: 310 },
      { name: 'Chicken Sandwich', description: 'Grilled chicken sandwich with fresh lettuce and mayo.', price: 210, category: 'Evening Snacks', mealTime: ['Evening Snacks'], imageUrl: 'https://www.licious.in/blog/wp-content/uploads/2021/07/Chicken-sandwich-600x600.jpg', isVegetarian: false, preparationTime: 12, rating: 4.7, reviewCount: 260 },

      // Desserts
      { name: 'Gulab Jamun (2 pcs)', description: 'Soft, deep-fried milk dumplings soaked in cardamom sugar syrup.', price: 90, category: 'Desserts', mealTime: ['Desserts', 'Late Night'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2019/10/gulab-jamun-recipe-1.jpg', isVegetarian: true, preparationTime: 5, isBestseller: true, rating: 4.9, reviewCount: 820 },
      { name: 'Rasmalai (2 pcs)', description: 'Soft cottage cheese patties immersed in chilled creamy saffron milk.', price: 140, category: 'Desserts', mealTime: ['Desserts'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/10/rasmalai-recipe-1.jpg', isVegetarian: true, preparationTime: 5, rating: 4.8, reviewCount: 510 },
      { name: 'Sizzling Brownie with Ice Cream', description: 'Warm chocolate brownie topped with vanilla ice cream and hot fudge.', price: 220, category: 'Desserts', mealTime: ['Desserts', 'Late Night'], imageUrl: 'https://www.yummytummyaarthi.com/wp-content/uploads/2015/07/1-11.jpg', isVegetarian: true, preparationTime: 10, isBestseller: true, rating: 4.9, reviewCount: 630 },
      { name: 'Mango Kulfi', description: 'Traditional Indian dense mango ice cream.', price: 120, category: 'Desserts', mealTime: ['Desserts'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/04/mango-kulfi-recipe-1.jpg', isVegetarian: true, preparationTime: 5, rating: 4.7, reviewCount: 220 },

      // Beverages & Shakes
      { name: 'Masala Chai', description: 'Indian tea brewed with milk and aromatic spices.', price: 40, category: 'Hot Beverages', mealTime: ['Breakfast', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/masala-chai-1.jpg', isVegetarian: true, preparationTime: 5, isBestseller: true, rating: 4.9, reviewCount: 950 },
      { name: 'Filter Coffee', description: 'Traditional South Indian strong coffee.', price: 60, category: 'Hot Beverages', mealTime: ['Breakfast', 'Evening Snacks'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2013/10/filter-coffee-recipe-1.jpg', isVegetarian: true, preparationTime: 5, rating: 4.8, reviewCount: 420 },
      { name: 'Mango Lassi', description: 'Thick and creamy yogurt-based sweet mango drink.', price: 110, category: 'Beverages', mealTime: ['Lunch', 'Beverages'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/mango-lassi-1.jpg', isVegetarian: true, preparationTime: 5, isBestseller: true, rating: 4.8, reviewCount: 560 },
      { name: 'Cold Coffee with Ice Cream', description: 'Chilled coffee blended with milk and topped with vanilla ice cream.', price: 160, category: 'Milkshakes', mealTime: ['Evening Snacks', 'Beverages'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2014/08/cold-coffee-recipe-1.jpg', isVegetarian: true, preparationTime: 8, rating: 4.7, reviewCount: 390 },
      { name: 'Virgin Mojito', description: 'Refreshing mocktail with mint, lime, and soda.', price: 140, category: 'Mocktails', mealTime: ['Lunch', 'Dinner', 'Beverages'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2018/06/virgin-mojito-recipe-1.jpg', isVegetarian: true, preparationTime: 5, rating: 4.6, reviewCount: 310 },
      { name: 'Fresh Lime Soda', description: 'Sweet or salted tangy lime drink with sparkling water.', price: 90, category: 'Beverages', mealTime: ['Lunch', 'Dinner', 'Beverages'], imageUrl: 'https://www.vegrecipesofindia.com/wp-content/uploads/2015/05/fresh-lime-soda-1.jpg', isVegetarian: true, preparationTime: 5, rating: 4.5, reviewCount: 180 },
      { name: 'Oreo Milkshake', description: 'Thick shake blended with crushed Oreo cookies and chocolate syrup.', price: 180, category: 'Milkshakes', mealTime: ['Evening Snacks', 'Desserts', 'Beverages'], imageUrl: 'https://www.yummytummyaarthi.com/wp-content/uploads/2015/08/1-29.jpg', isVegetarian: true, preparationTime: 10, rating: 4.8, reviewCount: 430 }
    ];

    const createdItems = await MenuItem.insertMany(sampleItems);

    // Tables
    const sampleTables = [
      { tableNumber: 1, capacity: 2 },
      { tableNumber: 2, capacity: 4 },
      { tableNumber: 3, capacity: 4 },
      { tableNumber: 4, capacity: 6 },
      { tableNumber: 5, capacity: 8 }
    ];

    await Table.insertMany(sampleTables);

    // Orders
    const item1 = createdItems[0]; // Idli Sambar
    const item2 = createdItems[31]; // Masala Chai

    const order1 = new Order({
      orderId: 'ORD-1A2B3C',
      customer: customerId,
      orderType: 'Takeaway',
      customerName: 'John',
      contactNumber: '1234567890',
      items: [
        { menuItem: item1._id, name: item1.name, quantity: 2, price: item1.price },
        { menuItem: item2._id, name: item2.name, quantity: 2, price: item2.price }
      ],
      subtotal: 320,
      taxes: 32,
      totalAmount: 352,
      status: 'Pending',
      timeline: [{ status: 'Pending', timestamp: new Date() }]
    });

    await order1.save();
  } catch (error) {
    console.error(`Error in importData: ${error}`);
  }
};

module.exports = importData;
