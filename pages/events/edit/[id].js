import { FaImage } from 'react-icons/fa';
import moment from 'moment';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import ImageUpload from '@/components/ImageUpload';

export default function EditEventPage({ evt }) {
    const [values, setValues] = useState({
        name: evt.attributes.name,
        performers: evt.attributes.performers,
        venue: evt.attributes.venue,
        address: evt.attributes.address,
        date: evt.attributes.date,
        time: evt.attributes.time,
        description: evt.attributes.description,
    });

    const imgSource = evt.attributes.image?.data?.attributes.formats.thumbnail.url;

    const [imagePreview, setImagePreview] = useState(imgSource ? imgSource : null);
    const [showModal, setShowModal] = useState(false);

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
        const req = await fetch(`${API_URL}/api/events/${evt.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: values }),
        });

        //check if res is not okay
        if (!req.ok) {
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

    const imageUploaded = async (e) => {
        const res = await fetch(`${API_URL}/api/events/${evt.id}?[populate]=*`);
        const data = await res.json();
        const filteredData = data.data;
        // console.log(filteredData.attributes?.image?.data?.attributes.formats.thumbnail.url);
        setImagePreview(filteredData.attributes?.image?.data?.attributes.formats.thumbnail.url);
        setShowModal(false);
    };

    return (
        <Layout title='Edit Event'>
            <Link href='/events'>Go Back</Link>
            <h1>Edit Event</h1>
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
                        <input type='date' name='date' id='date' value={moment(values.date).format('yyyy-MM-DD')} onChange={handleInputChange} />
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

                <input type='submit' value='Update Event' className='btn' />
            </form>

            <h2>Event Image</h2>
            {imagePreview ? (
                <Image src={imagePreview} height={100} width={170} alt={values.name} />
            ) : (
                <div>
                    <p>No image uploaded</p>
                </div>
            )}
            <div>
                <button className='btn-secondary' onClick={() => setShowModal(true)}>
                    <FaImage /> Set Image
                </button>
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} />
            </Modal>
        </Layout>
    );
}

export async function getServerSideProps({ params: { id } }) {
    const req = await fetch(`${API_URL}/api/events/${id}?[populate]=*`);
    const res = await req.json();

    const evt = res.data;

    if (!evt) {
        return {
            evt: null,
            notFound: true,
        };
    }

    return {
        props: {
            evt,
        },
    };
}
