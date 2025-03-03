export enum UserAccessLevel {
	ADMIN = 'Admin only',
	USER = 'Authenticated users',
	PUBLIC = 'Public access',
}

/**
 * Utility function to format an API operation summary with user access information
 * @param summary - The endpoint summary
 * @param accessLevel - Access level(s) required for the endpoint
 * @returns Formatted summary string including access information
 */
export function apiSummaryWithAccess(
	summary: string,
	accessLevel: UserAccessLevel | UserAccessLevel[],
): string {
	const accessLevels = Array.isArray(accessLevel) ? accessLevel : [accessLevel];
	return `${summary} [Access: ${accessLevels.join(', ')}]`;
}
