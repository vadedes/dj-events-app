import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';
import Link from 'next/link';
import { API_URL } from '@/config/index';

export default function Home({ events }) {
    return (
        <Layout>
            <h1>Upcomming Events</h1>
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
        props: { events: events.slice(0, 3) },
        revalidate: 1,
    };
}
