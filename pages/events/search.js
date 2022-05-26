import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import Link from 'next/link';
import EventItem from '@/components/EventItem';
import { client } from 'client';

export default function EventsPage({ events }) {
    const router = useRouter();

    return (
        <Layout title='Search Results'>
            <Link href='/events'>Go Back</Link>
            <h1>Search Results for {router.query.term}</h1>
            {events.length === 0 && <h3>No events to show</h3>}

            {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))}

            {/* {events.length > 0 && (
                <Link href='/events'>
                    <a className='btn-secondary'>View All Events</a>
                </Link>
            )} */}
        </Layout>
    );
}

let term;

//fetch data from server
export async function getServerSideProps({ query: { term } }) {
    const query = `*[_type == "events" && [name, performers, venue, address, description] match "${term}*"]`;

    const events = await client.fetch(query);

    return {
        props: { events },
    };
}
