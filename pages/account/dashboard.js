import Layout from '@/components/Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { parseCookies } from '@/helpers/index';
import { API_URL } from '@/config/index';
import DashboardEvent from '@/components/DashboardEvent';
import { useRouter } from 'next/router';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard({ events, token }) {
    const router = useRouter();

    const deleteEvent = async (id) => {
        if (confirm('Are you sure?')) {
            const res = await fetch(`${API_URL}/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
            } else {
                router.reload();
            }
        }
    };

    return (
        <Layout title='User Dashboard'>
            <div className={styles.dash}>
                <h1>Welcome to your dashboard</h1>
                <h3>My Events</h3>
                <ToastContainer />
                {events.map((evt) => (
                    <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
                ))}
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    const { token } = parseCookies(req);

    const res = await fetch(`${API_URL}/api/events/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const events = await res.json();

    return {
        props: {
            events,
        },
    };
}
