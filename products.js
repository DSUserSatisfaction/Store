window.PRODUCTS = [
  {
    id:"p-001", name:"Ridgeline Daypack", slug:"ridgeline-daypack", category:"Bags",
    price:89, compareAtPrice:110, rating:4.8, reviewCount:124,
    description:"A weather-ready everyday pack with a structured 20-litre interior, padded laptop sleeve, and supportive recycled-nylon shell.",
    shortDescription:"Recycled nylon. 20 litres. All-weather.",
    images:["./images/pic01.jpg","./images/pic02.jpg","./images/pic03.jpg"], featured:true, bestseller:true, newArrival:false, onSale:true,
    stockStatus:"in-stock", stockQuantity:18, tags:["popular","commute","travel"],
    variants:[{name:"Color",options:["Forest","Stone","Ink"]}],
    specifications:[{label:"Volume",value:"20 L"},{label:"Shell",value:"Recycled 600D nylon"}],
    shippingInformation:"Dispatched in 1-2 working days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-002", name:"Alpine Pour-Over Set", slug:"alpine-pour-over-set", category:"Home",
    price:46, rating:4.6, reviewCount:78,
    description:"A balanced pour-over set for slow mornings, with a hand-finished ceramic dripper and durable heat-resistant glass.",
    shortDescription:"Ceramic dripper and glass server.",
    images:["./images/pic04.jpg","./images/pic05.jpg"], featured:true, bestseller:false, newArrival:true, onSale:false,
    stockStatus:"in-stock", stockQuantity:32, tags:["coffee","gift","ceramic"],
    variants:[{name:"Finish",options:["Sand","Charcoal"]}],
    specifications:[{label:"Capacity",value:"600 ml"},{label:"Material",value:"Ceramic and borosilicate glass"}],
    shippingInformation:"Dispatched in 1-2 working days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-003", name:"Field Wool Overshirt", slug:"field-wool-overshirt", category:"Apparel",
    price:128, compareAtPrice:158, rating:4.9, reviewCount:96,
    description:"A substantial brushed-wool overshirt cut for cool camp evenings and everyday city wear.",
    shortDescription:"Soft brushed wool with utility pockets.",
    images:["./images/pic02.jpg","./images/pic01.jpg"], featured:true, bestseller:true, newArrival:false, onSale:true,
    stockStatus:"low-stock", stockQuantity:5, tags:["wool","layer","outerwear"],
    variants:[{name:"Size",options:["XS","S","M","L","XL"]},{name:"Color",options:["Moss","Oat"]}],
    specifications:[{label:"Material",value:"Wool blend"},{label:"Fit",value:"Relaxed"}],
    shippingInformation:"Free exchanges within 30 days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-004", name:"Ember Camp Lantern", slug:"ember-camp-lantern", category:"Outdoor",
    price:72, rating:4.7, reviewCount:183,
    description:"A dimmable rechargeable lantern with warm diffusion and a resilient powder-coated steel frame.",
    shortDescription:"Warm dimmable light, USB-C rechargeable.",
    images:["./images/banner.jpg","./images/pic03.jpg"], featured:true, bestseller:true, newArrival:true, onSale:false,
    stockStatus:"in-stock", stockQuantity:24, tags:["camp","light","rechargeable"],
    variants:[{name:"Color",options:["Black","Rust"]}],
    specifications:[{label:"Runtime",value:"Up to 40 hours"},{label:"Charging",value:"USB-C"}],
    shippingInformation:"Dispatched in 1-2 working days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-005", name:"Trekker Merino Sock", slug:"trekker-merino-sock", category:"Apparel",
    price:24, compareAtPrice:30, rating:4.5, reviewCount:211,
    description:"Cushioned merino socks engineered to manage heat and stay comfortable through long walking days.",
    shortDescription:"Cushioned merino hiking sock.",
    images:["./images/pic05.jpg","./images/pic04.jpg"], featured:false, bestseller:true, newArrival:false, onSale:true,
    stockStatus:"in-stock", stockQuantity:80, tags:["hiking","merino","warm"],
    variants:[{name:"Size",options:["S","M","L"]},{name:"Color",options:["Moss","Charcoal","Cream"]}],
    specifications:[{label:"Blend",value:"55% merino wool"},{label:"Height",value:"Crew"}],
    shippingInformation:"Dispatched in 1-2 working days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-006", name:"Contour Travel Flask", slug:"contour-travel-flask", category:"Drinkware",
    price:38, rating:4.4, reviewCount:67,
    description:"A slim double-wall steel flask that keeps drinks cold or hot without bulk in your bag.",
    shortDescription:"Double-wall steel, 500 ml.",
    images:["./images/pic03.jpg","./images/pic01.jpg"], featured:false, bestseller:false, newArrival:true, onSale:false,
    stockStatus:"in-stock", stockQuantity:44, tags:["bottle","travel","steel"],
    variants:[{name:"Color",options:["Stone","Forest","Copper"]}],
    specifications:[{label:"Capacity",value:"500 ml"},{label:"Insulation",value:"Double-wall"}],
    shippingInformation:"Dispatched in 1-2 working days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-007", name:"Hearth Wool Blanket", slug:"hearth-wool-blanket", category:"Home",
    price:118, rating:4.8, reviewCount:54,
    description:"A dense, softly brushed wool blanket for cabin weekends and quiet evenings at home.",
    shortDescription:"Warm brushed wool, generous throw size.",
    images:["./images/pic04.jpg","./images/pic02.jpg"], featured:false, bestseller:false, newArrival:false, onSale:false,
    stockStatus:"low-stock", stockQuantity:7, tags:["wool","blanket","gift"],
    variants:[{name:"Color",options:["Pine","Oat","Rust"]}],
    specifications:[{label:"Size",value:"130 x 180 cm"},{label:"Material",value:"New wool"}],
    shippingInformation:"Dispatched in 2-3 working days.", returnInformation:"Returns accepted within 30 days."
  },
  {
    id:"p-008", name:"Trail Camera Pouch", slug:"trail-camera-pouch", category:"Bags",
    price:58, compareAtPrice:68, rating:4.3, reviewCount:41,
    description:"A softly padded, weather-resistant pouch sized for a compact camera or field journal.",
    shortDescription:"Padded compact-camera organization.",
    images:["./images/pic01.jpg","./images/pic05.jpg"], featured:false, bestseller:false, newArrival:true, onSale:true,
    stockStatus:"in-stock", stockQuantity:29, tags:["camera","travel","compact"],
    variants:[{name:"Color",options:["Black","Clay"]}],
    specifications:[{label:"Exterior",value:"Waxed recycled canvas"},{label:"Interior",value:"Soft fleece"}],
    shippingInformation:"Dispatched in 1-2 working days.", returnInformation:"Returns accepted within 30 days."
  }
];
