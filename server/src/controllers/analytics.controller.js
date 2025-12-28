import { Tickets } from "#models/tickets.model.js";
import { UserModel } from "#models/users.model.js";

export const getNormalAnalytics = async (request, response) => {
    try {
        const ticketAnalytics = await Tickets.aggregate([
            {
                $facet: {
                    statusStats: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    priorityStats: [
                        {
                            $group: {
                                _id: "$priority",
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    totalTickets: [
                        { $count: "total" }
                    ]
                }
            }
        ]);

        const userAnalytics = await UserModel.aggregate([
            {
                $facet: {
                    roles: [
                        {
                            $group: {
                                _id: "$role",
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    totalUsers: [
                        {
                            $count: "total"
                        }
                    ]
                }
            }
        ]);

        const ticketStats = ticketAnalytics[0];
        const userStats = userAnalytics[0];

        function normalizeStats(arr) {
            return arr.reduce((previous, current) => {
                previous[current._id] = current.count;
                return previous;
            }, {});
        }

        const finalAnalytics = {
            tickets: {
                total: ticketStats.totalTickets[0]?.total || 0,
                ...normalizeStats(ticketStats.statusStats),
            },
            priority: normalizeStats(ticketStats.priorityStats),
            users: {
                total: userStats?.totalUsers[0]?.total,
                ...normalizeStats(userStats.roles)
            },
        };

        return response.status(200).json({ analytics: finalAnalytics, status: true })

    } catch (error) {
        console.log('error: ', error);
        return response.status(500).json({ message: 'Something went wrong.', status: false });
    };
};