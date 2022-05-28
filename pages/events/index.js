import Layout from '@/components/Layout';
import { API_URL, PER_PAGE } from '@/config/index';
import EventItem from '@/components/EventItem';
import qs from 'qs';
import Pagination from '@/components/Pagination';

export default function EventsPage({ events, total, page }) {
    return (
        <Layout>
            <h1>Events</h1>
            {events.length === 0 && <h3>No events to show</h3>}

            {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))}

            <Pagination total={total} page={page} />
        </Layout>
    );
}

//fetch data from server
export async function getServerSideProps({ query: { page = 1 } }) {
    //Calculate start page
    const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

    const query = qs.stringify(
        {
            pagination: {
                start: start,
                limit: PER_PAGE,
            },
            sort: ['date:desc'],
        },
        {
            encodeValuesOnly: true,
        }
    );

    //Fetch totals/count
    const totalRes = await fetch(`${API_URL}/api/events?pagination[withCount]=true`);
    const totalData = await totalRes.json();
    const total = totalData.meta.pagination.total;

    //Fetch events
    const eventReq = await fetch(`${API_URL}/api/events?[populate]=*&${query}`);
    // const req = await fetch(`${API_URL}/api/events?[populate]=*&[sort]=date:DESC&pagination[limit]=${PER_PAGE}&pagination[withCount]=true`);
    const eventRes = await eventReq.json();

    const events = eventRes.data;

    if (!events) {
        return {
            events: null,
            notFound: true,
        };
    }

    return {
        props: { events, page: +page, total },
    };
}
