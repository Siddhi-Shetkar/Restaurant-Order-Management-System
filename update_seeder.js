const fs = require('fs');
const path = require('path');

const seederPath = path.join(__dirname, 'server', 'seeder-logic.js');
let seederContent = fs.readFileSync(seederPath, 'utf8');

const imageMap = {
  'Idli Sambar': '/images/idli-sambar.jpg',
  'Masala Dosa': '/images/masala-dosa.jpg',
  'Vada Sambar': '/images/vada-sambar.jpg',
  'Poori Bhaji': '/images/poori-bhaji.jpg',
  'Aloo Paratha': '/images/aloo-paratha.jpg',
  'Upma': '/images/upma.jpg',
  'Plain Dosa': '/images/plain-dosa.jpg',
  'Paneer Dosa': '/images/paneer-dosa.jpg',
  'Uttapam': '/images/uttapam.jpg',
  'Pongal': '/images/pongal.jpg',
  'Paneer Tikka': '/images/paneer-tikka.jpg',
  'Chicken 65': '/images/chicken-65.jpg',
  'Gobi Manchurian': '/images/gobi-manchuria.jpg',
  'Chicken Tikka': '/images/chicken-tikka.jpg',
  'Chilli Paneer': '/images/chilli-paneer.jpg',
  'Crispy Corn': '/images/crispy-corn.jpg',
  'Butter Chicken': '/images/butter-chicken.jpg',
  'Paneer Butter Masala': '/images/paneer-butter-masala.jpg',
  'Dal Makhani': '/images/dal-makhani.jpg',
  'Kadai Paneer': '/images/kadai-paneer.jpg',
  'Chicken Curry': '/images/chicken-curry.jpg',
  'Palak Paneer': '/images/palak-paneer.jpg',
  'Rajma Masala': '/images/rajma-masala.jpg',
  'Chole Bhature': '/images/chole-bhature.jpg',
  'Mixed Vegetable Curry': '/images/mixed-vegetable curry.jpg',
  'Hyderabadi Chicken Biryani': '/images/hyderabadi-chicken-biryani.jpg',
  'Mutton Biryani': '/images/mutton-biryani.jpg',
  'Veg Dum Biryani': '/images/veg-dum-biryani.jpg',
  'Paneer Biryani': '/images/paneer-biryani.jpg',
  'Egg Biryani': '/images/egg-biryani.jpg',
  'Classic Chicken Burger': '/images/class-chicken-burger.jpg',
  'Veggie Supreme Burger': '/images/veg-supreme-burger.jpg',
  'Margherita Pizza': '/images/margherita-pizza.jpg',
  'Pepperoni Pizza': '/images/peperoni-pizza.jpg',
  'Peri Peri Fries': '/images/peri peri fries.jpg',
  'Chicken Wrap': '/images/chicken-wrap.jpg',
  'Paneer Kati Roll': '/images/paneer-kati-roll.jpg',
  'Hakka Noodles': '/images/hakka-noodles.jpg',
  'Schezwan Noodles': '/images/schezwan-noodles.jpg',
  'Veg Fried Rice': '/images/veg-fried rice.jpg',
  'Chicken Fried Rice': '/images/chicken fried rice.jpg',
  'Veg Manchurian': '/images/veg-manchuria.jpg',
  'Spring Rolls': '/images/spring-roll.jpg',
  'Punjabi Samosa (2 pcs)': '/images/punjabi-samosa.jpg',
  'Vada Pav': '/images/vada-pav.jpg',
  'Onion Pakoda': '/images/onion-pakoda.jpg',
  'Paneer Pakoda': '/images/paneer-pakoda.jpg',
  'Club Sandwich': '/images/club-sandwich.jpg',
  'Chicken Sandwich': '/images/chicken-sandwich.jpg',
  'Gulab Jamun (2 pcs)': '/images/gulab-jamun.jpg',
  'Rasmalai (2 pcs)': '/images/rasmalai.jpg',
  'Sizzling Brownie with Ice Cream': '/images/brownie-with-icecream.jpg',
  'Mango Kulfi': '/images/mango-kulfi.jpg',
  'Masala Chai': '/images/masala chai.jpg',
  'Filter Coffee': '/images/filter-coffee.jpg',
  'Mango Lassi': '/images/mango-lassi.jpg',
  'Cold Coffee with Ice Cream': '/images/cold-coffee.jpg',
  'Virgin Mojito': '/images/virgin-mojito.jpg',
  'Fresh Lime Soda': '/images/fresh-lime-soda.jpg',
  'Oreo Milkshake': '/images/oreo milkshake.jpg'
};

// 1. Replace imageUrls
Object.keys(imageMap).forEach(key => {
  const regex = new RegExp(`({ name: '${key.replace(/([()])/g, '\\$1')}', [^]+? imageUrl: )'[^]+?'`);
  seederContent = seederContent.replace(regex, `$1'${imageMap[key]}'`);
});

// 2. Fix createdItems[0] and createdItems[31] -> find by name
seederContent = seederContent.replace(
  /const item1 = createdItems\[0\]; \/\/ Idli Sambar\s+const item2 = createdItems\[31\]; \/\/ Masala Chai/,
  `const item1 = createdItems.find(i => i.name === 'Idli Sambar');
    const item2 = createdItems.find(i => i.name === 'Masala Chai');`
);

fs.writeFileSync(seederPath, seederContent);
console.log('Done replacing seeder content!');
