import ClientSearch from './ClientSearch';
import SharedSearchBar from "../../components/search/SharedSearchBar";
import { getListings } from "../../lib/db/queries";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function Page({ searchParams }: { searchParams?: Promise<SearchParams> | SearchParams }) {
  const params = searchParams ? await searchParams : {};
  const citiesRaw = params.cities;
  const cities = Array.isArray(citiesRaw) ? citiesRaw : (citiesRaw ? [String(citiesRaw)] : []);
  const bedroomsRaw = params.bedrooms ? String(params.bedrooms) : undefined;
  const bedrooms = bedroomsRaw ? parseInt(bedroomsRaw, 10) : undefined;

  const properties = await getListings({ cities, bedrooms, limit: 200 });

  return (
    <main>
      <SharedSearchBar variant="compact" />
      <ClientSearch initialProperties={properties} />
    </main>
  );
}