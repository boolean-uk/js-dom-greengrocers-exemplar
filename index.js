const TypeFruit = "fruit"
const TypeVeg = "veg"
const SortPrice = "price"
const SortName = "name"

const state = {
  items: [
    {
      id: "001-beetroot",
      name: "beetroot",
      price: 0.45,
      type: TypeVeg,
    },
    {
      id: "002-carrot",
      name: "carrot",
      price: 0.35,
      type: TypeVeg,
    },
    {
      id: "003-apple",
      name: "apple",
      price: 0.85,
      type: TypeFruit,
    },
    {
      id: "004-apricot",
      name: "apricot",
      price: 0.95,
      type: TypeFruit,
    },
    {
      id: "005-avocado",
      name: "avocado",
      price: 0.15,
      type: TypeVeg,
    },
    {
      id: "006-bananas",
      name: "bananas",
      price: 0.14,
      type: TypeFruit,
    },
    {
      id: "007-bell-pepper",
      name: "bell pepper",
      price: 0.35,
      type: TypeVeg,
    },
    {
      id: "008-berry",
      name: "berry",
      price: 0.55,
      type: TypeFruit,
    },
    {
      id: "009-blueberry",
      name: "blueberry",
      price: 0.35,
      type: TypeFruit,
    },
    {
      id: "010-eggplant",
      name: "eggplant",
      price: 1.35,
      type: TypeVeg,
    },
  ],
  filters: {
    veg: true,
    fruit: true,
  },
  sort: SortPrice,
  cart: [],
  total: 0,
}

//********************** State Functions ***************************/

function addItemToCart(item) {
  //Try to find the item in the existing cart items
  const existingCartItem = state.cart.find(function (cartItem) {
    return cartItem.item == item
  })

  //If it was not found, add a new item to the cart
  if (existingCartItem === undefined) {
    state.cart.push({ quantity: 1, item: item })

    //If it was found, then increase it's quantity
  } else {
    existingCartItem.quantity++
  }

  //recalculate the total price
  calculateTotalPrice()
}

function decreaseQuantity(cartItem) {
  cartItem.quantity--
  if (cartItem.quantity === 0) {
    removeItemFromCart(cartItem)
  }
  calculateTotalPrice()
}

function removeItemFromCart(cartItem) {
  //Find the index of the item in the cart list
  const cartItemIndex = state.cart.findIndex(function (existingCartItem) {
    return existingCartItem === cartItem
  })

  //Remove the item from the array
  state.cart.splice(cartItemIndex, 1)
}

function increaseQuantity(cartItem) {
  cartItem.quantity++
  calculateTotalPrice()
}

function toggleFruitFilter() {
  //If the fruit filter was true, set it to false and vice versa
  state.filters.fruit = !state.filters.fruit
}

function toggleVegFilter() {
  //If the veg filter was true, set it to false and vice versa
  state.filters.veg = !state.filters.veg
}

//Takes an item and returns true if the item should be excluded
//by the current filters, or false if it is not excluded.
function isFilteredOut(item) {
  //If item type is fruit and the fruit filter is off
  if (item.type === TypeFruit && !state.filters.fruit) {
    return true
    //If item type is veg and the veg filter is off
  } else if (item.type === TypeVeg && !state.filters.veg) {
    return true
    //Otherwise the item is not filtered
  } else {
    return false
  }
}

function calculateTotalPrice() {
  let total = 0
  for (const cartItem of state.cart) {
    total += cartItem.quantity * cartItem.item.price
  }

  state.total = total.toFixed(2)
}

//Toggles the sort between the price and name options and
//sorts the items list
function toggleSort() {
  if (state.sort === SortName) {
    state.sort = SortPrice
  } else {
    state.sort = SortName
  }

  //Use a custom sort function to sort the array of items
  //objects. See MDN for full documentation - in our callback
  //function we need to return more than 0 if a is greater than b,
  //less than 0 if a is less than to b, or 0 if a and be are equal.
  //
  //For price we can just subtract b from a to do this - for name,
  //we can't subtract a string but we can can use > and < so we check
  //these and return 1,-1 or 0 as required.
  state.items.sort(function (a, b) {
    //If the current sort type is price, sort by price
    if (state.sort === SortPrice) {
      return a.price - b.price

      //If the current sort type is name, sort by name
    } else if (state.sort === SortName) {
      if (a.name > b.name) {
        return 1
      } else if (a.name < b.name) {
        return -1
      } else {
        return 0
      }
    }
  })
}

//********************** Render Functions ***************************/

