import Layout from '@/components/Layout';
import EventItem from '@/components/EventItem';

export default function EventsPage({ events }) {
    return (
        <Layout>
            <h1>Events</h1>
            {/* condition if no events listed */}
            {/* <EventItem key={evt.id} evt={evt} /> */}
            {/* {events.map((evt) => (
                <EventItem key={evt.id} evt={evt} />
            ))} */}
        </Layout>
    );
}

//fetch data from server
