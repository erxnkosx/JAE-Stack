type currentPage = "ontdek" | "collectie" | "vergelijk" | "raad";
// fix: capitalize (PageInfo)
export interface pageInfo {
    currentPage: currentPage
}

export interface PlatformDetails {
    name: string;
}
export interface PlatformInfo {
    platform: PlatformDetails
}

interface Genre {
    name: string;
}

export interface Game {
    id: number
    name: string;
    rating: number;
    released: Date;
    background_image: string;
    metacritic: number;
    platforms: PlatformInfo[];
    genres: Genre[]
}

