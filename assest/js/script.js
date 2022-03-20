const select = (el) => document.querySelector(el)
const selectors = (el) => document.querySelectorAll(el)
let modalqt = 1
let cart = []
let modalkey = 0


pizzaJson.map((item, index) => {

    let pizzaItem = select('.models .pizza-item').cloneNode(true)
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description

    pizzaItem.querySelector(' a').addEventListener('click', (e)=>{
        e.preventDefault();

        modalqt = 1

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        modalkey = key
        select('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        select(' .pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description
        select('.pizzaBig img').src = pizzaJson[key].img
        select('.pizzaInfo--pricearea .pizzaInfo--actualPrice').innerHTML = `${pizzaJson[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`

        select('.pizzaInfo--size.selected').classList.remove('selected')

        selectors('.pizzaInfo--size').forEach((size, sizeindex)=>{

            if(sizeindex == 2) {
                size.classList.add('selected')
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex]

        })

        select('.pizzaInfo--qt').innerHTML = modalqt
        
        let WindowPrice =  select('.pizzaWindowArea')
        
        WindowPrice.style.opacity = 0;
            WindowPrice.style.display = 'flex';
                
            setTimeout(() => {   
                WindowPrice.style.opacity = 1;
            },200)
        })
        
    select('.pizza-area').append(pizzaItem)
})


function closemodal() {

    let WindowPrice =  select('.pizzaWindowArea')
    
    WindowPrice.style.opacity = 0;
    
    setTimeout(() => {   
        WindowPrice.style.display = 'none';
    },500)
        
}

selectors('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((item)=> {
    
    item.addEventListener('click', closemodal)
    
})


window.addEventListener('keydown', (e) => {
    
    if( select('.pizzaWindowArea').style.display === 'flex'){
        if(e.code === 'Escape') {
            closemodal()
        }
    } 
})


select('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
    
    if(modalqt > 1) {
        modalqt--
        select('.pizzaInfo--qt').innerHTML = modalqt
    }
    
})

select('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    
    modalqt++
    select('.pizzaInfo--qt').innerHTML = modalqt        
})

selectors('.pizzaInfo--size').forEach((size, sizeindex)=> {
    
    size.addEventListener('click', ()=> {
        select('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})


select('.pizzaInfo--addButton').addEventListener('click', ()=> {

    let size = parseInt(select('.pizzaInfo--size.selected').getAttribute('data-key'))
    let identifier = `${pizzaJson[modalkey].id}@${size}`
    
    let key = cart.findIndex((item) => { 
       return item.identifier === identifier
    })

    if(key > -1 ) {
        
        cart[key].qt += modalqt
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalqt
        })
    }
    
    closemodal()
    uppdatecart()
    
})

select('.menu-openner').addEventListener('click', () => {

    if(cart.length > 0) {
        select('aside').style.left = '0'
    }
})

select('.menu-closer').addEventListener('click', () => {

    select('aside').style.left = '100vw'
})



function uppdatecart() {

    select('.menu-openner span').innerHTML = cart.length
    let subtotal = 0
    let desconto = 0
    let total = 0
    const aside = select('aside')
   

    if(cart.length > 0) {

        aside.classList.add('show')
        select('.cart').innerHTML= ''

        for(let i in cart) {

            let pizzaitem = pizzaJson.find((item)=> item.id == cart[i].id)

            let cartItem = select('.models .cart--item').cloneNode(true)
            let pizzanamesize = ''
            let tam = cart[i].size
            let nome

            switch(tam) {
                case 0:
                    pizzanamesize = 'p'
                    break;
                case 1:
                    pizzanamesize = 'M'
                    break;
                case 2:
                    pizzanamesize = 'G'
                    break;
                default: 
                    alert('f')
            }

            let pizzaname = `${pizzaitem.name} (${pizzanamesize})`


            cartItem.querySelector('img').src = pizzaitem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaname
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
            subtotal = pizzaitem.price * cart[i].qt
            
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                
                if(cart[i].qt > 1) {
                    cart[i].qt--
                    uppdatecart()
                    
                } else {
                    cart.splice( i, 1)
                    uppdatecart()

                }
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt ++
                uppdatecart()
            })
            select('.cart').append(cartItem)
        }

        let taxadesc = 0.1 

        desconto = subtotal * taxadesc
        total = subtotal - desconto

        select('.subtotal span:last-child').innerHTML = `${subtotal.toLocaleString('pt-br', {style:'currency', currency:'BRL'})}`
        select('.desconto span:last-child').innerHTML = `${desconto.toLocaleString('pt-br', {style:'currency', currency:'BRL'})}`
        select('.total span:last-child').innerHTML = `${total.toLocaleString('pt-br', {style:'currency', currency:'BRL'})}`
        console.log(total)
    } else {
        aside.classList.remove('show')
        aside.style.left = '100vw'

    }
}




