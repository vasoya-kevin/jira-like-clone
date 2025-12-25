import { ApiInstance } from '@/api/api';
import { useAuth } from '@/context/AuthContext';
import React, { useCallback, useEffect, useState } from 'react';

const UserListPage = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const { user } = useAuth();

    const getAllUser = useCallback(async () => {
        try {
            setLoading(true);
            const response = await ApiInstance.get('/users');
            setData(response.data?.users);
        } catch (err) {
            console.error('error:', err);
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, []);
console.log(data);
    useEffect(() => {
        if (user) {
            getAllUser();
        }
    }, [user]);

    // if (loading) return <div>Loading users...</div>;
    // if (error) return <div>{error}</div>;

    return (
        <div>

            {data.length === 0 ? (
                <p>No users found</p>
            ) : (
                <ul>
                    {data && data?.map((item) => (
                        <li key={item._id}>
                            <strong>{item.name}</strong> — {item.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserListPage;
