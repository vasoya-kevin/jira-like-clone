import { ApiInstance } from "@/api/api";
import { Loading } from "@/components";
import { ChartPieSeparatorNone } from "@/components/atoms/pie-chart/pie-chart";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext"
import { buildChartData, ticketPriorityColors, ticketStatusColors } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { ArrowRight } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface AnalyticsInterface {
    data: any;
    loading: boolean;
    error: string | null;
}

const initialState = {
    data: [],
    loading: false,
    error: null
}

const Dashboard = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState<AnalyticsInterface>(initialState)
    console.log('analytics: ', analytics);

    const fetchDashboard = async () => {
        try {
            setAnalytics((prev) => ({ ...prev, loading: true }));
            const response = await ApiInstance.get('/analytics');
            return setAnalytics((prev) => ({ ...prev, loading: false, data: response?.data?.analytics }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return setAnalytics({
                    data: null,
                    loading: false,
                    error: error?.response?.data?.message
                })
            }
            setAnalytics({
                data: null,
                loading: false,
                error: 'something went wrong.'
            })


        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [user]);

    if (analytics.loading) {
        return <Loading message="We are gathering information for dashboard." />
    }

    const ticketAnalytics = analytics?.data?.tickets
    const ticketPriority = analytics?.data?.priority
    const userAnalytics = analytics?.data?.users

    const chartDataByTicketStatus = buildChartData(
        ticketAnalytics,
        ticketStatusColors
    )

    const chartDataByTicketPriority = buildChartData(
        ticketPriority,
        ticketPriorityColors
    )

    return (
        <section className="my-8 flex flex-col gap-8 max-w-9/12 w-full mx-auto">
            <Card>
                <CardHeader className="grid grid-cols-2 align-middle justify-center items-center">
                    <div>
                        <h1 className="text-3xl text-blue-600 font-semibold">
                            Welcome, {user?.userName}
                        </h1>
                        <p>{user?.email}</p>
                    </div>
                    <Link to={"/profile"} className="underline justify-self-end">
                        View Profile
                    </Link>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-blue-600">Total Tickets</h2>
                    </CardHeader>
                    <CardContent className="text-xl">
                        {ticketAnalytics?.total}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-blue-600">Total Users</h2>
                    </CardHeader>
                    <CardContent className="text-xl">
                        {userAnalytics?.total}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-blue-600">Total Admin</h2>
                    </CardHeader>
                    <CardContent className="text-xl">
                        {userAnalytics?.admin}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="text-blue-600 text-xl flex justify-center items-center h-full underline">
                        <Link to="/tickets" className="flex gap-2 items-center">
                            View Ticket <ArrowRight />
                        </Link>
                    </CardContent>
                </Card>
            </div>
            <h2 className="text-2xl font-semibold bg-accent py-2 px-1 rounded-md">Overall Summary</h2>
            <div className="grid grid-cols-2 gap-4">
                <ChartPieSeparatorNone
                    chartData={chartDataByTicketStatus}
                    cardTitle="Ticket Status Summary"
                    cardDescription="This is the overall summary of tasks based on ticket status"
                    dataKey="value"
                    nameKey="label"
                />

                <ChartPieSeparatorNone
                    chartData={chartDataByTicketPriority}
                    cardTitle="Ticket Priority Summary"
                    cardDescription="This is the overall summary of tasks based on ticket priority"
                    dataKey="value"
                    nameKey="label"
                />
            </div>
        </section>
    );
}

export default Dashboard