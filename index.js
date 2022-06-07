const storeList = document.querySelector('.store--item-list')
const cartList = document.querySelector('.cart--item-list')
const totalNumber = document.querySelector('.total-number')
const vegFilter = document.querySelector('.veg-filter')
const fruitFilter = document.querySelector('.fruit-filter')
const sortButton = document.querySelector('.sort-button')

vegFilter.addEventListener('click', (event) => {
  filterAndRender(event.target.checked, 'vegetable')
})

fruitFilter.addEventListener('click', (event) => {
  filterAndRender(event.target.checked, 'fruit')
})

sortButton.addEventListener('click', event => {
  const items = state.items.sort((a,b) => a.name.localeCompare(b.name))
  renderStoreItems(items)
})

function filterAndRender(checked, type) {
  let filteredItems
  if (checked) {
    filteredItems = state.items.filter(item => item.type === type)
  } else {
    filteredItems = state.items
  }
  renderStoreItems(filteredItems)
}

function renderStoreItems(items) {
  storeList.innerHTML = ""

  items.forEach(item => {
    const li = document.createElement('li')

    const div = document.createElement('div')
    div.setAttribute('class', "store--item-icon")

    const img = document.createElement('img')
    img.setAttribute('src', `assets/icons/${item.id}.svg`)
    img.setAttribute('alt', item.name)
    div.append(img)

    const button = document.createElement('button')
    button.innerText = "Add to cart"
    button.addEventListener('click', () => {
      state.cart.push(item)
      renderCart()
    })

    li.append(div, button)
    storeList.append(li)
  })
}

function renderCart() {
  cartList.innerHTML = ""

  const displayItems = cartDisplay()
  displayItems.forEach(displayItem => {
    const li = document.createElement('li')

    const img = document.createElement('img')
    img.setAttribute('class', 'cart--item-icon')
    img.setAttribute('src', `assets/icons/${displayItem.item.id}.svg`)
    img.setAttribute('alt', displayItem.item.name)

    const p = document.createElement('p')
    p.innerText = displayItem.item.name

    const removeBtn = document.createElement('button')
    removeBtn.classList.add('quantity-btn', 'remove-btn', 'center')
    removeBtn.innerText = '-'
    removeBtn.addEventListener('click', () => {
      const foundItem = state.cart.find(item => item.id === displayItem.item.id)
      state.cart.splice(state.cart.indexOf(foundItem), 1)
      renderCart()
    })

    const span = document.createElement('span')
    span.classList.add('quantity-text', 'center')
    span.innerText = displayItem.quantity

    const addBtn = document.createElement('button')
    addBtn.classList.add('quantity-btn', 'add-btn', 'center')
    addBtn.innerText = '+'
    addBtn.addEventListener('click', () => {
      state.cart.push(displayItem.item)
      renderCart()
    })

    li.append(img, p, removeBtn, span, addBtn)
    cartList.append(li)
  })
  renderTotal()
}

function renderTotal() {
  const total = state.cart.reduce((a, b) => a + b.price, 0)
  const totalStr = `£${total.toFixed(2)}`
  totalNumber.innerText = totalStr
}

function cartDisplay() {
  let display = []
  state.cart.forEach(item => {
    const foundItem = display.find(displayItem => item.name === displayItem.item.name)
    if (foundItem === undefined) {
      display.push({item: item, quantity: 1})
    } else {
      foundItem.quantity++
    }
  })
  return display
}

renderStoreItems(state.items)
