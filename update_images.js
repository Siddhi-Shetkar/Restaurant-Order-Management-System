const fs = require('fs');

const imageUrls = {
  "Idli Sambar": "https://images.unsplash.com/photo-1680359871322-aabe6b33eff5?q=80&w=1169&auto=format&fit=crop",
  "Masala Dosa": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/masala-dosa-1.jpg",
  "Vada Sambar": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/medu-vada-2.jpg",
  "Poori Bhaji": "https://www.vegrecipesofindia.com/wp-content/uploads/2013/05/poori-bhaji-recipe-1.jpg",
  "Aloo Paratha": "https://www.vegrecipesofindia.com/wp-content/uploads/2012/11/aloo-paratha-recipe-3.jpg",
  "Upma": "https://www.vegrecipesofindia.com/wp-content/uploads/2017/09/upma-recipe-1.jpg",
  "Plain Dosa": "https://www.vegrecipesofindia.com/wp-content/uploads/2018/12/dosa-recipe-1.jpg",
  "Paneer Dosa": "https://www.vegrecipesofindia.com/wp-content/uploads/2016/09/paneer-dosa-recipe-1.jpg",
  "Uttapam": "https://www.cookingcarnival.com/wp-content/uploads/2022/02/Uttapam-recipe.jpg",
  "Pongal": "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/pongal-ven-pongal-500x500.jpg",
  
  "Paneer Tikka": "https://www.vegrecipesofindia.com/wp-content/uploads/2014/05/paneer-tikka-recipe-1.jpg",
  "Chicken 65": "https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-65.jpg",
  "Gobi Manchurian": "https://palatesdesire.com/wp-content/uploads/2022/09/dry-gobi-manchurian-recipe@palates-desire.jpg",
  "Chicken Tikka": "https://sinfullyspicy.com/wp-content/uploads/2014/03/1200-by-1800-images-2.jpg",
  "Chilli Paneer": "https://www.vegrecipesofindia.com/wp-content/uploads/2012/05/chilli-paneer-recipe-1.jpg",
  "Crispy Corn": "https://smithakalluraya.com/wp-content/uploads/2018/01/crispy-corn-recipe.jpg",

  "Butter Chicken": "https://www.kitchensanctuary.com/wp-content/uploads/2019/09/Butter-Chicken-square-FS-38.jpg",
  "Paneer Butter Masala": "https://www.vegrecipesofindia.com/wp-content/uploads/2020/01/paneer-butter-masala-1.jpg",
  "Dal Makhani": "https://www.vegrecipesofindia.com/wp-content/uploads/2015/01/dal-makhani-recipe-1.jpg",
  "Kadai Paneer": "https://www.vegrecipesofindia.com/wp-content/uploads/2013/08/kadai-paneer-recipe-1.jpg",
  "Chicken Curry": "https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Curry-recipe.jpg",
  "Palak Paneer": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/palak-paneer-3.jpg",
  "Rajma Masala": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/rajma-recipe-1.jpg",
  "Chole Bhature": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/08/chole-bhature-1.jpg",
  "Mixed Vegetable Curry": "https://www.vegrecipesofindia.com/wp-content/uploads/2017/10/mixed-vegetable-curry-recipe-1.jpg",

  "Hyderabadi Chicken Biryani": "https://www.licious.in/blog/wp-content/uploads/2020/12/Hyderabadi-chicken-Biryani.jpg",
  "Mutton Biryani": "https://www.licious.in/blog/wp-content/uploads/2022/02/shutterstock_1027150114.jpg",
  "Veg Dum Biryani": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/veg-biryani-1.jpg",
  "Paneer Biryani": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/paneer-biryani-1.jpg",
  "Egg Biryani": "https://www.yummytummyaarthi.com/wp-content/uploads/2014/11/1-43.jpg",

  "Classic Chicken Burger": "https://www.licious.in/blog/wp-content/uploads/2022/03/Chicken-Burger-min.jpg",
  "Veggie Supreme Burger": "https://www.vegrecipesofindia.com/wp-content/uploads/2016/11/veg-burger-recipe-1.jpg",
  "Margherita Pizza": "https://www.vegrecipesofindia.com/wp-content/uploads/2020/11/pizza-recipe-2.jpg",
  "Pepperoni Pizza": "https://kitchenmatics.com/wp-content/uploads/2020/09/pepperoni-pizza.jpg",
  "Peri Peri Fries": "https://www.yummytummyaarthi.com/wp-content/uploads/2021/11/1-6.jpg",
  "Chicken Wrap": "https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Roll.jpg",
  "Paneer Kati Roll": "https://www.vegrecipesofindia.com/wp-content/uploads/2014/05/paneer-kathi-roll-recipe-1.jpg",

  "Hakka Noodles": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/hakka-noodles-recipe-1.jpg",
  "Schezwan Noodles": "https://www.vegrecipesofindia.com/wp-content/uploads/2015/09/schezwan-noodles-recipe-1.jpg",
  "Veg Fried Rice": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/veg-fried-rice-1.jpg",
  "Chicken Fried Rice": "https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Fried-Rice.jpg",
  "Veg Manchurian": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/veg-manchurian-1.jpg",
  "Spring Rolls": "https://www.vegrecipesofindia.com/wp-content/uploads/2015/05/spring-rolls-1.jpg",

  "Punjabi Samosa (2 pcs)": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/08/samosa-recipe-1.jpg",
  "Vada Pav": "https://www.vegrecipesofindia.com/wp-content/uploads/2018/12/vada-pav-recipe-1.jpg",
  "Onion Pakoda": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/onion-pakoda-recipe-1.jpg",
  "Paneer Pakoda": "https://www.vegrecipesofindia.com/wp-content/uploads/2015/07/paneer-pakoda-recipe-1.jpg",
  "Club Sandwich": "https://www.vegrecipesofindia.com/wp-content/uploads/2013/05/veg-club-sandwich-recipe-1.jpg",
  "Chicken Sandwich": "https://www.licious.in/blog/wp-content/uploads/2021/07/Chicken-sandwich-600x600.jpg",

  "Gulab Jamun (2 pcs)": "https://www.vegrecipesofindia.com/wp-content/uploads/2019/10/gulab-jamun-recipe-1.jpg",
  "Rasmalai (2 pcs)": "https://www.vegrecipesofindia.com/wp-content/uploads/2014/10/rasmalai-recipe-1.jpg",
  "Sizzling Brownie with Ice Cream": "https://www.yummytummyaarthi.com/wp-content/uploads/2015/07/1-11.jpg",
  "Mango Kulfi": "https://www.vegrecipesofindia.com/wp-content/uploads/2015/04/mango-kulfi-recipe-1.jpg",

  "Masala Chai": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/07/masala-chai-1.jpg",
  "Filter Coffee": "https://www.vegrecipesofindia.com/wp-content/uploads/2013/10/filter-coffee-recipe-1.jpg",
  "Mango Lassi": "https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/mango-lassi-1.jpg",
  "Cold Coffee with Ice Cream": "https://www.vegrecipesofindia.com/wp-content/uploads/2014/08/cold-coffee-recipe-1.jpg",
  "Virgin Mojito": "https://www.vegrecipesofindia.com/wp-content/uploads/2018/06/virgin-mojito-recipe-1.jpg",
  "Fresh Lime Soda": "https://www.vegrecipesofindia.com/wp-content/uploads/2015/05/fresh-lime-soda-1.jpg",
  "Oreo Milkshake": "https://www.yummytummyaarthi.com/wp-content/uploads/2015/08/1-29.jpg"
};

let content = fs.readFileSync('server/seeder-logic.js', 'utf8');

let replacedCount = 0;
// Replace imageUrls
Object.keys(imageUrls).forEach(name => {
  const newUrl = imageUrls[name];
  // Match exact name in object, and replace its imageUrl
  const regex = new RegExp(`(name:\\s*['"]${name}['"].*?imageUrl:\\s*['"])([^'"]*)(['"])`, 'g');
  let matched = false;
  content = content.replace(regex, (match, p1, p2, p3) => {
    matched = true;
    replacedCount++;
    return p1 + newUrl + p3;
  });
  if (!matched) {
    console.log(`Failed to match: ${name}`);
  }
});

fs.writeFileSync('server/seeder-logic.js', content);
console.log(`Done updating seeder-logic.js! Replaced ${replacedCount} URLs.`);
