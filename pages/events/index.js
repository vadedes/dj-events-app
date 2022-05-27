import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';

export default function EventsPage({ events }) {
    return (
        <Layout>
            <h1>Events</h1>
            {events.length === 0 && <h3>No events to show</h3>}

            {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))}
        </Layout>
    );
}

//fetch data from server
export async function getStaticProps() {
    const req = await fetch(`${API_URL}/api/events?[populate]=*&[sort]=date:DESC`);
    const res = await req.json();

    const events = res.data;

    if (!events) {
        return {
            events: null,
            notFound: true,
        };
    }

    return {
        props: { events },
        revalidate: 1,
    };
}
