export type Location = {
	id: string;
	title: string;
	country: string;
	image?: string;
	listings?: number;
	price?: string;
};

const locations = [
{
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBza3lsaW5lfGVufDF8fHx8MTc2MjY2NzQ0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    city: "London",
    country: "United Kingdom",
    priceFrom: "$3,000",
    listings: 1243
},
{
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYW5na29rJTIwc2t5bGluZXxlbnwxfHx8fDE3NjI2ODg4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Bangkok",
    country: "Thailand",
    priceFrom: "$500",
    listings: 856
},
{
    image: "https://images.unsplash.com/photo-1667748642865-51f67c2e81e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWlnb24lMjBjaXR5fGVufDF8fHx8MTc2MjY4ODg1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Saigon",
    country: "Vietnam",
    priceFrom: "$480",
    listings: 624
},
{
    image: "https://images.unsplash.com/photo-1573455494060-c5595004fb6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMG5pZ2h0fGVufDF8fHx8MTc2MjY4ODg1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Tokyo",
    country: "Japan",
    priceFrom: "$850",
    listings: 1089
},
{
    image: "https://images.unsplash.com/photo-1512250431446-d0b4b57b27ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRlbGxpbiUyMGNvbG9tYmlhfGVufDF8fHx8MTc2MjY4ODg1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Medellín",
    country: "Colombia",
    priceFrom: "$450",
    listings: 412
},
{
    image: "https://images.unsplash.com/photo-1536663815808-535e2280d2c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaXNib24lMjBwb3J0dWdhbHxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Lisbon",
    country: "Portugal",
    priceFrom: "$1,700",
    listings: 738
},
{
    image: "https://images.unsplash.com/photo-1593368858664-a7fe556ab936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXJjZWxvbmElMjBzcGFpbnxlbnwxfHx8fDE3NjI2ODg4NTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Barcelona",
    country: "Spain",
    priceFrom: "$1,720",
    listings: 892
},
{
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyNjA1MzU5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    city: "Dubai",
    country: "United Arab Emirates",
    priceFrom: "$2,400",
    listings: 956
}
,
{
    image: "https://source.unsplash.com/1200x800/?new+york,skyline",
    city: "New York",
    country: "United States",
    priceFrom: "$3,200",
    listings: 1580
},
{
    image: "https://source.unsplash.com/1200x800/?berlin,brandenburg+gate",
    city: "Berlin",
    country: "Germany",
    priceFrom: "$1,600",
    listings: 640
},
{
    image: "https://source.unsplash.com/1200x800/?seoul,city+skyline",
    city: "Seoul",
    country: "South Korea",
    priceFrom: "$1,350",
    listings: 710
},
{
    image: "https://source.unsplash.com/1200x800/?toronto,cn+tower",
    city: "Toronto",
    country: "Canada",
    priceFrom: "$1,900",
    listings: 520
},
{
    image: "https://source.unsplash.com/1200x800/?sydney,opera+house",
    city: "Sydney",
    country: "Australia",
    priceFrom: "$2,100",
    listings: 430
},
{
    image: "https://source.unsplash.com/1200x800/?melbourne,city+skyline",
    city: "Melbourne",
    country: "Australia",
    priceFrom: "$1,800",
    listings: 365
},
{
    image: "https://source.unsplash.com/1200x800/?san+francisco,golden+gate",
    city: "San Francisco",
    country: "United States",
    priceFrom: "$3,400",
    listings: 980
},
{
    image: "https://unsplash.com/photos/boats-on-the-river-near-the-building-gP2PNn1fCiU",
    city: "Amsterdam",
    country: "Netherlands",
    priceFrom: "$1,750",
    listings: 410
},
{
    image: "https://source.unsplash.com/1200x800/?prague,charles+bridge",
    city: "Prague",
    country: "Czech Republic",
    priceFrom: "$1,200",
    listings: 290
},
{
    image: "https://source.unsplash.com/1200x800/?buenos+aires,plaza",
    city: "Buenos Aires",
    country: "Argentina",
    priceFrom: "$950",
    listings: 210
}
];

export default locations;