//Store and cart lists
const storeListEl = document.querySelector("#store-list")
const cartListEl = document.querySelector("#cart-list")

//Sort Button
const sortEl = document.querySelector("#sort")

//Filter Buttons
const filterVegEl = document.querySelector("#filter-veg")
const filterFruitEl = document.querySelector("#filter-fruit")

//Add event listeners for the fruit and veg filter options
function addFilterListeners() {
  filterFruitEl.addEventListener("click", function () {
    //1. Update the state
    toggleFruitFilter()
    //2. Render
    render()
  })

  filterVegEl.addEventListener("click", function () {
    //1. Update the state
    toggleVegFilter()
    //2. Render
    render()
  })
}

//Add event listener for the sort option
function addSortListeners() {
  sortEl.addEventListener("click", function () {
    //1. Update the state
    toggleSort()
    //2. Render
    render()
  })
}

//Top level render functions - clears UI and then
//re-renders the app based on the state.
function render() {
  clear()

  updateFilters()
  updateSort()
  updateTotal()

  renderItemsList()
  renderCart()
}

function clear() {
  storeListEl.innerHTML = ""
  cartListEl.innerHTML = ""
}

function updateSort() {
  //If we are currently sorting by name we want to sort by price
  //when the user next clicks the button
  if (state.sort === SortName) {
    sortEl.innerText = "Sort by Price"
  } else if (state.sort === SortPrice) {
    sortEl.innerText = "Sort by Name"
  }
}

function updateFilters() {
  updateFilter(filterFruitEl, state.filters.fruit)
  updateFilter(filterVegEl, state.filters.veg)
}

//Apply the filter-on button to the passed element
//if the filter is on - otherwise remove it
function updateFilter(filterEl, on) {
  if (on) {
    filterEl.classList.add("filter-on")
  } else {
    filterEl.classList.remove("filter-on")
  }
}

function updateTotal() {
  const totalEl = document.querySelector("#total")
  totalEl.innerText = `£${state.total}`
}

function renderItemsList() {
  for (const item of state.items) {
    //If this item should not be included by the current filters
    //then just skip it
    if (isFilteredOut(item)) {
      continue
    }
    renderItem(item)
  }
}

function renderItem(item) {
  const itemContainerEl = document.createElement("div")
  itemContainerEl.classList.add("store--item-icon")

  const itemImageEl = document.createElement("img")
  itemImageEl.setAttribute("src", `assets/icons/${item.id}.svg`)
  itemImageEl.setAttribute("alt", item.name)
  itemContainerEl.append(itemImageEl)

  const buttonEl = document.createElement("button")
  buttonEl.innerText = "Add to cart"
  buttonEl.addEventListener("click", function () {
    //1. Update the state
    addItemToCart(item)
    //2. Render the page
    render()
  })

  const itemEl = document.createElement("li")
  itemEl.append(itemContainerEl, buttonEl)

  storeListEl.append(itemEl)
}

function renderCart() {
  for (const cartItem of state.cart) {
    renderCartItem(cartItem)
  }
}

function renderCartItem(cartItem) {
  const cartItemImageEl = document.createElement("img")
  cartItemImageEl.classList.add("cart--item-icon")
  cartItemImageEl.setAttribute("src", `assets/icons/${cartItem.item.id}.svg`)
  cartItemImageEl.setAttribute("alt", cartItem.item.name)

  const cartItemNameEl = document.createElement("p")
  cartItemNameEl.innerText = cartItem.item.name

  const removeButtonEl = document.createElement("button")
  removeButtonEl.setAttribute("class", "quantity-btn remove-btn center")
  removeButtonEl.innerText = "-"
  removeButtonEl.addEventListener("click", function () {
    //1. Update the state
    decreaseQuantity(cartItem)
    //2. Render the page
    render()
  })

  const quantityEl = document.createElement("span")
  quantityEl.setAttribute("class", "quantity-text center")
  quantityEl.innerText = cartItem.quantity

  const addButtonEl = document.createElement("button")
  addButtonEl.setAttribute("class", "quantity-btn add-btn center")
  addButtonEl.innerText = "+"
  addButtonEl.addEventListener("click", function () {
    //1. Update the state
    increaseQuantity(cartItem)
    //2. Render the page
    render()
  })

  const cartListItemEl = document.createElement("li")
  cartListItemEl.append(cartItemImageEl, cartItemNameEl, removeButtonEl, quantityEl, addButtonEl)

  cartListEl.append(cartListItemEl)
}

//When the page first loads, perform an initial sort
//add event listeners and render
toggleSort()
addSortListeners()
addFilterListeners()
render()
