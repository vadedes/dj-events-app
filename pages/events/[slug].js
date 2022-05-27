import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

export default function EventPage({ evt }) {
    const router = useRouter();

    const deleteEvent = async (e) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            } else {
                router.push('/events');
            }
        }
    };

    return (
        <Layout>
            <div className={styles.event}>
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

                <span>
                    {new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
                </span>
                <h1>{evt.attributes.name}</h1>
                <ToastContainer />
                {evt.attributes.image && (
                    <div className={styles.image}>
                        <Image src={evt.attributes.image.data.attributes.formats.medium.url} width={960} height={600} alt={evt.attributes.name} />
                    </div>
                )}

                <h3>Performers:</h3>
                <p>{evt.attributes.performers}</p>
                <h3>Description:</h3>
                <p>{evt.attributes.description}</p>
                <h3>Venue: {evt.attributes.venue}</h3>
                <p>{evt.attributes.address}</p>

                <Link href='/events'>
                    <a className={styles.back}>{'<'} Go Back</a>
                </Link>
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ query: { slug } }) {
    const req = await fetch(`${API_URL}/api/events?[populate]=*&slug=${slug}`);
    const res = await req.json();

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
        },
    };
}
