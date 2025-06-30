# Community Invitation System

This document describes the community invitation feature that allows users to invite others to join communities with a contributor role.

## Overview

The invitation system enables community members to invite other users to join their communities. When an invitation is accepted, the invited user automatically becomes a contributor in the community.

## Database Models

### CommunityInvitation Model
- `id`: Primary key
- `inviterId`: ID of the user sending the invitation
- `inviteeId`: ID of the user receiving the invitation
- `communityId`: ID of the community being joined
- `status`: Invitation status ('pending', 'accepted', 'declined', 'expired')
- `invitedRole`: Role assigned when invitation is accepted (default: 'contributor')
- `message`: Optional message from the inviter
- `expiresAt`: Expiration date (default: 7 days from creation)

## API Endpoints

### Send Invitation
```
POST /api/community-invitations/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "communityId": 1,
  "inviteeEmail": "user@example.com",
  "message": "Join our amazing community!"
}
```

### Get Received Invitations
```
GET /api/community-invitations/received
Authorization: Bearer <token>
```

### Get Sent Invitations
```
GET /api/community-invitations/sent
Authorization: Bearer <token>
```

### Accept Invitation
```
PUT /api/community-invitations/:invitationId/accept
Authorization: Bearer <token>
```

### Decline Invitation
```
PUT /api/community-invitations/:invitationId/decline
Authorization: Bearer <token>
```

### Cancel Invitation (by sender)
```
DELETE /api/community-invitations/:invitationId/cancel
Authorization: Bearer <token>
```

## Community Membership Endpoints

### Get Community Members
```
GET /api/communities/:communityId/members
```

### Check Membership Status
```
GET /api/communities/:communityId/membership
Authorization: Bearer <token>
```

## Business Rules

1. **Permission Check**: Only existing community members can send invitations
2. **Duplicate Prevention**: Users cannot be invited if they're already members
3. **Pending Invitation Check**: Only one pending invitation per user per community
4. **Expiration**: Invitations expire after 7 days
5. **Role Assignment**: Accepted invitations automatically assign the 'contributor' role

## Response Examples

### Successful Invitation Creation
```json
{
  "id": 1,
  "inviterId": 1,
  "inviteeId": 2,
  "communityId": 1,
  "status": "pending",
  "invitedRole": "contributor",
  "message": "Join our amazing community!",
  "expiresAt": "2024-01-15T10:00:00.000Z",
  "Inviter": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "Invitee": {
    "id": 2,
    "username": "jane_smith",
    "email": "jane@example.com"
  },
  "Community": {
    "id": 1,
    "name": "Tech Enthusiasts"
  }
}
```

### Error Responses
```json
{
  "error": "You must be a member of the community to send invitations"
}
```

```json
{
  "error": "User with this email not found"
}
```

```json
{
  "error": "User is already a member of this community"
}
```

## Usage Flow

1. **Send Invitation**: Community member sends invitation to another user by email
2. **Receive Invitation**: Invited user receives notification of pending invitation
3. **Accept/Decline**: Invited user can accept or decline the invitation
4. **Automatic Membership**: Upon acceptance, user becomes community contributor
5. **Expiration**: Pending invitations expire after 7 days

## Security Considerations

- All invitation endpoints require authentication
- Users can only cancel invitations they sent
- Users can only accept/decline invitations sent to them
- Invitation expiration prevents stale invitations
- Role-based access control for community membership 