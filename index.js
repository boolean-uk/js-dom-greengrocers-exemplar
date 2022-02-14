const state = {
  items: [
    {
      id: '001-beetroot',
      name: 'beetroot',
      price: 0.35
    },
    {
      id: '002-carrot',
      name: 'carrot',
      price: 0.35
    },
    {
      id: '003-apple',
      name: 'apple',
      price: 0.35
    },
    {
      id: '004-apricot',
      name: 'apricot',
      price: 0.35
    },
    {
      id: '005-avocado',
      name: 'avocado',
      price: 0.35
    },
    {
      id: '006-bananas',
      name: 'bananas',
      price: 0.35
    },
    {
      id: '007-bell-pepper',
      name: 'bell pepper',
      price: 0.35
    },
    {
      id: '008-berry',
      name: 'berry',
      price: 0.35
    },
    {
      id: '009-blueberry',
      name: 'blueberry',
      price: 0.35
    },
    {
      id: '010-eggplant',
      name: 'eggplant',
      price: 0.35
    }
  ],
  cart: []
}

const createItemListingImage = (item) => {
  const image = document.createElement('img')
  image.src = `./assets/icons/${item.id}.svg`
  image.alt = item.name
  return image
}

const createItemListingImageContainer = (item) => {
  const container = document.createElement('div')
  container.className = 'store--item-icon'
  const image = createItemListingImage(item)
  container.appendChild(image)
  return container
}

const createItemListingButton = (item) => {
  const btn = document.createElement('button')
  const btnText = document.createTextNode('Add to cart')
  btn.appendChild(btnText)

  btn.addEventListener('click', () => {
    addItemToCart(item)
  })

  return btn
}

const createItemListing = (item) => {
  const liContainer = document.createElement('li')
  const imageSection = createItemListingImageContainer(item)
  const btn = createItemListingButton(item)
  liContainer.append(imageSection, btn)
  return liContainer
}

const createItemListings = (items) => {
  return items.map(createItemListing)
}


const renderItemListings = () => {
  const ul = document.querySelector('.store--item-list')
  ul.append(...createItemListings(state.items))
}

// Cart element functions

const createCartImage = (cartItem) => {
  const image = document.createElement('img')
  image.className = 'cart--item-icon'
  image.src = `assets/icons/${cartItem.item.id}.svg`
  image.alt = 'beetroot'
  return image
}

const createCartItemText = (cartItem) => {
  const text = document.createElement('p')
  text.innerText = cartItem.item.name
  return text
}

const createCartItemDecreaseButton = (cartItem) => {
  const decreaseBtn = document.createElement('button')
  decreaseBtn.classList.add('quantity-btn', 'remove-btn', 'center')
  decreaseBtn.innerText = '-'
  decreaseBtn.addEventListener('click', () => {
    cartItem.quantity--
    if (cartItem.quantity === 0) {
      removeItemFromCart(cartItem.item)
    }
    render()
  })
  return decreaseBtn
}

const createCartItemIncreaseButton = (cartItem) => {
  const increaseBtn = document.createElement('button')
  increaseBtn.classList.add('quantity-btn', 'add-btn', 'center')
  increaseBtn.innerText = '+'
  increaseBtn.addEventListener('click', () => {
    cartItem.quantity++
    render()
  })
  return increaseBtn
}

const createCartItemQuantityControls = (cartItem) => {
  const decreaseBtn = createCartItemDecreaseButton(cartItem)
  const increaseBtn = createCartItemIncreaseButton(cartItem)
  const quantityCount = document.createElement('span')
  quantityCount.innerHTML = cartItem.quantity
  return [decreaseBtn, quantityCount, increaseBtn]
}

const createCartItem = (cartItem) => {
  const container = document.createElement('li')
  const image = createCartImage(cartItem)
  const txt = createCartItemText(cartItem)
  const quantityControls = createCartItemQuantityControls(cartItem)
  container.append(image, txt, ...quantityControls)
  return container
}

const renderCartItems = () => {
  const cartItems = state.cart
  const container = document.querySelector('.cart--item-list')
  const items = cartItems.map(createCartItem)
  container.append(...items)
}

const addItemToCart = (item) => {
  if (isItemInCart(item)) {
    return
  }
  state.cart.push({ item: item, quantity: 1 })
  render()
}

const clearCartItems = () => {
  const container = document.querySelector('.cart--item-list')
  const items = Array.from(container.children)
  items.forEach((item) => item.remove())
}

const isItemInCart = (item) => {
  const foundItem = state.cart.find((cartItem) => cartItem.item === item)
  return foundItem !== undefined
}

const removeItemFromCart = (item) => {
  const index = state.cart.findIndex((cartItem) => cartItem.item === item)
  state.cart.splice(index, 1)
}

const totalCart = () => {
  return state.cart.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  )
}

const renderTotal = () => {
  const totalElement = document.querySelector('.total-number')
  const total = totalCart().toFixed(2).toString()
  totalElement.innerText = `£${total}`
}

const render = () => {
  clear()
  renderItemListings()
  renderCartItems()
  renderTotal()
}

const clear = () => {
  clearCartItems()
}

render()

