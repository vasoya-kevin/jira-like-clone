import { verifyJWTToken } from "#helpers/authentication.helper.js";
import { getUserById } from "#models/users.model.js";
import { SERVER_CONFIG } from "#config.js";

const { roles } = SERVER_CONFIG;

export const authenticate = async (request, response, next) => {
    try {
        const authorizationToken = request.headers['authorization'];
        // console.log('authorizationToken: ', authorizationToken);

        if (!authorizationToken || !authorizationToken.startsWith("Bearer")) {
            return response.status(401).json({ message: 'Token is missing. Access Denied.', status: false });
        }

        const token = authorizationToken.split(' ')[1];

        const decryptedToken = verifyJWTToken(token);

        if (!decryptedToken?.userId) {
            return response.status(401).json({ status: false, message: 'Token is invalid.' })
        }

        const user = await getUserById(decryptedToken?.userId)

        if (!user) {
            return response.status(404).json({ message: 'User not found', status: false });
        }

        const { password, ...normalizeUser } = user.toObject();

        request.user = normalizeUser;
        next();
    } catch (error) {
        console.log('error: ', error);
        response.status(401).json({ message: 'Invalid token' });
    }
}

export const checkPermission = (permission) => {
    return (request, response, next) => {
        try {
            const user = request?.user;

            if (!request.user) {
                return response.status(401).json({
                    message: 'Unauthorized',
                    status: false
                });
            }

            const userRole = user?.role?.toLowerCase();

            const getRoleConfig = roles[userRole];
            const access = getRoleConfig?.access;

            if (!access?.includes(permission)) {
                return response.status(403).json({ message: `Forbidden.` });
            }

            next();
        } catch (error) {
            console.log('error: ', error);
            return response.status(403).json({ message: `Forbidden.` });
        }
    }
}

export const checkOwnershipOrAdmin = (request, response, next) => {
    if (
        request.user.role === 'admin' ||
        request.user._id.toString() === request.params.id
    ) {
        return next();
    }

    return response.status(403).json({
        message: 'Forbidden: You can only modify your own data',
        status: false
    });
};
