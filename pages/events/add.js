import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEventPage({ token }) {
    const [values, setValues] = useState({
        name: '',
        performers: '',
        venue: '',
        address: '',
        date: '',
        time: '',
        description: '',
    });

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //validate fields
        const hasEmptyFields = Object.values(values).some((element) => element === '');

        if (hasEmptyFields) {
            toast.error('Please fill in all fields');
            return;
        }

        //Make the request
        const req = await fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: values }),
        });

        //check if res is not okay
        if (!req.ok) {
            if (req.status === 403 || req.status === 401) {
                toast.error('No token included');
                return;
            }
            toast.error('Something Went Wrong with your request');
        } else {
            const res = await req.json();
            const evt = res.data.attributes;
            router.push(`/events/${evt.slug}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    return (
        <Layout title='Add New Event'>
            <Link href='/events'>Go Back</Link>
            <h1>Add Event</h1>
            <ToastContainer />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div>
                        <label htmlFor='name'>Event Name</label>
                        <input type='text' id='name' name='name' value={values.name} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='performers'>Performers</label>
                        <input type='text' name='performers' id='performers' value={values.performers} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='venue'>Venue</label>
                        <input type='text' name='venue' id='venue' value={values.venue} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='address'>Address</label>
                        <input type='text' name='address' id='address' value={values.address} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='date'>Date</label>
                        <input type='date' name='date' id='date' value={values.date} onChange={handleInputChange} />
                    </div>
                    <div>
                        <label htmlFor='time'>Time</label>
                        <input type='text' name='time' id='time' value={values.time} onChange={handleInputChange} />
                    </div>
                </div>

                <div>
                    <label htmlFor='description'>Event Description</label>
                    <textarea type='text' name='description' id='description' value={values.description} onChange={handleInputChange}></textarea>
                </div>

                <input type='submit' value='Add Event' className='btn' />
            </form>
        </Layout>
    );
}
