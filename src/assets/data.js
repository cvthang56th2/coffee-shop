export const listTables = [  
  {
    id: 1,
    name: `B-1`,
    group: 1,
  },
  {
    id: 2,
    name: `B-2`,
    group: 1,
  },
  {
    id: 3,
    name: `B-3`,
    group: 1,
  },
  {
    id: 4,
    name: `B-4`,
    group: 1,
  },
  {
    id: 5,
    name: `B-5`,
    group: 1,
  },
  {
    id: 6,
    name: `B-6`,
    group: 1,
  },
  {
    id: 7,
    name: `B-7`,
    group: 1,
  },
  {
    id: 8,
    name: `B-8`,
    group: 1,
  },
  {
    id: 9,
    name: `B-9`,
    group: 1,
  },
  {
    id: 10,
    name: `B-10`,
    group: 1,
  },
  {
    id: 11,
    name: `B-11`,
    group: 1,
  },
  {
    id: 12,
    name: `B-12`,
    group: 1,
  },
  {
    id: 13,
    name: `B-13`,
    group: 1,
  },
  {
    id: 14,
    name: `B-14`,
    group: 1,
  },
  {
    id: 15,
    name: `B-15`,
    group: 1,
  },
  {
    id: 16,
    name: `B-16`,
    group: 1,
  },
  {
    id: 17,
    name: `B-1`,
    group: 2,
  },
  {
    id: 18,
    name: `B-2`,
    group: 2,
  },
  {
    id: 19,
    name: `B-3`,
    group: 2,
  },
  {
    id: 20,
    name: `B-4`,
    group: 2,
  },
  {
    id: 21,
    name: `B-5`,
    group: 2,
  },
  {
    id: 22,
    name: `B-6`,
    group: 2,
  },
  {
    id: 23,
    name: `B-7`,
    group: 2,
  },
  {
    id: 24,
    name: `B-8`,
    group: 2,
  },
  {
    id: 25,
    name: `B-9`,
    group: 2,
  },
  {
    id: 26,
    name: `B-10`,
    group: 2,
  },
  {
    id: 27,
    name: `B-11`,
    group: 2,
  },
  {
    id: 28,
    name: `B-12`,
    group: 2,
  },
  {
    id: 29,
    name: `B-13`,
    group: 2,
  },
  {
    id: 30,
    name: `B-14`,
    group: 2,
  },
  {
    id: 33,
    name: `B-15`,
    group: 2,
  },
  {
    id: 32,
    name: `B-16`,
    group: 2,
  },
  {
    id: 33,
    name: `B-1`,
    group: 3,
  },
  {
    id: 34,
    name: `B-2`,
    group: 3,
  },
  {
    id: 35,
    name: `B-3`,
    group: 3,
  },
  {
    id: 36,
    name: `B-4`,
    group: 3,
  },
  {
    id: 37,
    name: `B-5`,
    group: 3,
  },
  {
    id: 38,
    name: `B-6`,
    group: 3,
  },
  {
    id: 39,
    name: `B-7`,
    group: 3,
  },
  {
    id: 40,
    name: `B-8`,
    group: 3,
  },
  {
    id: 41,
    name: `B-9`,
    group: 3,
  },
  {
    id: 42,
    name: `B-10`,
    group: 3,
  },
  {
    id: 43,
    name: `B-11`,
    group: 3,
  },
  {
    id: 44,
    name: `B-12`,
    group: 3,
  },
  {
    id: 45,
    name: `B-13`,
    group: 3,
  },
  {
    id: 46,
    name: `B-14`,
    group: 3,
  },
  {
    id: 47,
    name: `B-15`,
    group: 3,
  },
  {
    id: 48,
    name: `B-16`,
    group: 3,
  },
]

export const products = Array.from(Array(50).keys()).map((e) => ({
  id: `product-${e}`,
  name: `Sản phẩm ${e}`,
  price: (e + 1) * 1000,
  image: "https://via.placeholder.com/50x100",
  unit: e % 2 ? "Lon" : "Cái",
}))