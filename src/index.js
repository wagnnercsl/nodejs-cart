const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];

function getPromotion(products) {
	let categories = [];
	
	products.forEach(product => {
		if(!categories.includes(product.category))
		categories.push(product.category);
	});

	switch(categories.length) {
		case 1:
			return promotions[0];
		case 2:
			return promotions[1];
		case 3:
			return promotions[2];
		case 4:
			return promotions[3];
	}
}

function getRegularPrice(products) {
	return products.reduce((total, product) => { 
		return total + product.regularPrice	
	}, 0).toFixed(2);
}

function getPromotionalPrice(product, promotion) {
	return product.promotions.find(promo => promo.looks.includes(promotion)) || [];
}

function getTotalPrice(products, promotion) {
	let totalPrice = products.reduce((total, product) => {
		let promotionalPrice = getPromotionalPrice(product, promotion);
		return total += (product.regularPrice || promotionalPrice.price);
	}, 0).toFixed(2)

	return totalPrice;
}

function getPriceFromPromotion(products, promotion) {

	let totalPrice = 0;
	let totalRegularPrice = 0;
	let discountValue = 0;

	products.forEach(product => {
		const promotions = product.promotions;
		promotions.forEach(promo => {
			if(promo.looks.includes(promotion)) {
				totalPrice += promo.price;
				discountValue += (product.regularPrice - promo.price);
			}
		})

		totalRegularPrice += product.regularPrice;
	});
	const cartValues = {
		totalPrice : totalPrice.toFixed(2),
		discountValue: discountValue.toFixed(2),
		discount: ((discountValue/totalRegularPrice)*100).toFixed(2) + '%'
	};

	return cartValues;
}

function getProducts(products) {
	return products.map(product => {
		return {
			name: product.name,
			category: product.category
		};
	});
}

function getShoppingCart(ids, productsList) {
	
	const filtered = productsList.filter(product => {
		return ids.includes(product.id);
	});

	const promotion = getPromotion(filtered);
	const cartValues = getPriceFromPromotion(filtered, promotion);
	const totalPrice = (getTotalPrice(filtered, promotion) - cartValues.discountValue).toFixed(2);

	let cart = {
		products: getProducts(filtered),
		promotion,
		totalPrice,
		discountValue: cartValues.discountValue,
		discount: cartValues.discount
	}

	return cart;
}

module.exports = { getShoppingCart };
