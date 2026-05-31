export type PortfolioProject = {
    id: string;
    title: string;
    category: 'Art' | 'Direction' | 'Music';
    bio?: string;
    images: string[];
  };
/** 
{
    id: 'UniqueID',
    title: 'Title',
    category: 'Art',
    images: [
        'Link',
    ],
},
*/
export const portfolioProjects: PortfolioProject[] = [
    {
        id: 'tr-1',
        title: 'True Religion Lookbook 3',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/Untitled_9.png?v=1780081337?width=400&format=webp',
        ],
    },
    {
        id: 'tr-2',
        title: 'True Religion Lookbook 2',
        category: 'Art',
        bio:'The complete Jaff Saba x True Religion Samaurai Collection 2021',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/Untitled_7.png?v=1780081093?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/470FF168-4754-4269-98A9-D2EA0C1E9066.jpg?v=1742382213?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/AD13D4E1-EB1B-4D05-BA90-5D1BDAB5932E.jpg?v=1742382214?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4371.jpg?v=1742382217?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2746.jpg?v=1742382220?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4604.jpg?v=1742382222?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4369.jpg?v=1742382224?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4372.jpg?v=1742382228?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4373.jpg?v=1742382233https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4373.jpg?v=1742382233?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2666.jpg?v=1742382234?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2666.jpg?v=1742382234?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2714.jpg?v=1742382234?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2641.jpg?v=1742382235?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2710.jpg?v=1742382237?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_1889.jpg?v=1742382237?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2672.jpg?v=1742382238?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2668.jpg?v=1742382238?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2680.jpg?v=1742382238?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2669.jpg?v=1742382243?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2698.jpg?v=1742382243?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2700.jpg?v=1742382243?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2754.jpg?v=1742382245?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2753.jpg?v=1742382246?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2643.jpg?v=1742382251?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2641_f740d3ce-1489-420d-902c-18c0bbb721fc.jpg?v=1742382253?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2625.jpg?v=1742382254?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_2630.jpg?v=1742382254?width=400&format=webp',
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_4786.jpg?v=1742475211?width=400&format=webp',
        ],
    },
    {
        id: 'tr-3',
        title: 'True Religion Lookbook 2',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/Untitled_8.png?v=1780081445?width=400&format=webp',
        ],
    },
    {
        id: 'eon',
        title: 'Eyes of Nazareth',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_0850.jpg?v=1742420921?width=400&format=webp',
        ],
    },
    {
        id: 'fgnf26',
        title: 'FGNF 2026',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_1121.jpg?v=1742590443?width=400&format=webp',
        ],
    },
    {
        id: '4NEM',
        title: '4NEM Chief Keef',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/C97E90C7-C35F-464F-B0D7-D538331AE693.jpg?v=1742398522?width=400&format=webp',
        ],
    },
    {
        id: '730Cap',
        title: '730 x Jaffa Saba Kirby Cap',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_5820.png?v=1742419946?width=400&format=webp',
        ],
    },
    {
        id: 'headcran',
        title: 'Headcrab 2024',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_8064.jpg?v=1742419909?width=400&format=webp',
        ],
    },
    {
        id: 'gameboy',
        title: 'Diamond & Gold Nintendo Gameboy SP Pendant & Chain',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_5584.png?v=1742382048?width=400&format=webp',
        ],
    },
    {
        id: 'Ksubi',
        title: 'Ksubi',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_1735.jpg?v=1742381904?width=400&format=webp',
        ],
    },
    {
        id: '4nemchain',
        title: '4NEM Chair',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_6511.jpg?v=1742381419?width=400&format=webp',
        ],
    },
    {
        id: 'trstacked',
        title: 'True Religion Stacked Denim',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/Screenshot2024-05-16at14.58.18.png?v=1716842717?width=400&format=webp',
        ],
    },
    {
        id: 'titanmask',
        title: 'Titan Mask',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_6731.png?v=1700166463?width=400&format=webp',
        ],
    },
    {
        id: 'usadenim',
        title: 'USA denim',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_9695.jpg?v=1742381998?width=400&format=webp',
        ],
    },
    {
        id: 'somedenim',
        title: 'Denim',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_9583.jpg?v=1742419820?width=400&format=webp',
        ],
    },
    {
        id: 'MOTIONMUZIK',
        title: '##MOTIONMUZIK',
        category: 'Art',
        images: [
            'https://cdn.shopify.com/s/files/1/0791/8839/4310/files/IMG_1799.png?v=1742398536?width=400&format=webp',
        ],
    },
];
