export interface Product {
    key?: string;
    title: string;
    price: number;
    category: string;
    imagePath?: string;
    imageUrl?: string;
}

declare enum categoryEnum {
    bread,
    fruits,
    vegetables,
    seasonings,
    diary
}