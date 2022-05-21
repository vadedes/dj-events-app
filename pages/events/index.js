import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import EventItem from '@/components/EventItem';
import Link from 'next/link';

export default function EventsPage({ events }) {
    return (
        <Layout>
            <h1>Events</h1>
            {events.length === 0 && <h3>No events to show</h3>}

            {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))}

            {events.length > 0 && (
                <Link href='/events'>
                    <a className='btn-secondary'>View All Events</a>
                </Link>
            )}
        </Layout>
    );
}

//fetch data from server
export async function getStaticProps() {
    const res = await fetch(`${API_URL}/api/events?_sort=date:ASC`);
    const events = await res.json();

    return {
        props: { events },
        revalidate: 1,
    };
}
