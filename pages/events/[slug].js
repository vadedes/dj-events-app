import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { parseCookies } from '@/helpers/index';
import EventMap from '@/components/EventMap';
// import EventMapLegacy from '@/components/EventMapLegacy';

export default function EventPage({ evt, token }) {
    const router = useRouter();
    const { user } = useContext(AuthContext);

    const deleteEvent = async (e) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();

            if (res.status === 401 || res.status === 403) {
                toast.error(`You're not authorized to delete this event`);
            }

            if (!res.ok) {
                toast.error(data.message);
                return;
            } else {
                router.push('/events');
            }
        }
    };

    const imgSource = evt.attributes.image?.data?.attributes.formats.medium.url;

    return (
        <Layout>
            <div className={styles.event}>
                {user && (
                    <div className={styles.controls}>
                        <Link href={`/events/edit/${evt.id}`}>
                            <a>
                                <FaPencilAlt /> Edit Event
                            </a>
                        </Link>
                        <a href='#' className={styles.delete} onClick={deleteEvent}>
                            <FaTimes /> Delete Event
                        </a>
                    </div>
                )}

                <span>
                    {new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
                </span>
                <h1>{evt.attributes.name}</h1>
                <ToastContainer />
                {imgSource && (
                    <div className={styles.image}>
                        <Image src={imgSource ? imgSource : '/images/event-default.png'} width={960} height={600} alt={evt.attributes.name} />
                    </div>
                )}

                <h3>Performers:</h3>
                <p>{evt.attributes.performers}</p>
                <h3>Description:</h3>
                <p>{evt.attributes.description}</p>
                <h3>Venue: {evt.attributes.venue}</h3>
                <p>{evt.attributes.address}</p>

                <EventMap evt={evt} />
                {/* <EventMapLegacy evt={evt} /> */}

                <Link href='/events'>
                    <a className={styles.back}>{'<'} Go Back</a>
                </Link>
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ query: { slug }, req }) {
    const { token } = parseCookies(req);

    const eventReq = await fetch(`${API_URL}/api/events?[populate]=*&slug=${slug}`);
    const res = await eventReq.json();

    const events = res.data;

    if (!events) {
        return {
            events: null,
            notFound: true,
        };
    }

    const filteredEvents = events.filter((ev) => ev.attributes.slug === slug);

    return {
        props: {
            evt: filteredEvents[0],
            token,
        },
    };
}
